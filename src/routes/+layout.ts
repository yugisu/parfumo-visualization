import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const prerender = true;

export async function load({ url }: any) {
	const pathname = url.pathname;
	if (pathname === `${base}/`) {
		return redirect(301, `${base}/1337`);
	}
}
