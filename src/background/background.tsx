import * as React from "react";

type Command = "tabs" | "commands";

interface WindowInfo {
    command: Command;
    id: number;
}

export let chrometrolWindow: WindowInfo | null = null;

const WIDTH = 600;
const HEIGHT = 500;

function createWindow(command: Command) {
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
            chrometrolWindow = {
                command,
                id: window.id
            };
        }
    });
}

function onCommand(command: Command) {
    if (chrometrolWindow) {
        if (chrometrolWindow.command !== command) {
            chrome.windows.remove(chrometrolWindow.id, () => createWindow(command));
        } else {
            let windowCopy = chrometrolWindow;
            chrome.windows.getLastFocused(lastFocused => {
                if (lastFocused.id === windowCopy.id) {
                    chrome.windows.remove(windowCopy.id);
                } else {
                    chrome.windows.update(windowCopy.id, { focused: true });
                }
            });
        }
    } else {
        createWindow(command);
    }
}

function onRemoveWindow(windowId: number) {
    if (chrometrolWindow && chrometrolWindow.id === windowId) {
        chrometrolWindow = null;
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