import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(() => ({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: ['tsconfig.app.json'],
    }),
    visualizer({
      open: true, // opens the browser after build
      filename: 'bundle-stats.html',
      template: 'treemap', // 'treemap', 'sunburst', or 'network'
      gzipSize: true,
      brotliSize: true,
    })
  ],
}));
