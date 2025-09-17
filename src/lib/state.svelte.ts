import { RectangleLayout } from './rectangle-layout.svelte';

export let appContent: Record<string, string> = $state({});
export const boxState: { x: number; y: number; width: number; height: number } = $state({
	x: 0,
	y: 0,
	width: 0,
	height: 0
});

export const updateBoxState = (newState: {
	x: number;
	y: number;
	width: number;
	height: number;
}) => {
	boxState.x = newState.x;
	boxState.y = newState.y;
	boxState.width = newState.width;
	boxState.height = newState.height;

	RectangleLayout.addExclusion({
		id: 'box',
		x: newState.x,
		y: newState.y,
		w: newState.width,
		h: newState.height
	});
};

export let appState = $state({
	showLetters: true,
	finishedDescriptions: false
});
