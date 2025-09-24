<script lang="ts">
	import Matter from 'matter-js';
	import decomp from 'poly-decomp';
	import { onMount, tick } from 'svelte';

	import 'pathseg';
	import { Box } from '$lib/matter/Box';
	import { loadLetters, positionLetters, relaxLayout } from '$lib/matter/utils';
	import { Walls } from '$lib/matter/Walls';
	import { appState, boxState, topState } from '$lib/state.svelte';
	import { shuffle } from 'lodash-es';
	import { get } from 'svelte/store';
	import { createNoise2D } from 'simplex-noise';

	const DEBUG = false;

	let canvasContainer: HTMLDivElement;

	var Engine = Matter.Engine,
		Render = Matter.Render,
		Body = Matter.Body,
		Runner = Matter.Runner,
		Common = Matter.Common,
		MouseConstraint = Matter.MouseConstraint,
		Mouse = Matter.Mouse,
		Composite = Matter.Composite,
		Bodies = Matter.Bodies,
		Vector = Matter.Vector,
		Events = Matter.Events;

	// provide concave decomposition support library
	Common.setDecomp(decomp);

	function setBodySize(body: Matter.Body, targetHeight: number) {
		const currentHeight = body.bounds.max.y - body.bounds.min.y;
		const scaleY = targetHeight / currentHeight;
		Body.scale(body, scaleY, scaleY);
	}

	// create engine
	const engine = Engine.create();
	const world = engine.world;

	const noise = createNoise2D();

	Events.on(engine, 'afterUpdate', (event) => {
		const driftStrength = -2 + Math.sqrt(ratio) * 8; // 10x stronger than before
		const driftSpeed = 0.0001;

		const t = Date.now() * driftSpeed; // time parameter for smooth variation

		letterBodies.forEach((body, i) => {
			const svg = svgs[i];
			if (!svg) return;

			// Smooth noise-based offsets
			const nx = noise(i * 10, t); // -1 → 1
			const ny = noise(i * 10 + 100, t); // offset for y axis

			// Apply force scaled for visibility
			Body.applyForce(body, body.position, {
				x: nx * driftStrength,
				y: ny * driftStrength
			});

			// small angular drift
			Body.setAngularVelocity(body, noise(i + 200, t) * 0.0008);

			const { x, y } = body.position;
			const angle = body.angle;

			// Retrieve the pre-calculated, static offset vector
			const offsetX = body.render.sprite!.xOffset!;
			const offsetY = body.render.sprite!.yOffset!;

			// Rotate this offset vector by the body's current angle to get the new world offset
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);
			const rotatedOffsetX = offsetX * cos - offsetY * sin;
			const rotatedOffsetY = offsetX * sin + offsetY * cos;

			// The final visual center is the center of mass plus the rotated offset
			const svgCenterX = x + rotatedOffsetX;
			const svgCenterY = y + rotatedOffsetY;

			// Calculate the top-left position for CSS translate, then apply rotation
			const translateX = svgCenterX - svg.width / 2;
			const translateY = svgCenterY - svg.height / 2;

			svg.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${angle}rad)`;
		});
	});

	// create renderer
	let render: Matter.Render;
	let letterBodies: Matter.Body[] = [];

	let windowWidth = $state(0);
	let windowHeight = $state(0);
	let pixels = $derived(windowWidth * windowHeight);
	let ratio = $derived(windowWidth / 390);
	let bodyScale = $derived(-35 + Math.sqrt(ratio) * 200);

	let walls: Walls;
	let box: Box;

	$effect(() => {
		const newScale = bodyScale;
		letterBodies.forEach((b, i) => {
			svgs[i].style.height = `${bodyScale}px`;
			setBodySize(b, newScale);
		});
	});

	function updateBoxSize(newSize: { x: number; y: number; width: number; height: number }) {
		if (!box) return;
		box.update(
			newSize.x + newSize.width / 2,
			newSize.y + newSize.height / 2,
			newSize.width,
			newSize.height
		);
	}
	function updateTopSize(newSize: { x: number; y: number; width: number; height: number }) {
		let h = windowHeight;
		h -= newSize.height;
		wallHeight = h;
		wallTop = newSize.height;
	}

	onMount(async () => {
		render = Render.create({
			element: canvasContainer,
			engine: engine,
			options: {
				width: windowWidth,
				height: windowHeight,
				background: 'transparent', // white background
				wireframes: DEBUG,
				showPositions: true
			}
		});
		Render.run(render);

		engine.gravity.x = 0;
		engine.gravity.y = 0;

		// create runner
		var runner = Runner.create({
			delta: 1000 / (60 * 10),
			maxFrameTime: 1000 / 50
		});
		Runner.run(runner, engine);

		walls = new Walls({
			world,
			width: windowWidth,
			height: windowHeight,
			positionTop: get(topState).height
		});

		const letters = await loadLetters();
		letters.forEach((letter, i) => {
			const color = Common.choose(['#f19648', '#f5d259', '#f55a3c', '#063e7b', '#ececd1']);
			const body = Bodies.fromVertices(
				100 * i,
				(i % 4) * 200,
				letter,
				{
					render: {
						fillStyle: color,
						strokeStyle: color,
						visible: DEBUG
					},
					mass: 99999
				},
				true
			);
			setBodySize(body, bodyScale);

			body.frictionAir = 0.02;
			Composite.add(world, body);

			// Save the geometric center so we can easier align the svgs later
			const geometricCenterX = (body.bounds.min.x + body.bounds.max.x) / 2;
			const geometricCenterY = (body.bounds.min.y + body.bounds.max.y) / 2;
			body.render.sprite = body.render.sprite || {};
			body.render.sprite.xOffset = geometricCenterX - body.position.x;
			body.render.sprite.yOffset = geometricCenterY - body.position.y;

			const angle = -Math.PI * 0.4 + Math.random() * Math.PI * 0.8;
			Matter.Body.setAngle(body, angle);

			letterBodies.push(body);

			Matter.Body.setAngle(body, -Math.PI * 0.4 + Math.random() * Math.PI * 0.8);
			Matter.Body.update(body, 0, 0, 0);

			svgs[i].style.height = `${bodyScale}px`;
		});

		positionLetters(letterBodies, windowWidth, windowHeight);

		const boxSize = get(boxState);
		box = new Box({
			world,
			x: boxSize.x + boxSize.width / 2,
			y: boxSize.y + boxSize.height / 2,
			width: boxSize.width,
			height: boxSize.height
		});

		// add mouse control
		const mouse = Mouse.create(render.canvas);
		const mouseConstraint = MouseConstraint.create(engine, {
			mouse: mouse,
			constraint: {
				stiffness: 0.2,
				render: {
					visible: false
				}
			}
		});

		Composite.add(world, mouseConstraint);

		// keep the mouse in sync with rendering
		render.mouse = mouse;

		// fit the render viewport to the scene
		Render.lookAt(render, {
			min: { x: 0, y: 0 },
			max: { x: windowWidth, y: windowHeight }
		});

		setTimeout(() => {
			relaxLayout(
				letterBodies,
				[...walls.getBodies(), box?.body].filter((b) => typeof b !== 'undefined'),
				10000
			);
			const timings = shuffle(svgs.map((_, idx) => idx * 150 + Math.random() * 50));
			svgs.forEach((svg, i) => {
				setTimeout(() => {
					svg.style.opacity = '1';
				}, timings[i]);
			});
		}, 50);

		const unsubBox = boxState.subscribe(updateBoxSize);
		const unsubTop = topState.subscribe(updateTopSize);
		return () => {
			unsubBox();
			unsubTop();
		};
	});

	let wallHeight = $state(0);
	let wallTop = $state(0);
	$effect(() => {
		if (!render) return;
		// set the render size to equal window size
		Render.setSize(render, windowWidth, windowHeight);
		walls.setSize(windowWidth, wallHeight, wallTop);
	});

	const WORD = 'DEEPSOUP';
	let svgs: HTMLImageElement[] = $state([]);

	async function repositionLetters() {
		console.log('resposition letters');
		positionLetters(letterBodies, windowWidth, windowHeight);
		await tick();
		relaxLayout(
			letterBodies,
			[...walls.getBodies(), box?.body].filter((b) => typeof b !== 'undefined'),
			10000
		);
	}

	$effect(() => {
		let opacity = appState.showLetters ? '1' : '0';
		if (appState.showLetters) repositionLetters();

		const timings = shuffle(svgs.map((_, idx) => idx * 250 + Math.random() * 150));
		svgs.forEach((svg, i) => {
			setTimeout(() => {
				svg.style.opacity = opacity;
			}, timings[i]);
		});
	});
</script>

<svelte:window
	bind:innerWidth={windowWidth}
	bind:innerHeight={windowHeight}
	onkeydown={() => repositionLetters()}
/>

<div class="fixed top-0 left-0 z-0 h-full w-screen overflow-hidden" bind:this={canvasContainer}>
	{#each WORD as c, i}
		<img
			alt={`Letter shape ${WORD[i]}`}
			class="pointer-events-none absolute z-10 opacity-0 transition-opacity duration-1000"
			bind:this={svgs[i]}
			src="/svgs/{c}.svg"
		/>
	{/each}
</div>
