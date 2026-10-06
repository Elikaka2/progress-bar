export interface ProgressResult {
    completed: number;
    total: number;
    percentage: number;
}


export class ProgressCalculator {

    static calculate(
        markdown: string
    ): ProgressResult {

        const checkboxRegex =
            /^\s*[-*+]\s+\[([ xX])\]/gm;

        let completed = 0;
        let total = 0;

        let match: RegExpExecArray | null;

        while ((match = checkboxRegex.exec(markdown)) !== null) {

            total++;

            if (
                match[1].toLowerCase() === "x"
            ) {
                completed++;
            }
        }


        const percentage = total === 0
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