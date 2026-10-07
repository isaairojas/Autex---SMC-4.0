import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/* GitHub Pages sirve la app en /Autex---SMC-4.0/: el flujo de publicación define BASE_PATH; en local queda en "/". */
export default defineConfig({ base: process.env.BASE_PATH ?? '/', plugins: [react()] });
