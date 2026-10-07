import {
    MarkdownPostProcessorContext,
    Plugin,
    TFile
} from "obsidian";

import {
    ProgressCalculator
} from "./ProgressCalculator";

import {
    ProgressBarRenderer
} from "./ProgressBarRenderer";

import {
    ProgressBarCommands
} from "./ProgressBarCommands";

import {
    DEFAULT_SETTINGS,
    ProgressBarSettings
} from "./ProgressBarSettings";

import {
    ProgressBarSettingTab
} from "./ProgressBarSettingTab";

import {
    createProgressBarEditorExtension,
    progressBarEditorViews,
    refreshProgressBars
} from "./ProgressBarEditorExtension";


const PROGRESS_BAR_MARKER =
    "[progressBar]";

const PROGRESS_BAR_CLOSE_MARKER =
    "[/progressBar]";


export default class ProgressBarPlugin
    extends Plugin {

    settings!: ProgressBarSettings;


    async onload(): Promise<void> {
        /*
         * Load saved settings first.
         */
        await this.loadSettings();


        /*
         * Register commands and context menu.
         */
        ProgressBarCommands.register(
            this
        );


        /*
         * Add settings tab.
         */
        this.addSettingTab(
            new ProgressBarSettingTab(
                this.app,
                this
            )
        );


        /*
         * Register CodeMirror extension
         * for Live Preview.
         */
        this.registerEditorExtension(
            createProgressBarEditorExtension(
                this
            )
        );


        /*
         * Register Reading View processor.
         */
        this.registerMarkdownPostProcessor(
            (
                element: HTMLElement,
                context: MarkdownPostProcessorContext
            ) =>
                this.renderProgressBars(
                    element,
                    context
                )
        );
    }


    /**
     * Loads plugin settings.
     */
    async loadSettings(): Promise<void> {
        const saved =
            await this.loadData();

        this.settings = {
            ...DEFAULT_SETTINGS,
            ...saved
        };
    }


    /**
     * Saves plugin settings and refreshes
     * Progress Bars in open editors.
     */
    async saveSettings(): Promise<void> {
        await this.saveData(
            this.settings
        );

        this.refreshEditors();
    }

    refreshEditors(): void {
    for (
        const editorView
        of progressBarEditorViews
    ) {
        editorView.dispatch({
            effects:
                refreshProgressBars.of(
                    undefined
                )
        });
    }
}


    /**
     * Renders Progress Bars in Reading View.
     */
    private async renderProgressBars(
        element: HTMLElement,
        context: MarkdownPostProcessorContext
    ): Promise<void> {

        /*
         * Find all paragraph elements.
         */
        const markerElements =
            Array.from(
                element.querySelectorAll(
                    "p"
                )
            );


        /*
         * If there are no paragraphs,
         * there is nothing to process.
         */
        if (
            markerElements.length === 0
        ) {
            return;
        }


        /*
         * Find the Markdown file.
         */
        const file =
            this.app.vault
                .getAbstractFileByPath(
                    context.sourcePath
                );


        /*
         * We need a real TFile because
         * cachedRead() expects TFile.
         */
        if (
            !(file instanceof TFile)
        ) {
            return;
        }


        /*
         * Read the current Markdown.
         */
        const content =
            await this.app.vault.cachedRead(
                file
            );


        const lines =
            content.split(/\r?\n/);


        /*
         * Progress for the entire document.
         */
        const wholeDocumentProgress =
            ProgressCalculator.calculate(
                content
            );


        /*
         * Process all potential markers.
         */
        for (
            let i = 0;
            i < markerElements.length;
            i++
        ) {
            const marker =
                markerElements[i];

            const text =
                marker.textContent?.trim();


            /*
             * Opening marker.
             */
            if (
                text ===
                PROGRESS_BAR_MARKER
            ) {
                const markerLine =
                    this.findMarkerLine(
                        lines,
                        PROGRESS_BAR_MARKER,
                        i
                    );


                /*
                 * If we cannot determine
                 * the line, use whole document.
                 */
                const progress =
                    markerLine === null
                        ? wholeDocumentProgress
                        : this.getScopedProgress(
                            content,
                            lines,
                            markerLine
                        );


                marker.replaceWith(
                    ProgressBarRenderer.createElement(
                        progress,
                        this.settings
                    )
                );
            }


            /*
             * Closing marker.
             */
            else if (
                text ===
                PROGRESS_BAR_CLOSE_MARKER
            ) {
                const hidden =
                    document.createElement(
                        "span"
                    );

                hidden.className =
                    "progress-bar-hidden-marker";

                marker.replaceWith(
                    hidden
                );
            }
        }
    }


    /**
     * Finds the line of the Nth occurrence
     * of a marker.
     */
    private findMarkerLine(
        lines: string[],
        marker: string,
        occurrence: number
    ): number | null {

        let found = 0;


        for (
            let i = 0;
            i < lines.length;
            i++
        ) {
            if (
                lines[i].trim() ===
                marker
            ) {
                if (
                    found === occurrence
                ) {
                    return i;
                }

                found++;
            }
        }


        return null;
    }


    /**
     * Returns progress for a scoped
     * [progressBar] ... [/progressBar] block.
     *
     * If no closing marker exists,
     * the entire document is counted.
     */
    private getScopedProgress(
        content: string,
        lines: string[],
        openLine: number
    ) {

        for (
            let i = openLine + 1;
            i < lines.length;
            i++
        ) {
            if (
                lines[i].trim() ===
                PROGRESS_BAR_CLOSE_MARKER
            ) {
                return ProgressCalculator.calculateScope(
                    content,
                    openLine + 1,
                    i - 1
                );
            }
        }


        /*
         * No closing marker:
         * count the whole document.
         */
        return ProgressCalculator.calculate(
            content
        );
    }
}