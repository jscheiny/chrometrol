import * as React from "react";

import { QueryMatches } from "../utils/query";
import { style, Colors } from "../style";

export interface MatchTextProps {
    source: string;
    matches: QueryMatches | undefined;
    selected: boolean;
    className?: string;
}

export class MatchText extends React.Component<MatchTextProps, {}> {
    public render() {
        if (!this.props.matches) {
            return <div className="match">{this.props.source}</div>
        }

        let {source} = this.props;
        let {ranges} = this.props.matches;
        let lastIndex = 0;
        let parts: (JSX.Element | string)[] = [];
        for (var i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            parts.push(source.substring(lastIndex, range.start));
            parts.push(
                <span className={highlight.className} key={`match-${range.start}-${range.length}`}>
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

const highlight = style({
    textShadow: `0 1px 2px ${Colors.MATCH_SHADOW}`,
    color: Colors.Foreground.SELECTED_MATCH,
});
