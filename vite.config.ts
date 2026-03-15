import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fixReactVirtualized from "esbuild-plugin-react-virtualized";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        esbuildOptions: {
            plugins: [fixReactVirtualized],
        },
    },
    plugins: [tailwindcss(), react()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: 3000,
    },
});
