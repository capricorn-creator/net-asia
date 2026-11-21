import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    sourcemap: false,
    // The SSR build must not copy /public a second time.
    copyPublicDir: !isSsrBuild,
  },
  // Local API: run `npx wrangler pages dev dist` (port 8788) next to `npm run dev`.
  server: { proxy: { '/api': 'http://localhost:8788' } },
}));