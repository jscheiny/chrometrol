import { Dictionary, every } from "lodash";
import { style as typestyle, types, extend } from "typestyle";

interface StyleCondition<M> {
    matcher: M;
    styles: any;
    className: string;
}

class Style<M extends Dictionary<any>> {
    constructor(public readonly styles: types.NestedCSSProperties, 
                private className: string,
                private conditions: StyleCondition<M>[] = []) {
    }

    public when<N extends Dictionary<any>>(matcher: N, styles: types.NestedCSSProperties): Style<M & N> {
        let conditions = this.conditions.slice() as StyleCondition<M & N>[];
        conditions.push({
            className: typestyle(styles),
            styles,
            matcher: matcher as M & N,
        });
        return new Style<M & N>(this.styles, this.className, conditions);
    }

    public apply<P extends M>(props: P): string {
        return this.conditions
            .filter(cond => checkMatch(cond, props))
            .map(cond => cond.className)
            .concat(this.className)
            .join(" ");
    }
}

function checkMatch<M extends Dictionary<any>, P extends M>(cond: StyleCondition<M>, props: P) {
    return every(cond.matcher, (value, key: string) => props[key] === value);
}

export function style(...styles: (types.NestedCSSProperties | null | undefined | Style<any>)[]) {
    let extracted = styles.map(s => (s instanceof Style) ? s.styles : s);
    let combinedStyles = extend(...extracted);
    return new Style<{}>(combinedStyles, typestyle(combinedStyles));
}

export {
    classes,
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
