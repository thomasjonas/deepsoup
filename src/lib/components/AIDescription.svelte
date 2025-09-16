<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { animate, text as splitter, stagger } from 'animejs';

	let { text, index, onComplete }: { text: string; index: number; onComplete: () => void } =
		$props();

	let position = $state({ x: 0, y: 0 });
	let textContainer: HTMLElement;

	onMount(() => {
		position.x = Math.random() * (window.innerWidth - 300);
		const mt = window.innerHeight * 0.1;
		position.y = mt + Math.random() * (window.innerHeight - 2 * mt);

		setTimeout(
			() => {
				const { chars } = splitter.split(textContainer, {
					chars: { wrap: 'clip' }
				});

				textContainer.style.opacity = '1';
				animate(chars, {
					opacity: [{ to: [0, 1] }],
					duration: 750,
					ease: 'out(3)',
					delay: () => Math.random() * 1000
				});

				setTimeout(() => {
					animate(chars, {
						opacity: [{ to: [1, 0] }],
						duration: 750,
						ease: 'in(3)',
						delay: () => Math.random() * 1000,
						onComplete
					});
				}, 5000);
			},
			index * 3000 + Math.random() * 2000
		);
	});
</script>

<div
	class="ai-description pointer-events-none absolute max-w-[300px] text-[27px] leading-tight text-white lg:max-w-[550px] lg:text-[60px]"
	style={`transform: translate(${position.x}px, ${position.y}px)`}
>
	<div class="opacity-0" style="" bind:this={textContainer}>
		{text}
	</div>
</div>
