<script lang="ts">
	import Matter from 'matter-js';
	import decomp from 'poly-decomp';
	import { onMount } from 'svelte';

	import 'pathseg';
	import { Box } from '$lib/matter/Box';
	import { loadLetters } from '$lib/matter/utils';
	import { Walls } from '$lib/matter/Walls';
	import { appState, boxState, topState } from '$lib/state.svelte';
	import { shuffle } from 'lodash-es';
	import 'pathseg';
	import { get } from 'svelte/store';

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
	const engine = Engine.create(),
		world = engine.world;

	// const gravityRadius = 0.01;
	// const gravitySpeed = 0.0001;
	Events.on(engine, 'afterUpdate', (event) => {
		const driftForce = -0.03 * Math.sqrt(windowWidth / 390) * 2; // smaller = smoother drift
		const wanderSpeed = 20; // how fast the target moves

		letterBodies.forEach((body, i) => {
			const svg = svgs[i];
			if (!svg) return;

			const target = body.plugin.driftTarget;

			// Make the drift target wander a little
			target.x += (Math.random() - 0.5) * target.wanderRadius * 0.01 * wanderSpeed;
			target.y += (Math.random() - 0.5) * target.wanderRadius * 0.01 * wanderSpeed;

			// Clamp the target to the screen bounds
			target.x = Math.max(0, Math.min(windowWidth, target.x));
			target.y = Math.max(0, Math.min(windowHeight, target.y));

			// Apply force toward the drift target
			const dx = target.x - body.position.x;
			const dy = target.y - body.position.y;
			Body.applyForce(body, body.position, { x: dx * driftForce, y: dy * driftForce });

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
	let bodyScale = $derived(-60 + Math.sqrt(windowWidth / 390) * 220);

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
		let deepWidth = 0;
		let soupWidth = 0;
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

			const w = body.bounds.max.x - body.bounds.min.x;
			if (i < 4) deepWidth += w;
			if (i > 3) soupWidth += w;

			const force = 0.02 + Math.random() * 0.0005;
			const dir = Math.random() > 0.5 ? -2 : 2;
			const bodyWidth = body.bounds.max.x - body.bounds.min.x;
			const bodyHeight = body.bounds.max.y - body.bounds.min.y;
			const bodySize = Math.max(bodyWidth, bodyHeight);
			const scale = (bodySize / 300) * Math.sqrt(windowWidth / 390) * 500000;

			const forcePosition = Vector.add(
				body.position,
				Vector.create(
					-bodySize / 2 + Math.random() * bodySize,
					-bodySize / 2 + Math.random() * bodySize
				)
			);

			// Matter.Body.applyForce(
			// 	body,
			// 	forcePosition,
			// 	Matter.Vector.create(force * dir * scale, force * dir * scale)
			// );

			body.frictionAir = 0.02;
			Composite.add(world, body);

			// Save the geometric center so we can easier align the svgs later
			const geometricCenterX = (body.bounds.min.x + body.bounds.max.x) / 2;
			const geometricCenterY = (body.bounds.min.y + body.bounds.max.y) / 2;
			body.render.sprite = body.render.sprite || {};
			body.render.sprite.xOffset = geometricCenterX - body.position.x;
			body.render.sprite.yOffset = geometricCenterY - body.position.y;

			letterBodies.push(body);

			svgs[i].style.height = `${bodyScale}px`;
			svgs[i].style.opacity = '1';
		});

		// pick a good position for the DEEP and SOUP letters
		let xPosition = Math.max(0, Math.random() * (windowWidth - deepWidth));
		letterBodies.forEach((body, i) => {
			const angle = -Math.PI * 0.4 + Math.random() * Math.PI * 0.8;
			Matter.Body.setAngle(body, angle);
			Matter.Body.update(body, 0, 0, 0);

			const index = i % 4;

			const offset = 0.25 - 0.08 + (index % 2) * 0.04;
			const y = i > 3 ? windowHeight - windowHeight * offset : windowHeight * offset;
			let bodyWidth = body.bounds.max.x - body.bounds.min.x;

			if (xPosition - bodyWidth / 2 < 0) xPosition = bodyWidth / 2;
			if (i !== 0 && i !== 4) xPosition += bodyWidth * 0;

			const wordWidth = i < 3 ? deepWidth : soupWidth;
			const availableSpace = windowWidth - wordWidth;

			const marginLeft = 0.05 * windowWidth;
			Body.setPosition(body, {
				x:
					availableSpace < 0
						? marginLeft + bodyWidth / 2 + index * ((windowWidth * 0.9) / 4)
						: xPosition,
				y
			});

			xPosition += bodyWidth;
			if (i === 3) xPosition = Math.random() * (windowWidth - soupWidth);
		});

		letterBodies.forEach((body, i) => {
			// Initialize drift target near the body
			body.plugin = body.plugin || {};
			body.plugin.driftTarget = {
				// x: Math.random() * windowWidth,
				// y: Math.random() * windowHeight,
				x: body.position.x + (Math.random() - 0.5) * 200,
				y: body.position.y + (Math.random() - 0.5) * 300,

				wanderRadius: 30 // how far the target can move per update
			};
		});

		const boxSize = get(boxState);
		box = new Box({
			world,
			x: boxSize.x + boxSize.width / 2,
			y: boxSize.y + boxSize.height / 2,
			width: boxSize.width,
			height: boxSize.height
		});

		// add mouse control
		const mouse = Mouse.create(render.canvas),
			mouseConstraint = MouseConstraint.create(engine, {
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

	$effect(() => {
		if (!appState.showLetters) {
			const timings = shuffle(svgs.map((_, idx) => idx * 250 + Math.random() * 150));
			svgs.forEach((svg, i) => {
				svg.style.transition = 'opacity 1000ms';
				setTimeout(() => {
					svg.style.opacity = '0';
				}, timings[i]);
			});
		}
	});
</script>

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight} />

<div class="fixed top-0 left-0 z-0 h-full w-screen overflow-hidden" bind:this={canvasContainer}>
	{#each WORD as c, i}
		<img
			alt={`Letter shape ${WORD[i]}`}
			class="pointer-events-none absolute z-10 opacity-0"
			bind:this={svgs[i]}
			src="/svgs/{c}.svg"
		/>
	{/each}
</div>
