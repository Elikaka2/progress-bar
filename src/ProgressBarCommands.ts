import {
    Editor,
    Menu,
    Plugin
} from "obsidian";

const PROGRESS_BAR_MARKER = "[progressBar]";

export class ProgressBarCommands {
    static register(plugin: Plugin): void {
        this.registerCommand(plugin);
        this.registerContextMenu(plugin);
    }

    private static registerCommand(
        plugin: Plugin
    ): void {
        plugin.addCommand({
            id: "insert-progress-bar",
            name: "Вставить Progress Bar",

            editorCallback: (
                editor: Editor
            ) => {
                editor.replaceSelection(
                    `${PROGRESS_BAR_MARKER}\n`
                );
            }
        });
    }

    private static registerContextMenu(
        plugin: Plugin
    ): void {
        plugin.registerEvent(
            plugin.app.workspace.on(
                "editor-menu",
                (
                    menu: Menu,
                    editor: Editor
                ) => {
                    menu.addItem((item) => {
                        item
                            .setTitle(
                                "Вставить Progress Bar"
                            )
                            .setIcon("percent")
                            .onClick(() => {
                                editor.replaceSelection(
                                    `${PROGRESS_BAR_MARKER}\n`
                                );
                            });
                    });
                }
            )
        );
    }
}