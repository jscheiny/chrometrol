import { Observable, Subject } from "rxjs/Rx";
import { clone, concat, findIndex } from "lodash";

import { RxModel } from "../utils/rxComponent";

export type Tab = chrome.tabs.Tab;
type TabsUpdate = (tabs: Tab[]) => Tab[];

export class TabsModel implements RxModel<Tab[]> {
    public static readonly instance: TabsModel = new TabsModel().initialize();

    private readonly updates$ = new Subject<TabsUpdate>();
    public state$: Observable<Tab[]>;

    private initialize() {
        this.state$ = this.defineInitialTabs$()
            .merge(this.updates$)
            .scan((tabs: Tab[], update: TabsUpdate) => update(tabs), [])
            .startWith([])
            .share();

        this.defineTabRemovals();
        this.defineTabCreations();
        this.defineTabUpdates();
        return this;
    }

    private defineInitialTabs$(): Observable<TabsUpdate> {
        let allTabs = Observable.bindCallback(chrome.tabs.query)({});
        let currentTab = Observable.bindCallback(chrome.tabs.getCurrent)();
        return Observable.zip(allTabs, currentTab, (all, current) => {
                if (current) {
                    let initial = all.filter(tab => tab.id !== current.id);
                    return () => initial;
                }
                return () => all;
            });
    }

    private defineTabRemovals() {
        chrome.tabs.onRemoved.addListener(removed => {
            this.updates$.next(tabs => tabs.filter(tab => tab.id !== removed));
        });
    }

    private defineTabCreations() {
        chrome.tabs.onCreated.addListener(created => {
            this.updates$.next(tabs => concat(tabs, created));
        });
    }

    private defineTabUpdates() {
        chrome.tabs.onUpdated.addListener((updatedId, _, updated) => {
            this.updates$.next(tabs => {
                let copy = clone(tabs);
                let index = findIndex(tabs, tab => tab.id === updatedId);
                copy[index] = updated;
                return copy;
            });
        });
    }
}
