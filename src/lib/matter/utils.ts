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
