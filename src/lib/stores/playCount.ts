import { writable } from 'svelte/store';

export const playCountStore = writable<Record<number, number>>({}); 