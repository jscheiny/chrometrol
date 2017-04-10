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
            <div className={container.className}>
                <input type="text" className={input.className}
                    onKeyDown={this.onKeyDown}
                    onChange={this.onQueryChange}
                    onBlur={this.onBlur}
                    ref={this.inputRef}
                    placeholder="Tab title or url..."
                />
                <div className={resultsContainer.className}>
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
        } else if (event.key === "Escape") {
            window.close();
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
        let onClick = () => this.select(tab);
        let highlighted = index === this.state.highlightedTabIndex;
        let className = classes(tabStyle, highlighted ? highlightedTab : notHighlightedTab);
        return (
            <div className={className} key={tab.item.id} onClick={onClick}>
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
        chrome.tabs.highlight({ tabs: [tab.index], windowId: tab.windowId }, () => {
            chrome.windows.update(tab.windowId, { focused: true }, () => window.close());
        });
    }
}

// Styles

const container = style({
    position: "relative",
    height: 600,
    overflow: "auto",
});

const input = style({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    padding: "11px 10px",
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

const resultsContainer = style({
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "scroll",
});

const tabStyle = style({
    padding: 10,
    display: "flex",
    cursor: "pointer",
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

const notHighlightedTab = style({
    $nest: {
        "&:hover": {
            background: Colors.Background.SOFT_HIGHLIGHTED,
        },
    },
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
