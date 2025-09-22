import { writable } from 'svelte/store';
import { RectangleLayout } from './rectangle-layout.svelte';

export let appContent: Record<string, string> = $state({});

export const topState = writable<{ x: number; y: number; width: number; height: number }>({
	x: 0,
	y: 0,
	width: 0,
	height: 0
});

export const boxState = writable<{ x: number; y: number; width: number; height: number }>({
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
	boxState.set({ x: newState.x, y: newState.y, width: newState.width, height: newState.height });
	RectangleLayout.addExclusion({
		id: 'box',
		x: newState.x,
		y: newState.y,
		w: newState.width,
		h: newState.height
	});
};

const initialState = {
	showLetters: true,
	finishedDescriptions: false,
	state: 'initial' as 'initial' | 'uploading'
};

export type AppState = typeof initialState;
export let appState: AppState = $state(initialState);
