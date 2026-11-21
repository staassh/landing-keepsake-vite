import { defineConfig } from 'vite';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/landing-keepsake-vite/' : '/',
  publicDir: 'public',
  plugins: [
    vituum({
      pages: {
        dir: './src/pages',
        root: './src',
        normalizeBasePath: true,
      },
    }),
    pug({
      root: './src',
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
}));
