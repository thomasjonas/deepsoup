import { writable } from 'svelte/store';

export let appContent: Record<string, string> = $state({});
export const boxState: { x: number; y: number; width: number; height: number } = $state({
	x: 0,
	y: 0,
	width: 0,
	height: 0
});

export const updateBoxState = (newSate: {
	x: number;
	y: number;
	width: number;
	height: number;
}) => {
	boxState.x = newSate.x;
	boxState.y = newSate.y;
	boxState.width = newSate.width;
	boxState.height = newSate.height;
};

export let appState = $state({
	showLetters: true,
	finishedDescriptions: false
});
