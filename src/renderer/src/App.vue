<script setup lang="ts">
import { ref } from 'vue'
import { processClipboardText } from './services/clipboardService'

const clipboardText = ref('') // Raw clipboard text
const statsFound = ref<Record<string, { value: number | [number, number]; type: string }>>({}) // Parsed stats
const errorMessage = ref('') // Error message
const payload = ref<object | null>(null) // Query payload

// Process the clipboard text
const handleClipboardProcessing = () => {
    errorMessage.value = ''
    statsFound.value = {}
    payload.value = null

    if (window.api && window.api.clipboard) {
        clipboardText.value = window.api.clipboard.readText()

        const result = processClipboardText(clipboardText.value)

        if (result.error) {
            errorMessage.value = result.error
            console.error(errorMessage.value)
        } else {
            statsFound.value = result.stats
            payload.value = result.payload
            console.log('Generated Payload:', payload.value)

            // Serialize payload to ensure compatibility with ipcRenderer
            if (window.electron && payload.value) {
                window.electron.ipcRenderer.send('open-trade-url', JSON.stringify(payload.value))
            }
        }
    }
}
</script>

<template>
    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 50px">
        <button @click="handleClipboardProcessing">Process Clipboard</button>

        <!-- Error Message -->
        <p v-if="errorMessage" style="color: red; margin-top: 10px">{{ errorMessage }}</p>
    </div>
</template>
