import {
    App, 
    PluginSettingTab,
    Setting
} from "obsidian";

import ProgressBarPlugin
    from "./main";

import {
    DEFAULT_SETTINGS,
    ProgressBarLanguage,
    ProgressBarStyle
} from "./ProgressBarSettings";

export class ProgressBarSettingTab
    extends PluginSettingTab {

    plugin: ProgressBarPlugin;

    constructor(
        app: App,
        plugin: ProgressBarPlugin
    ) {
        super(app, plugin);

        this.plugin = plugin;
    }

    display(): void {
        const {
            containerEl
        } = this;

        containerEl.empty();

        const language =
            this.plugin.settings.language;

        containerEl.createEl(
            "h2",
            {
                text:
                    language === "ru"
                        ? "Progress Bar"
                        : "Progress Bar"
            }
        );

        new Setting(containerEl)
            .setName(
                language === "ru"
                    ? "Язык"
                    : "Language"
            )
            .setDesc(
                language === "ru"
                    ? "Язык текста Progress Bar."
                    : "Language used by the progress bar."
            )
            .addDropdown((dropdown) => {
                dropdown
                    .addOption(
                        "en",
                        "English"
                    )
                    .addOption(
                        "ru",
                        "Русский"
                    )
                    .setValue(
                        this.plugin.settings.language
                    )
                    .onChange(async (value) => {
                        this.plugin.settings.language =
                            value as ProgressBarLanguage;

                        await this.plugin.saveSettings();

                        this.display();
                    });
            });

        new Setting(containerEl)
            .setName(
                language === "ru"
                    ? "Стиль"
                    : "Style"
            )
            .setDesc(
                language === "ru"
                    ? "Выберите внешний вид Progress Bar."
                    : "Choose the appearance of the progress bar."
            )
            .addDropdown((dropdown) => {
                dropdown
                    .addOption(
                        "modern",
                        language === "ru"
                            ? "Современный"
                            : "Modern"
                    )
                    .addOption(
                        "classic",
                        language === "ru"
                            ? "Классический"
                            : "Classic"
                    )
                    .setValue(
                        this.plugin.settings.style
                    )
                    .onChange(async (value) => {
                        this.plugin.settings.style =
                            value as ProgressBarStyle;

                        await this.plugin.saveSettings();

                        this.plugin.refreshEditors();
                    });
            });

        new Setting(containerEl)
            .setName(
                language === "ru"
                    ? "Показывать количество"
                    : "Show task count"
            )
            .setDesc(
                language === "ru"
                    ? "Показывать количество выполненных задач."
                    : "Show the number of completed tasks."
            )
            .addToggle((toggle) => {
                toggle
                    .setValue(
                        this.plugin.settings.showCount
                    )
                    .onChange(async (value) => {
                        this.plugin.settings.showCount =
                            value;

                        await this.plugin.saveSettings();

                        this.plugin.refreshEditors();
                    });
            });

        containerEl.createEl(
            "h3",
            {
                text:
                    language === "ru"
                        ? "Цвета"
                        : "Colors"
            }
        );

        this.addColorSetting(
            containerEl,
            language === "ru"
                ? "Цвет заполнения"
                : "Fill color",
            language === "ru"
                ? "Цвет выполненной части."
                : "Color of the completed part.",
            "fillColor"
        );

        this.addColorSetting(
            containerEl,
            language === "ru"
                ? "Цвет пустой части"
                : "Empty color",
            language === "ru"
                ? "Цвет незаполненной части."
                : "Color of the remaining part.",
            "emptyColor"
        );

        this.addColorSetting(
            containerEl,
            language === "ru"
                ? "Цвет фона"
                : "Background color",
            language === "ru"
                ? "Фон Progress Bar."
                : "Progress bar background.",
            "backgroundColor"
        );

        this.addColorSetting(
            containerEl,
            language === "ru"
                ? "Цвет рамки"
                : "Border color",
            language === "ru"
                ? "Цвет рамки."
                : "Border color.",
            "borderColor"
        );

        this.addColorSetting(
            containerEl,
            language === "ru"
                ? "Цвет текста"
                : "Text color",
            language === "ru"
                ? "Цвет процентов и счётчика."
                : "Color of percentage and count text.",
            "textColor"
        );

        new Setting(containerEl)
            .setName(
                language === "ru"
                    ? "Толщина рамки"
                    : "Border width"
            )
            .addSlider((slider) => {
                slider
                    .setLimits(
                        0,
                        5,
                        1
                    )
                    .setValue(
                        this.plugin.settings.borderWidth
                    )
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.borderWidth =
                            value;

                        await this.plugin.saveSettings();

                        this.plugin.refreshEditors();
                    });
            });

        new Setting(containerEl)
            .setName(
                language === "ru"
                    ? "Скругление"
                    : "Border radius"
            )
            .addSlider((slider) => {
                slider
                    .setLimits(
                        0,
                        20,
                        1
                    )
                    .setValue(
                        this.plugin.settings.borderRadius
                    )
                    .setDynamicTooltip()
                    .onChange(async (value) => {
                        this.plugin.settings.borderRadius =
                            value;

                        await this.plugin.saveSettings();

                        this.plugin.refreshEditors();
                    });
            });
        new Setting(containerEl)
            .setName(
                language === "ru"
                    ? "Сбросить настройки"
                    : "Reset to default"
            )
            .setDesc(
                language === "ru"
                    ? "Вернуть все настройки Progress Bar к значениям по умолчанию."
                    : "Restore all Progress Bar settings to their default values."
            )
            .addButton((button) => {
                button
                    .setButtonText(
                        language === "ru"
                            ? "Сбросить"
                            : "Reset"
                    )
                    .setWarning()
                    .onClick(async () => {
                        this.plugin.settings = {
                            ...DEFAULT_SETTINGS
                        };

                        await this.plugin.saveSettings();

                        this.display();
                    });
            });
    }

    private addColorSetting(
        containerEl: HTMLElement,
        name: string,
        description: string,
        property:
            | "fillColor"
            | "emptyColor"
            | "backgroundColor"
            | "borderColor"
            | "textColor"
    ): void {
        new Setting(containerEl)
            .setName(name)
            .setDesc(description)
            .addColorPicker((picker) => {
                picker
                    .setValue(
                        this.plugin.settings[property]
                    )
                    .onChange(async (value) => {
                        this.plugin.settings[property] =
                            value;

                        await this.plugin.saveSettings();

                        this.plugin.refreshEditors();
                    });
            });
    }
}