import { chain, defaults, find, head } from "lodash";
import { BehaviorSubject, Observable } from "rxjs/Rx";

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
    query: string;
    selectedTabId: number | undefined;
}

export class TabsPaletteModel implements RxModel<TabsPaletteState> {
    private query$ = new BehaviorSubject<string>("");
    public state$: Observable<TabsPaletteState>;

    public query(query: string) {
        this.query$.next(query);
    }

    constructor() {
        this.state$ = Observable.merge(this.defineTabs$(), this.defineQuery$())
            .scan(this.reduceState);
    }

    private defineTabs$(): Observable<Partial<TabsPaletteState>> {
        return TabsModel.instance.state$.map(tabs => ({ tabs }));
    }

    private defineQuery$(): Observable<Partial<TabsPaletteState>> {
        return this.query$.map(query => ({ query }));
    }

    private reduceState = (state: TabsPaletteState, partial: Partial<TabsPaletteState>): TabsPaletteState => {
        let update = defaults(partial, state);
        let displayedTabs = getDisplayedTabs(update.query, update.tabs);
        return {
            tabs: update.tabs,
            displayedTabs,
            selectedTabId: getSelectedTabId(state.selectedTabId, displayedTabs),
            query: state.query,
        };
    }
}

function getDisplayedTabs(query: string, tabs: Tab[]): DisplayedTab[] {
    return chain(tabs)
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

function getSelectedTabId(id: number | undefined, tabs: DisplayedTab[]): number | undefined {
    let selected = id ? find(tabs, tab => tab.item.id === id) : head(tabs);
    if (selected) {
        return selected.item.id;
    }
    return undefined;
}

function getTabProperty(prop?: string) {
    return (prop || "").toLowerCase();
}

function getScore(match?: QueryMatches) {
    return match ? match.score : 0;
}
