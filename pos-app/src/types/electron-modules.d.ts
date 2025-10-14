declare module 'electron-is-dev' {
  const isDev: boolean;
  export default isDev;
}

// Augment the electron module
declare namespace Electron {
  interface App {
    on(event: string, callback: Function): void;
    quit(): void;
    whenReady(): Promise<void>;
  }

  interface BrowserWindow {
    on(event: string, callback: Function): void;
    loadURL(url: string): Promise<void>;
    loadFile(filePath: string): Promise<void>;
    webContents: {
      openDevTools(): void;
    };
  }

  interface IpcMain {
    on(channel: string, listener: (event: any, ...args: any[]) => void): void;
    handle(channel: string, listener: (event: any, ...args: any[]) => void): void;
  }

  interface IpcRenderer {
    on(channel: string, listener: (event: any, ...args: any[]) => void): void;
    send(channel: string, ...args: any[]): void;
    invoke(channel: string, ...args: any[]): Promise<any>;
  }

  interface ContextBridge {
    exposeInMainWorld(key: string, api: any): void;
  }
}

declare module 'electron' {
  export const app: Electron.App;
  export const ipcMain: Electron.IpcMain;
  export const ipcRenderer: Electron.IpcRenderer;
  export const contextBridge: Electron.ContextBridge;
  
  export class BrowserWindow {
    constructor(options: {
      width?: number;
      height?: number;
      webPreferences?: {
        nodeIntegration?: boolean;
        contextIsolation?: boolean;
        preload?: string;
      };
    });

    on(event: string, callback: Function): void;
    loadURL(url: string): Promise<void>;
    loadFile(filePath: string): Promise<void>;
    webContents: {
      openDevTools(): void;
    };
  }
}

declare module 'electron-is-dev' {
  const isDev: boolean;
  export default isDev;
}

declare let __dirname: string;
declare let process: {
  platform: string;
};