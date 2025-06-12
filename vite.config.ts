import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite';
import dsv from '@rollup/plugin-dsv'


// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss(), dsv()],
})
