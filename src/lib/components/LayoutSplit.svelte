<script lang="ts">
	import type Layout from './Layout.svelte';
	export let layout: Layout;
	export let orientation: 'row' | 'column';
	export let row: number = -1;
	export let column: number;

	function splitListen(e: MouseEvent | null, on: boolean) {
		if (on) {
			if (e) e.preventDefault();
			window.addEventListener('mousemove', move);
			window.addEventListener('mouseup', (e) => splitListen(null, false));
		} else {
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', (e) => splitListen(null, false));
		}
	}

	function move(e: MouseEvent) {
		e.preventDefault();
		const position = orientation == 'row' ? e.clientY : e.clientX;
		layout.split(orientation, row, column, position);
	}
</script>

<div class={orientation == 'row' ? 'split-row' : 'split-col'} style:grid-row-start={row == -1 ? null : row * 2 + 2} style:grid-column-start={row != -1 ? null : column * 2 + 2} draggable={false} on:mousedown={(e) => splitListen(e, true)} />

<style>
	.split-col {
		background-color: transparent;
		width: 6px;
	}

	.split-row {
		background-color: transparent;
		height: 6px;
	}

	.split-col:hover {
		cursor: ew-resize;
		background-color: #007fd4;
	}

	.split-row:hover {
		cursor: ns-resize;
		background-color: #007fd4;
	}
</style>
