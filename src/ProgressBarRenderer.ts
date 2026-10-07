import {
    ProgressResult
} from "./ProgressCalculator";

import {
    ProgressBarLanguage,
    ProgressBarSettings
} from "./ProgressBarSettings";

export class ProgressBarRenderer {
    static createElement(
        progress: ProgressResult,
        settings: ProgressBarSettings
    ): HTMLElement {
        if (settings.style === "classic") {
            return this.createClassicElement(
                progress,
                settings
            );
        }

        return this.createModernElement(
            progress,
            settings
        );
    }

    private static createModernElement(
        progress: ProgressResult,
        settings: ProgressBarSettings
    ): HTMLElement {
        const container =
            document.createElement("div");

        container.className =
            "progress-bar progress-bar-modern";

        const percentage =
            Math.max(
                0,
                Math.min(
                    100,
                    progress.percentage
                )
            );

        const track =
            document.createElement("div");

        track.className =
            "progress-bar-track";

        const fill =
            document.createElement("div");

        fill.className =
            "progress-bar-fill";

        fill.style.width =
            `${percentage}%`;

        track.appendChild(fill);

        container.appendChild(track);

        const info =
            document.createElement("div");

        info.className =
            "progress-bar-info";

        const percentageElement =
            document.createElement("span");

        percentageElement.className =
            "progress-bar-percentage";

        percentageElement.textContent =
            `${percentage}%`;

        info.appendChild(
            percentageElement
        );

        if (settings.showCount) {
            const count =
                document.createElement("span");

            count.className =
                "progress-bar-count";

            count.textContent =
                this.getCountText(
                    progress,
                    settings.language
                );

            info.appendChild(count);
        }

        container.appendChild(info);

        this.applyColors(
            container,
            settings
        );

        return container;
    }

    private static createClassicElement(
        progress: ProgressResult,
        settings: ProgressBarSettings
    ): HTMLElement {
        const container =
            document.createElement("div");

        container.className =
            "progress-bar progress-bar-classic";

        const percentage =
            Math.max(
                0,
                Math.min(
                    100,
                    progress.percentage
                )
            );

        const barLength = 30;

        const percentageText =
            `${percentage}%`;

        const availableLength =
            Math.max(
                0,
                barLength -
                percentageText.length
            );

        const filledLength =
            Math.round(
                (percentage / 100) *
                availableLength
            );

        const emptyLength =
            availableLength -
            filledLength;

        const filled =
            "=".repeat(
                Math.max(
                    0,
                    filledLength
                )
            );

        const empty =
            ".".repeat(
                Math.max(
                    0,
                    emptyLength
                )
            );

        const bar =
            document.createElement("span");

        bar.className =
            "progress-bar-classic-text";

        bar.textContent =
            `[${filled}${percentageText}${empty}]`;

        container.appendChild(bar);

        if (settings.showCount) {
            const count =
                document.createElement("span");

            count.className =
                "progress-bar-count";

            count.textContent =
                this.getCountText(
                    progress,
                    settings.language
                );

            container.appendChild(count);
        }

        this.applyColors(
            container,
            settings
        );

        return container;
    }

    private static getCountText(
        progress: ProgressResult,
        language: ProgressBarLanguage
    ): string {
        if (language === "ru") {
            return `${progress.completed} из ${progress.total} выполнено`;
        }

        return `${progress.completed} of ${progress.total} completed`;
    }

    private static applyColors(
        element: HTMLElement,
        settings: ProgressBarSettings
    ): void {
        element.style.setProperty(
            "--progress-fill",
            settings.fillColor
        );

        element.style.setProperty(
            "--progress-empty",
            settings.emptyColor
        );

        element.style.setProperty(
            "--progress-background",
            settings.backgroundColor
        );

        element.style.setProperty(
            "--progress-border",
            settings.borderColor
        );

        element.style.setProperty(
            "--progress-text",
            settings.textColor
        );

        element.style.setProperty(
            "--progress-border-width",
            `${settings.borderWidth}px`
        );

        element.style.setProperty(
            "--progress-border-radius",
            `${settings.borderRadius}px`
        );
    }
}