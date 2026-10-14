import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The admin is served at fomedeamor.com.br/admin (proxied from this Vercel
// project), so built asset URLs must live under /admin/ — otherwise the page
// requests fomedeamor.com.br/assets/... which the main site doesn't serve.
export default defineConfig({
  base: '/admin/',
  plugins: [react()]
});
