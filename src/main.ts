import {
    MarkdownPostProcessorContext,
    Plugin,
    TFile
} from "obsidian";

import { ProgressCalculator } from "./ProgressCalculator";
import { ProgressBarRenderer } from "./ProgressBarRenderer";
import { ProgressBarCommands } from "./ProgressBarCommands";
import {
    progressBarEditorExtension
} from "./ProgressBarEditorExtension";

const PROGRESS_BAR_MARKER = "[progressBar]";

export default class ProgressBarPlugin extends Plugin {
    async onload(): Promise<void> {
        ProgressBarCommands.register(this);

        this.registerEditorExtension(
            progressBarEditorExtension
        );

        this.registerMarkdownPostProcessor(
            (
                element: HTMLElement,
                context: MarkdownPostProcessorContext
            ) => this.renderProgressBars(
                element,
                context
            )
        );
    }

    private async renderProgressBars(
        element: HTMLElement,
        context: MarkdownPostProcessorContext
    ): Promise<void> {
        const markerElements =
            Array.from(
                element.querySelectorAll("p")
            ).filter(
                (el) =>
                    el.textContent?.trim() ===
                    PROGRESS_BAR_MARKER
            );

        if (markerElements.length === 0) {
            return;
        }

        const file =
            this.app.vault.getAbstractFileByPath(
                context.sourcePath
            );

        if (!(file instanceof TFile)) {
            return;
        }

        const content =
            await this.app.vault.cachedRead(file);

        const progress =
            ProgressCalculator.calculate(content);

        for (const markerElement of markerElements) {
            markerElement.replaceWith(
                ProgressBarRenderer.createElement(
                    progress.percentage
                )
            );
        }
    }
}