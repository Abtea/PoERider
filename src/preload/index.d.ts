import { ElectronAPI } from '@electron-toolkit/preload'

export interface ClipboardAPI {
    readText: () => string
}

export interface CustomAPI {
    clipboard: ClipboardAPI
    generateLookupID: (payload: object) => string // Add the generateLookupID method
}

declare global {
    interface Window {
        electron: ElectronAPI // ElectronAPI remains under window.electron
        api: CustomAPI // Move CustomAPI under window.api
    }
}
