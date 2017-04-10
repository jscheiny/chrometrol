import * as _ from "lodash";
import { BehaviorSubject, Observable, Subject } from "rxjs/Rx";

import { RxModel } from "../utils/rxComponent";
import { findMatches, QueryMatches } from "../utils/query";
import { Tab, TabsModel } from "./tabsModel";

export interface DisplayedTab {
    item: Tab;
    score: number;
    titleMatches?: QueryMatches;
    urlMatches?: QueryMatches;
}

export interface TabsPaletteState {
    tabs: Tab[];
    displayedTabs: DisplayedTab[];
    highlightedTabIndex: number;
    query: string;
}

const DEFAULT_STATE: TabsPaletteState = {
    tabs: [],
    displayedTabs: [],
    highlightedTabIndex: 0,
    query: "",
};

export class TabsPaletteModel implements RxModel<TabsPaletteState> {
    private tabsModel = new TabsModel();

    private highlightedTabIndex$ = new Subject<number>();
    private query$ = new BehaviorSubject<string>("");

    public state$: Observable<TabsPaletteState>;

    public highlightTabAtIndex(index: number) {
        this.highlightedTabIndex$.next(index);
    }

    public query(query: string) {
        this.query$.next(query);
    }

    constructor() {
        this.state$ = Observable.merge(this.defineTabs$(), this.defineQuery$(), this.defineHighlightedTabIndex$())
            .scan(this.reduceState);
    }

    private defineTabs$(): Observable<Partial<TabsPaletteState>> {
        return this.tabsModel.state$.map(tabs => ({ tabs }));
    }

    private defineQuery$(): Observable<Partial<TabsPaletteState>> {
        return this.query$.map(query => ({ query, highlightedTabIndex: 0 }));
    }

    private defineHighlightedTabIndex$(): Observable<Partial<TabsPaletteState>> {
        return this.highlightedTabIndex$.map(highlightedTabIndex => ({ highlightedTabIndex }));
    }

    private reduceState = (state: TabsPaletteState, partial: Partial<TabsPaletteState>): TabsPaletteState => {
        let update = _.assign({}, DEFAULT_STATE, state, partial);
        let displayedTabs = getDisplayedTabs(update.query, update.tabs);
        let highlightedTabIndex = getHighlightedTabIndex(state, partial, displayedTabs);
        let highlightedDisplayedTab = displayedTabs[highlightedTabIndex];
        if (highlightedDisplayedTab) {
            let highlightedTab = highlightedDisplayedTab.item;
            chrome.tabs.highlight({ windowId: highlightedTab.windowId, tabs: highlightedTab.index }, _.noop);
        }
        return {
            tabs: update.tabs,
            displayedTabs,
            highlightedTabIndex,
            query: update.query,
        };
    }
}

function getDisplayedTabs(query: string, tabs: Tab[]): DisplayedTab[] {
    return _(tabs)
        .map(tab => getMatch(query, tab))
        .filter(tab => tab !== null)
        .map(tab => tab as DisplayedTab)
        .sortBy(tab => -tab.score)
        .value();
}

function getMatch(query: string | undefined, tab: Tab): DisplayedTab | null {
    let titleMatches = findMatches(query || "", getTabProperty(tab.title));
    let urlMatches = findMatches(query || "", getTabProperty(tab.url));

    if (!titleMatches && !urlMatches) {
        return null;
    }

    return {
        item: tab,
        score: getScore(titleMatches) + 0.5 * getScore(urlMatches),
        titleMatches,
        urlMatches
    };
}

function getTabProperty(prop?: string) {
    return (prop || "").toLowerCase();
}

function getScore(match?: QueryMatches) {
    return match ? match.score : 0;
}

function getHighlightedTabIndex(state: TabsPaletteState,
                                partial: Partial<TabsPaletteState>,
                                displayedTabs: DisplayedTab[]) {
    if (partial.highlightedTabIndex !== undefined) {
        return partial.highlightedTabIndex;
    }
    if (state.displayedTabs.length === 0) {
        return 0;
    }
    let tabId = state.displayedTabs[state.highlightedTabIndex].item.id;
    return _.findIndex(displayedTabs, tab => tab.item.id === tabId) || 0;
}
