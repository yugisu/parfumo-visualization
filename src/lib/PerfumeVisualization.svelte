<script lang="ts">
	import { getNoteDetails, type Perfume } from './perfume-data';
	import { fade } from 'svelte/transition';
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import { createRandom } from './random';
	import _ from 'lodash';
	import { media } from './utils';

	const FADE_OUT = 0.25;

	const { perfume }: { perfume: Perfume } = $props();

	const notes = (
		[
			['Top_Notes', perfume.Top_Notes],
			['Middle_Notes', perfume.Middle_Notes],
			['Base_Notes', perfume.Base_Notes],
		] as const
	).filter(([, arr]) => Boolean(arr)) as [string, string[]][];

	const rand = createRandom(perfume.Name);

	let macIntro: gsap.core.Tween;

	onMount(() => {
		const ptFadeIn = gsap.from('.perfume-text', {
			opacity: 0,

			duration: 0.75,
			delay: FADE_OUT,
		});

		const ptBackdropBlur = gsap.from('.perfume-text--backdrop', {
			letterSpacing: '0.1em',

			duration: 1.5,
			delay: FADE_OUT,
		});

		macIntro = gsap.from('.perfume-canvas', {
			opacity: 0,
			scale: 1.05,

			delay: 0.25 + FADE_OUT,
			duration: 2,
			ease: 'power1.inOut',
		});

		return () => {
			ptFadeIn.kill();
			ptBackdropBlur.kill();
			macIntro.kill();
		};
	});

	function createGradient(colors: string[] | undefined) {
		if (!colors) {
			return undefined;
		}

		const step = 100 / (colors.length - 1);
		const stops = colors.map((color, i) => ({ color, offset: `${i * step}%` }));

		return stops;
	}

	const maxNotesLength = Math.max(...notes.map(([, arr]) => arr.length));

	const dropletAmount = rand(15, maxNotesLength || 3) | 0;
	const dropletCoords = Array(dropletAmount)
		.fill(null)
		.map(() => ({ cx: rand(1000), cy: rand(1000), r: rand(150, 25), opacity: rand(1, 0.4) }));

	const accordsGradientAngle = rand(40, 10) | 0;

	let selectedNotes = $state<string | null>(null);

	const dropletIdxsForNotes = Object.fromEntries(
		notes.map(([label, arr]) => {
			const res = Array(dropletCoords.length)
				.fill(null)
				.map((_, idx) => idx)
				.sort(() => Math.random() - 0.5);

			return [label, res.slice(0, arr.length)];
		}),
	);

	let gradientRectFadeOut: gsap.core.Tween;

	$effect(() => {
		if (selectedNotes) {
			const notes: string[] = (perfume as any)[selectedNotes]!;
			const dropletIdxs = dropletIdxsForNotes[selectedNotes]!;

			gradientRectFadeOut ??= gsap.to('.main-accords-gradient', {
				opacity: 0,

				duration: FADE_OUT + 0.5,
				ease: 'power1.inOut',
			});

			gradientRectFadeOut.play();

			const dropletAnimations = (_.zip(notes, dropletIdxs) as [string, number][]).map(([note, dIdx]) => {
				const droplet = document.querySelector(`.droplet:nth-of-type(${dIdx + 1})`);

				const tween = gsap.to(droplet, {
					fill: getNoteDetails(note).color,
					duration: 0,
				});

				return tween;
			});

			return () => {
				gradientRectFadeOut.reverse();
				dropletAnimations.forEach((a) => a.revert());
			};
		}
	});
</script>

<div class="relative flex flex-col" out:fade={{ duration: FADE_OUT * 1000 }}>
	{#each Array(2)
		.fill(null)
		.map((_, i) => i) as i}
		<div
			class={[
				'absolute-center perfume-text z-20 mt-4 flex cursor-default flex-col p-8 text-center text-white max-sm:text-sm',
				i === 0 ? 'perfume-text--backdrop opacity-100 mix-blend-overlay' : 'class:perfume-text--front opacity-50',
			]}
		>
			<span class="text-3xl max-sm:text-2xl">
				{#if i === 0}
					{perfume.Name}
				{:else}
					<a class="perfume-text__link" href={perfume.URL} target="_blank">
						{perfume.Name}
					</a>
				{/if}
			</span>
			<span>
				{perfume.Brand}
			</span>

			<div class="mt-8 flex self-center">
				{#each notes as [label, notesArray], idx}
					<button
						class={[
							'cursor-pointer px-2 transition-opacity duration-200 hover:opacity-90 focus:opacity-90 focus:outline-none',
							selectedNotes === label ? '!opacity-100' : 'opacity-30',
						]}
						onclick={() => (selectedNotes = selectedNotes === label ? null : label)}
					>
						<span>{media.isMobile ? label.split('_')[0] : label.replace('_', ' ')}</span>
					</button>

					{#if idx !== notes.length - 1}
						<span class="opacity-30">/</span>
					{/if}
				{/each}
			</div>

			<p class="mt-1">{perfume[selectedNotes ?? 'Main_Accords']?.join(' • ')}</p>
		</div>
	{/each}

	{#if perfume.Main_Accords}
		{@const gradientStops = createGradient(perfume.Main_Accords.map((n) => getNoteDetails(n, true).color))!}
		<svg
			viewBox="0 0 1000 1000"
			class="perfume-canvas h-screen w-screen self-stretch"
			preserveAspectRatio="xMidYMid slice"
		>
			<defs>
				<linearGradient id="accords-gradient" gradientTransform="rotate({accordsGradientAngle})">
					{#each gradientStops as stop (stop)}
						<stop offset={stop.offset} stop-color={stop.color} />
					{/each}
				</linearGradient>
			</defs>

			<rect class="main-accords-gradient" width="1000" height="1000" fill="url(#accords-gradient)" />
			{#each dropletCoords as { cx, cy, r, opacity }}
				<circle {cx} {cy} {r} style:--opacity={opacity} stroke-width="0.5" class="droplet" />
			{/each}
		</svg>
	{/if}
</div>

<style>
	.droplet {
		fill: rgba(255, 255, 255, 0.15);
		stroke: rgba(255, 255, 255, 0.4);
		border-radius: 16px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(8.8px);

		opacity: var(--opacity, 1);
		transition: opacity 150ms;

		&:hover {
			fill: rgba(255, 255, 255, 0.17);
			opacity: calc(var(--opacity, 1) * 1.5);
		}
	}

	.perfume-text__link {
		&::after {
			content: '→';
			position: absolute;
			font-size: 0.6em;
			margin-left: 4px;
			transform: rotate(-45deg);
			translate: 0 0;

			opacity: 0;
			transition:
				opacity 300ms,
				translate 500ms;
		}

		&:hover,
		&:focus-visible {
			outline: none;
			background-color: rgba(255, 255, 255, 0.1);

			&::after {
				opacity: 1;
				translate: 4px -4px;
			}
		}
	}
</style>
