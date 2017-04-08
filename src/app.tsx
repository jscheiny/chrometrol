import "es6-shim";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { hashHistory, IndexRedirect, Route, Router } from "react-router";

import { BackgroundPage } from "./background/background";
import { TabsPage } from "./tabs/tabsPage";
import { CommandsPalette } from "./commands/commandsPalette";
import { cssRule, Colors, fontFace } from "./style";

const appElement = document.createElement("div");
appElement.id = "app";
document.body.appendChild(appElement);

fontFace({
    fontFamily: "Source Sans Pro",
    fontStyle: "normal",
    fontWeight: 400,
    src: "https://fonts.googleapis.com/css?family=Source+Sans+Pro:400",
});

cssRule("body", {
    margin: 0,
    fontFamily: "'Source Sans Pro', sans-serif",
    background: Colors.Background.MAIN,
    color: Colors.Foreground.MAIN,
});

ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRedirect to="background"/>
            <Route path="background" component={BackgroundPage} />
            <Route path="tabs" component={TabsPage} />
            <Route path="commands" component={CommandsPalette} />
        </Route>
    </Router>
), appElement);
