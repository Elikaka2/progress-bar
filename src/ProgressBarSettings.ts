export type ProgressBarStyle =
    | "modern"
    | "classic";

export type ProgressBarLanguage =
    | "en"
    | "ru";

export interface ProgressBarSettings {
    style: ProgressBarStyle;
    language: ProgressBarLanguage;

    showCount: boolean;

    fillColor: string;
    emptyColor: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;

    borderWidth: number;
    borderRadius: number;
}

export const DEFAULT_SETTINGS: ProgressBarSettings = {
    style: "modern",
    language: "en",

    showCount: true,

    fillColor: "#7c3aed",
    emptyColor: "#d1d5db",
    backgroundColor: "transparent",
    borderColor: "#d1d5db",
    textColor: "var(--text-normal)",

    borderWidth: 1,
    borderRadius: 8
};