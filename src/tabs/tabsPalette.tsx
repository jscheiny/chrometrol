import * as React from "react";

import { MatchText } from "./matchText";
import { DisplayedTab, TabsPaletteModel, TabsPaletteState } from "./tabsPaletteModel";
import { RxComponent } from "../utils/rxComponent";
import { classes, style, Colors } from "../style";

export class TabsPalette extends RxComponent<TabsPaletteState, TabsPaletteModel> {
    private input: HTMLInputElement;

    public render() {
        let results = this.state.displayedTabs.map(tab => this.renderTab(tab));
        return (
            <div>
                <input type="text" className={input.className}
                    onKeyDown={this.onKeyDown}
                    onChange={this.onQueryChange}
                    onBlur={this.onBlur}
                    ref={this.inputRef}
                    placeholder="Tab title or url..."
                />
                <div className="results">
                    {results}
                </div>
            </div>
        );
    }

    private readonly onKeyDown = (event: React.KeyboardEvent<any>) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            console.log(event.key);
        } else if (event.key === "Enter") {
            console.log(event.key);
        } else {
            this.onQueryChange(event);
        }
    }

    private readonly onQueryChange = (event: React.FormEvent<any>) => {
        let query = (event.target as HTMLInputElement).value.toLowerCase() || "";
        this.props.model.query(query);
    }

    private readonly onBlur = () => {
        this.input.focus();
    }

    private readonly inputRef = (input: HTMLInputElement) => {
        this.input = input;
        this.input.focus();
    }

    private readonly renderTab = (tab: DisplayedTab) => {
        let selected = tab.item.id === this.state.selectedTabId;
        return (
            <div className={classes(tabStyle, selected && selectedTab)} key={tab.item.id}>
                <MatchText
                    className={title.className}
                    source={tab.item.title || ""}
                    matches={tab.titleMatches}
                    selected={selected}
                />
                <MatchText
                    className={url.className}
                    source={tab.item.url || ""}
                    matches={tab.urlMatches}
                    selected={selected}
                />
            </div>
        );
    }
}

// Styles

const input = style({
    width: "100%",
    padding: 10,
    outline: "none",
    border: "none",
    fontSize: 24,
    color: Colors.Foreground.MAIN,
    background: Colors.Background.MAIN,
    $nest: {
        "&::-webkit-input-placeholder": {
            color: "#5C7080",
        },
    },
});

const tabStyle = style({
    padding: 10,
});

const selectedTab = style({
    background: Colors.Background.SELECTED,
    color: Colors.Foreground.SELECTED,
});

const title = style({
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: ".5px",
});

const url = style({
    opacity: .75,
    fontSize: 14,
});
