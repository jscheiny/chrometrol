import * as React from "react";

import { TabsPalette } from "./tabsPalette";
import { TabsPaletteModel } from "./tabsPaletteModel";

export class TabsPage extends React.Component<{}, {}> {
    public render() {
        return <TabsPalette model={new TabsPaletteModel()} />
    }
}
