import {
    RangeSetBuilder
} from "@codemirror/state";

import {
    Decoration,
    DecorationSet,
    EditorView,
    ViewPlugin,
    ViewUpdate,
    WidgetType
} from "@codemirror/view";

import { ProgressCalculator } from "./ProgressCalculator";
import { ProgressBarRenderer } from "./ProgressBarRenderer";

const PROGRESS_BAR_MARKER = "[progressBar]";

class ProgressBarWidget extends WidgetType {
    constructor(
        private readonly percentage: number
    ) {
        super();
    }

    toDOM(): HTMLElement {
        return ProgressBarRenderer.createElement(
            this.percentage
        );
    }

    ignoreEvent(): boolean {
        return true;
    }
}

class ProgressBarEditorPlugin {
    decorations: DecorationSet;

    constructor(view: EditorView) {
    this.decorations =
        this.buildDecorations(view);
}

    update(update: ViewUpdate): void {
        if (update.docChanged || update.viewportChanged) {
            this.decorations =
                this.buildDecorations(update.view);
        }
    }

    destroy(): void {
    }

    private buildDecorations(
        view: EditorView
    ): DecorationSet {
        const builder =
            new RangeSetBuilder<Decoration>();

        const markdown =
            view.state.doc.toString();

        const progress =
            ProgressCalculator.calculate(markdown);

        const percentage =
            progress.percentage;

        for (const range of view.visibleRanges) {
            let position = range.from;

            while (position <= range.to) {
                const line =
                    view.state.doc.lineAt(position);

                if (
                    line.text.trim() ===
                    PROGRESS_BAR_MARKER
                ) {
                    builder.add(
                        line.from,
                        line.to,
                        Decoration.replace({
                            widget:
                                new ProgressBarWidget(
                                    percentage
                                )
                        })
                    );
                }

                if (line.to >= range.to) {
                    break;
                }

                position =
                    line.to + 1;
            }
        }

        return builder.finish();
    }
}

const progressBarEditorPlugin =
    ViewPlugin.fromClass(
        ProgressBarEditorPlugin,
        {
            decorations: (
                plugin
            ) => plugin.decorations
        }
    );

export const progressBarEditorExtension =
    progressBarEditorPlugin;