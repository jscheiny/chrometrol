import * as React from "react";
import { Observable, Subscription } from "rxjs/Rx";

export interface RxModel<S> {
    state$: Observable<S>;
}

export interface RxProps<M extends RxModel<any>> extends React.Props<RxProps<M>> {
    model: M;
}

export class RxComponent<S, M extends RxModel<any>> extends React.Component<RxProps<M>, S> {
    private subscription: Subscription;

    constructor(props?: RxProps<M>) {
        super(props);
    }

    public componentWillMount() {
        this.subscription = this.props.model.state$.subscribe((state: S) => this.setState(state));
    }

    public componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    public componentWillReceiveProps(nextProps: RxProps<M>) {
        if (nextProps.model !== this.props.model) {
            this.subscription.unsubscribe();
            this.subscription = nextProps.model.state$.subscribe((state: S) => this.setState(state));
        }
    }
}
