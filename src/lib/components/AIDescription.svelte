<script lang="ts">
	import { animate, text as splitter, stagger } from 'animejs';
	import { mount, onMount, tick } from 'svelte';
	import DescriptionText from './AIDescriptionText.svelte';
	import { RectangleLayout } from '$lib/rectangle-layout.svelte';
	import { shuffle } from 'lodash-es';
	import AiDescriptionText from './AIDescriptionText.svelte';

	let { text, index, onComplete }: { text: string; index: number; onComplete: () => void } =
		$props();

	let position = $state({ x: -1000, y: -1000 });
	let size = $state({ width: 0, height: 0 });
	let textContainer: HTMLElement;

	async function calculateSize() {
		const target = document.createElement('div');
		mount(DescriptionText, {
			target,
			props: { text }
		});
		const div = target.firstElementChild!;
		div.classList.add('absolute', 'translate-y-full', 'translate-x-full');
		document.body.appendChild(div);

		await tick();
		const rect = div.getBoundingClientRect();
		size.width = rect.width;
		size.height = rect.height;
		document.body.removeChild(div);
	}

	onMount(() => {
		calculateSize();

		const { chars } = splitter.split(textContainer, {
			chars: { wrap: 'visible' }
		});

		setTimeout(
			() => {
				const pos = RectangleLayout.addRectangle(`description-${index}`, size.width, size.height);
				if (!pos) return;
				position.x = pos.x;
				position.y = pos.y;

				const delayArray = shuffle(chars.map((c, idx) => idx * 50));
				textContainer.style.opacity = '1';
				animate(chars, {
					opacity: [{ to: [0, 1] }],
					duration: 750,
					ease: 'out(3)',
					delay: (target, index, _) => delayArray[index]
				});

				setTimeout(() => {
					animate(chars, {
						opacity: [{ to: [1, 0] }],
						duration: 750,
						ease: 'in(3)',
						delay: () => Math.random() * 1000,
						onComplete: () => {
							onComplete();
							RectangleLayout.removeRectangle(`description-${index}`);
						}
					});
				}, 5000);
			},
			index * 3000 + Math.random() * 2000
		);
	});
</script>

<div style={`transform: translate(${position.x}px, ${position.y}px)`}>
	<div class="opacity-0" bind:this={textContainer}>
		<AiDescriptionText {text} />
	</div>
</div>
