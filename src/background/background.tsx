import * as React from "react";

type Command = "tabs" | "commands";

interface WindowInfo {
    command: Command;
    id: number;
}

export let currWindow: WindowInfo | null = null;

const WIDTH = 600;
const HEIGHT = 500;

function createWindowHandler(command: Command) {
    return () => {
        let left = (window.screen.availWidth / 2) - (WIDTH / 2);
        let options: chrome.windows.CreateData = {
            url: `site/index.html#/${command}`,
            focused: true,
            width: WIDTH,
            height: HEIGHT,
            left,
            top: 0,
            type: "popup" 
        };
        chrome.windows.create(options, window => {
            if (window) {
                currWindow = {
                    command,
                    id: window.id
                };
            }
        });
    };
}

function onCommand(command: Command) {
    if (currWindow) {
        if (currWindow.command !== command) {
            chrome.windows.remove(currWindow.id, createWindowHandler(command));
        } else {
            chrome.windows.remove(currWindow.id);
        }
    } else {
        createWindowHandler(command)();
    }
}

function onRemoveWindow(windowId: number) {
    if (currWindow && currWindow.id === windowId) {
        currWindow = null;
    }
}

export class BackgroundPage extends React.Component<{}, {}> {
    public render() {
        return null;
    }

    public componentWillMount() {
        chrome.commands.onCommand.addListener(onCommand);
        chrome.windows.onRemoved.addListener(onRemoveWindow);
    }
}