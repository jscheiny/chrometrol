import * as typestyle from "typestyle";

class Style {
    constructor(public readonly styles: typestyle.types.NestedCSSProperties, 
                public readonly className: string) {}
}

export function style(...styles: (typestyle.types.NestedCSSProperties | null | undefined | Style)[]) {
    let extracted = styles.map(s => (s instanceof Style) ? s.styles : s);
    let combinedStyles = typestyle.extend(...extracted);
    return new Style(combinedStyles, typestyle.style(combinedStyles));
}

export function classes(...classes: (string | false | undefined | null | Style)[]): string {
    let extracted = classes.map(s => (s instanceof Style) ? s.className : s);
    return typestyle.classes(...extracted);
}

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
