import * as React from "react";

import { QueryMatches } from "../utils/query";
import { style, Colors } from "../style";

export interface MatchTextProps {
    source: string;
    matches: QueryMatches | undefined;
    highlighted: boolean;
    className?: string;
}

export class MatchText extends React.Component<MatchTextProps, {}> {
    public render() {
        if (!this.props.matches) {
            return <div className={this.props.className}>{this.props.source}</div>
        }

        let {source} = this.props;
        let {ranges} = this.props.matches;
        let lastIndex = 0;
        let parts: (JSX.Element | string)[] = [];
        let style = this.props.highlighted ? highlightedMatch : match;
        for (var i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            parts.push(source.substring(lastIndex, range.start));
            parts.push(
                <span className={style.className} key={`match-${range.start}-${range.length}`}>
                    {source.substr(range.start, range.length)}
                </span>
            );
            lastIndex = range.start + range.length;
        }
        parts.push(source.substr(lastIndex));

        return <div className={this.props.className}>{parts}</div>;
    }
}

// Styles

const match = style({
    textShadow: `0 1px 2px ${Colors.MATCH_SHADOW}`,
    color: Colors.Foreground.MATCH,
});

const highlightedMatch = style({
    textShadow: `0 1px 2px ${Colors.MATCH_SHADOW}`,
    color: Colors.Foreground.HIGHLIGHTED_MATCH,
})
