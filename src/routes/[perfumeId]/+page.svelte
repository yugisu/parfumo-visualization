<script lang="ts">
	import _ from 'lodash';
	import gsap from 'gsap';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { base } from '$app/paths';

	import { getPerfumeData } from '@/lib/perfume-data';
	import PerfumeVisualization from '@/lib/PerfumeVisualization.svelte';
	import { onMount } from 'svelte';

	const perfumeData = getPerfumeData();

	let nextButton: HTMLAnchorElement;

	let currentPerfume = $derived(Number(page.params.perfumeId));

	const nextPerfume = $derived((currentPerfume, _.random(perfumeData.length - 1)));

	function visitNextPerfume() {
		goto(`${base}/${nextPerfume}`);
	}

	let hintFadeOut: gsap.core.Tween;

	onMount(() => {
		hintFadeOut = gsap.to('.system-hint', {
			opacity: 0,

			duration: 5,
			delay: 10,
		});

		return () => {
			hintFadeOut.kill();
		};
	});
</script>

<svelte:window
	onkeydown={(e: any) => {
		if (e.code === 'Space') {
			e.preventDefault();

			hintFadeOut.seek(5);

			nextButton.classList.add('focused');

			nextButton.click();
			setTimeout(() => {
				nextButton.classList.remove('focused');
			}, 400);
		}
	}}
/>

<main class="flex flex-col bg-black text-white">
	{#key currentPerfume}
		<div class="h-full w-full grow-1">
			<PerfumeVisualization perfume={perfumeData[currentPerfume]} />
		</div>
	{/key}

	<div class="absolute bottom-6 left-8 z-50 opacity-40">
		<div class="flex text-white mix-blend-overlay">
			<a
				href="https://www.kaggle.com/datasets/olgagmiufana1/parfumo-fragrance-dataset"
				target="_blank"
				class="next-btn relative cursor-pointer"
				tabindex="-1"
			>
				Parfumo Fragrance Dataset
			</a>
		</div>
		<div class="absolute top-0 text-white opacity-60">
			<a
				href="https://www.kaggle.com/datasets/olgagmiufana1/parfumo-fragrance-dataset"
				target="_blank"
				class="next-btn relative cursor-pointer"
			>
				Parfumo Fragrance Dataset
			</a>
		</div>
	</div>

	<div class="system-hint absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center py-1 max-sm:hidden">
		<span class=" text-white opacity-100">Press <span class="text-sm">[SPACE]</span> to go to the next perfume.</span>
	</div>

	<div class="absolute right-8 bottom-6 z-50">
		<a
			href="{base}/{nextPerfume}"
			class="next-btn relative cursor-pointer"
			class:focused={false}
			onclick={visitNextPerfume}
			bind:this={nextButton}
		>
			<div class="text-white mix-blend-overlay">
				<span>Visit Next</span> <span class="next-btn__arrow">→</span>
			</div>
			<div class="absolute text-white opacity-60">
				<span>Visit Next</span> <span class="next-btn__arrow">→</span>
			</div>
		</a>
	</div>
</main>

<style>
	.next-btn {
		display: flex;
		justify-content: center;
		align-items: center;

		border-radius: 6px;
		padding: 4px 12px;

		opacity: 0.3;

		transition:
			opacity 200ms,
			background-color 200ms;

		&:hover,
		&:focus-visible,
		&.focused {
			outline: none;
			opacity: 0.9;

			.next-btn__arrow {
				transform: translateX(4px);
			}
		}
	}

	.next-btn__arrow {
		display: inline-block;

		transition: transform 200ms;
	}
</style>
