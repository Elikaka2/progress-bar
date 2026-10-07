import {
    RangeSetBuilder,
    StateEffect
} from "@codemirror/state";

import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from "@codemirror/view";

import {
    ProgressCalculator,
    ProgressResult
} from "./ProgressCalculator";

import {
    ProgressBarRenderer
} from "./ProgressBarRenderer";

import {
    ProgressBarSettings
} from "./ProgressBarSettings";

import ProgressBarPlugin
    from "./main";


/**
 * Effect used to force Progress Bar decorations
 * to be rebuilt when plugin settings change.
 */
export const refreshProgressBars =
    StateEffect.define<void>();

export const progressBarEditorViews =
    new Set<EditorView>();

/**
 * Widget that replaces [progressBar]
 * with the rendered progress bar.
 */
class ProgressBarWidget
    extends WidgetType {

    constructor(
        private readonly progress: ProgressResult,
        private readonly settings: ProgressBarSettings
    ) {
        super();
    }

    toDOM(): HTMLElement {
        return ProgressBarRenderer.createElement(
            this.progress,
            this.settings
        );
    }

    ignoreEvent(): boolean {
        return true;
    }
}


/**
 * Empty widget used to hide [/progressBar].
 */
class EmptyWidget
    extends WidgetType {

    toDOM(): HTMLElement {
        const element =
            document.createElement("span");

        element.className =
            "progress-bar-hidden-marker";

        return element;
    }

    ignoreEvent(): boolean {
        return true;
    }
}


/**
 * CodeMirror plugin responsible for
 * displaying Progress Bars in Live Preview.
 */
class ProgressBarEditorPlugin {

    decorations: DecorationSet;

    constructor(
        private readonly view: EditorView,
        private readonly plugin: ProgressBarPlugin
    ) {
        progressBarEditorViews.add(view);

        this.decorations =
            this.buildDecorations(view);
    }

    update(update: ViewUpdate): void {
        const settingsChanged =
            update.transactions.some(
                (transaction) =>
                    transaction.effects.some(
                        (effect) =>
                            effect.is(
                                refreshProgressBars
                            )
                    )
            );

        if (
            update.docChanged ||
            update.viewportChanged ||
            settingsChanged
        ) {
            this.decorations =
                this.buildDecorations(
                    update.view
                );
        }
    }

    destroy(): void {
        progressBarEditorViews.delete(
            this.view
        );
    }

    private buildDecorations(
        view: EditorView
    ): DecorationSet {
        const builder =
            new RangeSetBuilder<Decoration>();

        const markdown =
            view.state.doc.toString();

        const lines =
            markdown.split(/\r?\n/);

        const wholeDocumentProgress =
            ProgressCalculator.calculate(
                markdown
            );

        for (
            const range
            of view.visibleRanges
        ) {
            let position =
                range.from;

            while (
                position <= range.to
            ) {
                const line =
                    view.state.doc.lineAt(
                        position
                    );

                const text =
                    line.text.trim();

                /*
                 * [progressBar]
                 */
                if (
                    text === "[progressBar]"
                ) {
                    const lineNumber =
                        line.number - 1;

                    const scope =
                        this.findScope(
                            lines,
                            lineNumber
                        );

                    const progress =
                        scope
                            ? ProgressCalculator.calculateScope(
                                markdown,
                                scope.startLine,
                                scope.endLine
                            )
                            : wholeDocumentProgress;

                    builder.add(
                        line.from,
                        line.to,
                        Decoration.replace({
                            widget:
                                new ProgressBarWidget(
                                    progress,
                                    this.plugin.settings
                                )
                        })
                    );
                }

                /*
                 * [/progressBar]
                 */
                else if (
                    text === "[/progressBar]"
                ) {
                    builder.add(
                        line.from,
                        line.to,
                        Decoration.replace({
                            widget:
                                new EmptyWidget()
                        })
                    );
                }

                if (
                    line.to >= range.to
                ) {
                    break;
                }

                position =
                    line.to + 1;
            }
        }

        return builder.finish();
    }

    /**
     * Finds the closing marker for a
     * specific opening marker.
     */
    private findScope(
        lines: string[],
        openLine: number
    ): {
        startLine: number;
        endLine: number;
    } | null {

        for (
            let i = openLine + 1;
            i < lines.length;
            i++
        ) {
            if (
                lines[i].trim() ===
                "[/progressBar]"
            ) {
                return {
                    startLine:
                        openLine + 1,

                    endLine:
                        i - 1
                };
            }
        }

        /*
         * There is no closing marker.
         *
         * According to our syntax, an opening
         * marker without a closing marker
         * should count the entire document.
         */
        return null;
    }
}


/**
 * Creates the CodeMirror extension for
 * a specific Progress Bar plugin instance.
 */
export function createProgressBarEditorExtension(
    plugin: ProgressBarPlugin
) {
    return ViewPlugin.fromClass(
        class extends ProgressBarEditorPlugin {

            constructor(
                view: EditorView
            ) {
                super(
                    view,
                    plugin
                );
            }
        },
        {
            decorations: (
                value
            ) => value.decorations
        }
    );
}