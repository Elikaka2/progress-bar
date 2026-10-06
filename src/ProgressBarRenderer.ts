export class ProgressBarRenderer {
    private static readonly BAR_LENGTH = 30;

    static createElement(percentage: number): HTMLElement {
        const container = document.createElement("div");

        container.className = "progress-bar";

        const percentageText = `${percentage}%`;

        const barLength =
            this.BAR_LENGTH -
            percentageText.length;

        const filledLength = Math.round(
            (percentage / 100) * barLength
        );

        const emptyLength =
            barLength - filledLength;

        const filled =
            "=".repeat(Math.max(0, filledLength));

        const empty =
            ".".repeat(Math.max(0, emptyLength));

        container.textContent =
            `[${filled}${percentageText}${empty}]`;

        return container;
    }
}