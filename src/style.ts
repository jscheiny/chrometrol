import * as typestyle from "typestyle";

export const Colors = {
    Foreground: {
        MAIN: "#D8E1E8",
        MATCH: "#00B3A4",
        SELECTED: "#EBF1F5",
        SELECTED_MATCH: "#2EE6D6",
    },
    Background: {
        MAIN: "#202B33",
        SELECTED: "#394B59",
    },
    MATCH_SHADOW: "#182026",
};

export class Style {
    constructor(public readonly styles: typestyle.types.NestedCSSProperties,
        public readonly className: string) { }
}

export function style(...styles: Array<typestyle.types.NestedCSSProperties | null | undefined | Style>) {
    let extracted = styles.map(s => (s instanceof Style) ? s.styles : s);
    let combinedStyles = typestyle.extend(...extracted);
    return new Style(combinedStyles, typestyle.style(combinedStyles));
}

export function classes(...classes: Array<string | false | undefined | null | Style>): string {
    let extracted = classes.map(s => (s instanceof Style) ? s.className : s);
    return typestyle.classes(...extracted);
}

export function important(property: string) {
    return `${property} !important`;
}

export const blenderFamily = "Blender-PRO, Helvetica, sans-serif, Icons16";
export const sourceCodeFamily = `"Source-Code-Pro", "Courier New", monospace, "Icons16"`;

export {
    cssRaw,
    cssRule,
    extend,
    fontFace,
    forceRenderStyles,
    getStyles,
    keyframes,
    media,
    reinit,
    setStylesTarget,
    types
} from "typestyle";
