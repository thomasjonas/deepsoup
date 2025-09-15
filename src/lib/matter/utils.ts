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
			console.log(path);
			return Matter.Vertices.scale(
				Matter.Svg.pathToVertices(path, 30),
				0.85,
				0.85,
				Matter.Vector.create(0, 0)
			);
		});

		const url = urls[i];
		console.log(url);
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
