export interface ProgressResult {
    completed: number;
    total: number;
    percentage: number;
}

export interface ProgressScope {
    startLine: number;
    endLine: number;
}

const CHECKBOX_REGEX =
    /^\s*[-*+]\s+\[([ xX])\]/;

const OPEN_MARKER =
    /^\s*\[progressBar\]\s*$/;

const CLOSE_MARKER =
    /^\s*\[\/progressBar\]\s*$/;

export class ProgressCalculator {
    static calculate(markdown: string): ProgressResult {
        return this.calculateText(markdown);
    }

    static calculateScope(
        markdown: string,
        startLine: number,
        endLine: number
    ): ProgressResult {
        const lines = markdown.split(/\r?\n/);

        const start =
            Math.max(0, startLine);

        const end =
            Math.min(
                lines.length - 1,
                endLine
            );

        return this.calculateLines(
            lines.slice(start, end + 1)
        );
    }

    static findScopes(
        markdown: string
    ): ProgressScope[] {
        const lines =
            markdown.split(/\r?\n/);

        const scopes: ProgressScope[] = [];

        let openLine: number | null = null;

        for (
            let i = 0;
            i < lines.length;
            i++
        ) {
            const line =
                lines[i].trim();

            if (
                line === "[progressBar]"
            ) {
                if (openLine === null) {
                    openLine = i;
                }

                continue;
            }

            if (
                line === "[/progressBar]"
                && openLine !== null
            ) {
                scopes.push({
                    startLine: openLine + 1,
                    endLine: i - 1
                });

                openLine = null;
            }
        }

        return scopes;
    }

    static isOpenMarker(
        line: string
    ): boolean {
        return OPEN_MARKER.test(line);
    }

    static isCloseMarker(
        line: string
    ): boolean {
        return CLOSE_MARKER.test(line);
    }

    private static calculateText(
        markdown: string
    ): ProgressResult {
        return this.calculateLines(
            markdown.split(/\r?\n/)
        );
    }

    private static calculateLines(
        lines: string[]
    ): ProgressResult {
        let completed = 0;
        let total = 0;

        for (const line of lines) {
            const match =
                CHECKBOX_REGEX.exec(line);

            if (!match) {
                continue;
            }

            total++;

            if (
                match[1].toLowerCase() === "x"
            ) {
                completed++;
            }
        }

        const percentage =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );

        return {
            completed,
            total,
            percentage
        };
    }
}