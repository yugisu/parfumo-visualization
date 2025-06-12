<script lang="ts">
	import { getNoteDetails, type Perfume } from './perfume-data';
	import { fade } from 'svelte/transition';
	import gsap from 'gsap';
	import { onMount } from 'svelte';
	import { createRandom } from './random';

	const { perfume }: { perfume: Perfume } = $props();

	const FADE_OUT = 0.25;

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

		const macIntro = gsap.from('.main-accords-canvas', {
			opacity: 0,
			scale: 1.05,

			delay: 0.25 + FADE_OUT,
			duration: 2,
			ease: 'power1.inOut',
		});

		// TODO: FADE OUT THE MAIN ACCORDS GRADIENT AND COLOR THE CIRCLES WITH TOP, MIDDLE, AND BASE NOTES QUICKLY AND BRIEFLY!!! across different circles...

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

	const rand = createRandom(perfume.Name);

	const dropletAmount = rand(15, 3) | 0;
	const dropletCoords = Array(dropletAmount)
		.fill(null)
		.map(() => ({ cx: rand(1000), cy: rand(1000), r: rand(150, 25) }));

	const mainAccordsAngle = rand(40, 10) | 0;
</script>

<div class="relative flex flex-col" out:fade={{ duration: FADE_OUT * 1000 }}>
	<!-- <div class="glass absolute inset-0 z-10"></div> -->
	<div
		class="absolute-center perfume-text perfume-text--backdrop z-20 flex w-full flex-col p-8 text-center text-white opacity-100 mix-blend-overlay"
	>
		<span class="text-3xl">
			{perfume.Name}
		</span>
		<span>
			{perfume.Brand}
		</span>
		<span class="mt-5">{perfume.Main_Accords?.join(' • ')}</span>
	</div>
	<div
		class="absolute-center perfume-text perfume-text--front z-20 flex w-full cursor-default flex-col p-8 text-center text-white opacity-50"
	>
		<span class="text-3xl">
			<a class="perfume-text__link" href={perfume.URL} target="_blank">
				{perfume.Name}
			</a>
		</span>
		<span>
			{perfume.Brand}
		</span>
		<span class="mt-5">{perfume.Main_Accords?.join(' • ')}</span>
	</div>

	{#if perfume.Main_Accords}
		{@const gradientStops = createGradient(perfume.Main_Accords.map((n) => getNoteDetails(n, true).color))!}
		<svg
			viewBox="0 0 1000 1000"
			class="main-accords-canvas h-screen w-screen self-stretch"
			preserveAspectRatio="xMidYMid slice"
		>
			<defs>
				<linearGradient id="main-accords-gradient" gradientTransform="rotate({mainAccordsAngle})">
					{#each gradientStops as stop (stop)}
						<stop offset={stop.offset} stop-color={stop.color} />
					{/each}
				</linearGradient>
			</defs>

			<rect width="1000" height="1000" fill="url(#main-accords-gradient)" />
			{#each dropletCoords as { cx, cy, r }}
				<circle
					{cx}
					{cy}
					{r}
					fill="rgba(255, 255, 255, 0.15)"
					stroke="rgba(255, 255, 255, 0.4)"
					stroke-width="0.5"
					class="glass"
				/>
			{/each}
		</svg>
	{/if}
</div>

<style>
	.glass {
		background: rgba(255, 255, 255, 0.27);
		border-radius: 16px;
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(8.8px);
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

		&:hover::after {
			opacity: 1;
			translate: 4px -4px;
		}
	}
</style>
