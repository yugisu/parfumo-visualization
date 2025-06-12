import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html', // src: https://stackoverflow.com/a/76861332
		}),
		prerender: {
			entries: [
				'*',

				// This should be synced with src/redirects.js
				'/',
			],
		},
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
		},
		alias: {
			'@/*': 'src/*',
		},
	},
};

export default config;
