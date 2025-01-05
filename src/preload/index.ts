import { contextBridge, clipboard } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
    clipboard: {
        readText: () => clipboard.readText(),
    },
}

console.log('Preload script executed. Checking clipboard API...')
console.log('Clipboard API available:', typeof clipboard.readText === 'function')

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI) // Expose Electron API
        contextBridge.exposeInMainWorld('api', api) // Expose custom APIs
        console.log('Preload script loaded successfully. Clipboard API exposed.')
    } catch (error) {
        console.error('Error exposing API:', error)
    }
} else {
    // Fallback for when context isolation is disabled
    // @ts-ignore types
    window.electron = electronAPI
    // @ts-ignore types
    window.api = api
    console.log('Preload script loaded without context isolation.')
}
