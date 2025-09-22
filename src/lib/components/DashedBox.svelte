<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	let {
		children,
		class: klass,
		onSizeChanged,
		fullyRounded,
		animate = $bindable()
	}: {
		onSizeChanged?: (size: { x: number; y: number; width: number; height: number }) => void;
		class?: any;
		children: Snippet<[]>;
		animate?: boolean;
		fullyRounded?: boolean;
	} = $props();

	let container: HTMLDivElement;

	let size = $state({ width: 0, height: 0 });
	let windowWidth = $state(0);
	let windowHeight = $state(0);
	const dashSettings = $derived(
		windowWidth < 1024
			? {
					dashLength: 8,
					gapLength: 8,
					borderRadius: 20,
					strokeWidth: 2
				}
			: {
					dashLength: 12,
					gapLength: 12,
					borderRadius: 40,
					strokeWidth: 4
				}
	);

	let offset = $state(0);
	let raf: number;

	let running = false;
	function start() {
		running = true;
		raf = requestAnimationFrame(loop);
	}

	function loop() {
		if (!running) return;
		offset -= 0.2;
		raf = requestAnimationFrame(loop);
	}

	$effect(() => {
		if (!animate) {
			stop();
		} else if (!running && animate) start();
	});

	function stop() {
		if (typeof raf === 'number') {
			cancelAnimationFrame(raf);
		}
	}

	onMount(() => {
		if (!onSizeChanged) return;

		const onChangeHandler = () => {
			const rect = container.getBoundingClientRect();
			onSizeChanged(rect);
		};

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.borderBoxSize) {
					onChangeHandler();
				}
			}
		});

		window.addEventListener('resize', onChangeHandler);
		resizeObserver.observe(container);

		return () => {
			window.removeEventListener('resize', onChangeHandler);
			resizeObserver.unobserve(container);
		};
	});

	onMount(() => {
		if (animate) loop();

		return stop;
	});

	const borderRadius = $derived(
		fullyRounded
			? (size.height - dashSettings.strokeWidth) / 2
			: Math.max(
					0,
					Math.min((size.height - dashSettings.strokeWidth) / 2, dashSettings.borderRadius)
				)
	);
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div
	bind:this={container}
	bind:clientWidth={size.width}
	bind:clientHeight={size.height}
	class={klass}
	style="border-radius: {dashSettings.borderRadius}px; position:relative"
>
	<svg
		width="100%"
		height="100%"
		viewBox={`0 0 ${size.width} ${size.height}`}
		preserveAspectRatio="xMidYMid meet"
		class="pointer-events-none absolute inset-0"
	>
		<rect
			x={dashSettings.strokeWidth / 2}
			y={dashSettings.strokeWidth / 2}
			width={Math.max(0, size.width - dashSettings.strokeWidth)}
			height={Math.max(0, size.height - dashSettings.strokeWidth)}
			rx={borderRadius}
			ry={borderRadius}
			fill="none"
			stroke="black"
			stroke-dashoffset={offset}
			stroke-width={dashSettings.strokeWidth}
			stroke-dasharray={`${dashSettings.dashLength} ${dashSettings.gapLength}`}
			vector-effect="non-scaling-stroke"
		/>
	</svg>
	{@render children?.()}
</div>
