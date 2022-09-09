<script lang="ts">
	import type Layout from './Layout.svelte';
	export let layout: Layout;
	export let orientation: 'row' | 'column';
	export let row: number = -1;
	export let column: number;
	let rootElement: HTMLDivElement;
	let moving = false;

	function splitListen(e: MouseEvent | null, on: boolean) {
		if (on) {
			if (e) e.preventDefault();
			window.addEventListener('mousemove', move);
			window.addEventListener('mouseup', (e) => splitListen(null, false));
			moving = true;
		} else {
			window.removeEventListener('mousemove', move);
			window.removeEventListener('mouseup', (e) => splitListen(null, false));
			moving = false;
			hover(false);
		}
	}

	function move(e: MouseEvent) {
		e.preventDefault();
		const position = orientation == 'row' ? e.clientY : e.clientX;
		layout.split(orientation, column, row, position);
	}

	function hover(on: boolean) {
		if (moving) return;
		document.body.style.cursor = on ? (orientation == 'row' ? 'ns-resize' : 'ew-resize') : '';
		if (rootElement) rootElement.style.backgroundColor = on ? '#007fd4' : '';
	}
</script>

<div
	bind:this={rootElement}
	class={orientation == 'row' ? 'split-row' : 'split-col'}
	style:grid-row-start={row == -1 ? null : row * 2 + 2}
	style:grid-column-start={row != -1 ? null : column * 2 + 2}
	draggable={false}
	on:mouseenter={() => hover(true)}
	on:mouseleave={() => hover(false)}
	on:mousedown={(e) => splitListen(e, true)}
/>

<style>
	.split-col {
		background-color: transparent;
		width: 6px;
	}

	.split-row {
		background-color: transparent;
		height: 6px;
	}
</style>
