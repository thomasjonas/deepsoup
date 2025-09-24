import Matter from 'matter-js';

var loadSvg = function (url: string) {
	return fetch(url)
		.then(function (response) {
			return response.text();
		})
		.then(function (raw) {
			return new window.DOMParser().parseFromString(raw, 'image/svg+xml');
		});
};

var select = function (root: Document, selector: string) {
	return Array.prototype.slice.call(root.querySelectorAll(selector));
};

export async function loadLetters() {
	const urls = [
		'/svgs/D.svg',
		'/svgs/E.svg',
		'/svgs/P.svg',
		'/svgs/S.svg',
		'/svgs/O.svg',
		'/svgs/U.svg'
	];

	const letterVertices: Record<string, Matter.Vector[][]> = {};
	const svgs = await Promise.all(urls.map(loadSvg));
	svgs.forEach((root, i) => {
		const vertexSets = select(root, '#outline').map(function (path) {
			return Matter.Vertices.scale(
				Matter.Svg.pathToVertices(path, 30),
				0.85,
				0.85,
				Matter.Vector.create(0, 0)
			);
		});

		const url = urls[i];
		// const letter = /\/([A-Z])\-/gi.exec(url)![1];
		const letter = /\/([A-Z])\./gi.exec(url)![1];
		letterVertices[letter] = vertexSets;
	});

	return [
		letterVertices['D'],
		letterVertices['E'],
		letterVertices['E'],
		letterVertices['P'],
		letterVertices['S'],
		letterVertices['O'],
		letterVertices['U'],
		letterVertices['P']
	];
}

export function relaxLayout(
	letters: Matter.Body[],
	staticBodies: Matter.Body[],
	iterations = 100,
	maxPush = 10
) {
	const RANDOM_FACTOR = 0.1; // small random jitter

	for (let iter = 0; iter < iterations; iter++) {
		let moved = false;

		// letters vs letters
		for (let i = 0; i < letters.length; i++) {
			for (let j = i + 1; j < letters.length; j++) {
				const collisions = Matter.Query.collides(letters[i], [letters[j]]);
				collisions.forEach((collision) => {
					const pushX = collision.penetration.x * 0.5;
					const pushY = collision.penetration.y * 0.5;

					// add small random jitter
					const jitterX = (Math.random() - 0.5) * RANDOM_FACTOR * Math.abs(pushX || 1);
					const jitterY = (Math.random() - 0.5) * RANDOM_FACTOR * Math.abs(pushY || 1);

					const finalPushX = Math.max(-maxPush, Math.min(pushX + jitterX, maxPush));
					const finalPushY = Math.max(-maxPush, Math.min(pushY + jitterY, maxPush));

					Matter.Body.translate(letters[i], { x: finalPushX, y: finalPushY });
					Matter.Body.translate(letters[j], { x: -finalPushX, y: -finalPushY });

					moved = true;
				});
			}
		}

		// letters vs static bodies
		letters.forEach((letter) => {
			const collisions = Matter.Query.collides(letter, staticBodies);
			collisions.forEach((collision) => {
				let pushX = collision.penetration.x;
				let pushY = collision.penetration.y;

				// jitter to avoid oscillation
				const jitterX = (Math.random() - 0.5) * RANDOM_FACTOR * Math.abs(pushX || 1);
				const jitterY = (Math.random() - 0.5) * RANDOM_FACTOR * Math.abs(pushY || 1);

				pushX = Math.max(-maxPush, Math.min(pushX + jitterX, maxPush));
				pushY = Math.max(-maxPush, Math.min(pushY + jitterY, maxPush));

				Matter.Body.translate(letter, { x: pushX, y: pushY });
				moved = true;
			});
		});

		if (!moved) break; // early exit when stable
	}
}

export function positionLetters(
	letterBodies: Matter.Body[],
	windowWidth: number,
	windowHeight: number
) {
	let soupWidth = 0;
	let deepWidth = 0;
	letterBodies.forEach((body, i) => {
		const w = body.bounds.max.x - body.bounds.min.x;
		if (i < 4) deepWidth += w;
		if (i > 3) soupWidth += w;
	});

	// pick a good position for the DEEP and SOUP letters
	let xPosition = Math.max(0, Math.random() * (windowWidth - deepWidth));
	letterBodies.forEach((body, i) => {
		const index = i % 4;

		const offset = 0.25 - 0.08 + (index % 2) * 0.04;
		const y = i > 3 ? windowHeight - windowHeight * offset : windowHeight * offset;
		let bodyWidth = body.bounds.max.x - body.bounds.min.x;

		if (xPosition - bodyWidth / 2 < 0) xPosition = bodyWidth / 2;
		if (index === 0) xPosition += bodyWidth * 0;

		const wordWidth = i < 4 ? deepWidth : soupWidth;
		const availableSpace = windowWidth - wordWidth;

		const marginLeft = 0.05 * windowWidth;
		Matter.Body.setPosition(body, {
			x:
				availableSpace < windowWidth / 2
					? marginLeft + bodyWidth / 2 + index * ((windowWidth * 0.9) / 4)
					: xPosition,
			y
		});

		xPosition += bodyWidth;
		if (i === 3) xPosition = Math.random() * (windowWidth - soupWidth);
	});
}
