// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    optimizeDeps: {
        exclude: [
            // Add your external dependencies here
            "@trezor/connect-common/src/messageChannel/abstract"
        ]
    }
})