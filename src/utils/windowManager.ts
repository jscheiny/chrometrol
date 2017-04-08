const WIDTH = 600;
const HEIGHT = 500;

export type WindowCommand = "tabs" | "commands";

export interface ChromeWindow {
    id: number;
    command: WindowCommand;
}

export class WindowManager {
    public static readonly instance = new WindowManager().initialize();

    private current: ChromeWindow | null = null;

    private initialize(): WindowManager {
        chrome.commands.onCommand.addListener(this.onCommand);
        chrome.windows.onRemoved.addListener(this.onRemoveWindow);
        return this;
    }

    private readonly onCommand = (command: WindowCommand) => {
        if (this.current) {
            if (this.current.command !== command) {
                chrome.windows.remove(this.current.id, () => this.createWindow(command));
            } else {
                chrome.windows.remove(this.current.id);
            }
        } else {
            this.createWindow(command);
        }
    }

    private readonly onRemoveWindow = (windowId: number) => {
        if (this.current && this.current.id === windowId) {
            this.current = null;
        }
    }

    private readonly createWindow = (command: WindowCommand) => {
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
                this.current = {
                    command,
                    id: window.id
                };
            }
        });
    }
}
