/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.csv' {
	declare const data: Array<{ [key: string]: string }>;

	export default data;
}
