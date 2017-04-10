import * as React from "react";

import { MatchText } from "./matchText";
import { DisplayedTab, TabsPaletteModel, TabsPaletteState } from "./tabsPaletteModel";
import { RxComponent } from "../utils/rxComponent";
import { classes, style, Colors } from "../style";

export class TabsPalette extends RxComponent<TabsPaletteState, TabsPaletteModel> {
    private input: HTMLInputElement;

    public render() {
        let results = this.state.displayedTabs.map(this.renderTab);
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
        if (event.key === "ArrowDown") {
            let nextIndex = Math.min(this.state.highlightedTabIndex + 1, this.state.displayedTabs.length - 1);
            this.highlight(nextIndex, event);
        } else if (event.key === "ArrowUp") {
            let prevIndex = Math.max(0, this.state.highlightedTabIndex - 1);
            this.highlight(prevIndex, event);
        } else if (event.key === "Enter") {
            this.select(this.state.displayedTabs[this.state.highlightedTabIndex]);
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

    private readonly renderTab = (tab: DisplayedTab, index: number) => {
        let onHover = () => this.highlight(index);
        let onClick = () => this.select(tab);
        let highlighted = index === this.state.highlightedTabIndex;
        return (
            <div
                className={classes(tabStyle, highlighted && highlightedTab)}
                key={tab.item.id}
                onMouseEnter={onHover}
                onClick={onClick}
            >
                <img src={tab.item.favIconUrl} className={favIcon.className} />
                <div>
                    <MatchText
                        className={title.className}
                        source={tab.item.title || ""}
                        matches={tab.titleMatches}
                        highlighted={highlighted}
                    />
                    <MatchText
                        className={url.className}
                        source={tab.item.url || ""}
                        matches={tab.urlMatches}
                        highlighted={highlighted}
                    />
                </div>
            </div>
        );
    }

    private highlight(index: number, event?: React.KeyboardEvent<any>) {
        this.props.model.highlightTabAtIndex(index);
        if (event) {
            event.preventDefault();
        }
    }

    private select(displayedTab: DisplayedTab) {
        let tab = displayedTab.item;
        chrome.windows.update(tab.windowId, { focused: true }, () => {
            chrome.tabs.highlight({ tabs: [tab.index], windowId: tab.windowId }, () => window.close());
        });
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
    display: "flex",
});

const favIcon = style({
    width: 25,
    height: 25,
    marginRight: 10,
});

const highlightedTab = style({
    background: Colors.Background.HIGHLIGHTED,
    color: Colors.Foreground.HIGHLIGHTED,
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
