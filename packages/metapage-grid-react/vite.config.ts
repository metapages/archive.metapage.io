import { defineConfig } from 'vite'
import * as path from "path";
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: path.basename(__dirname).replace(/-/g, '_'),
            formats: ['es', 'umd'],
            fileName: (format) => `${path.basename(__dirname)}.${format}.js`,
        },
        rollupOptions: {
            // external: ['react', 'react-dom', 'styled-components'],
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    // 'styled-components': 'styled',
                },
            },
        },
    },
});
