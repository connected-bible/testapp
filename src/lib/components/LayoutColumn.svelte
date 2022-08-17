<script lang="ts">
	import LayoutDrop from './LayoutDrop.svelte';
	import type Layout from './Layout.svelte';
	export let templateRows: string;
	export let columnIndex: number;
	export let columnStart: number;
	export let layout: Layout;
	export let dragging: boolean = true;
</script>

<div class="column" style={`grid-column-start:${columnStart};`}>
	<LayoutDrop direction={'left'} {columnIndex} {layout} visible={columnIndex == 0 && dragging} />
	<div class="column-content" style={`grid-template-rows:${templateRows};`}>
		<slot />
	</div>
	<LayoutDrop direction={'right'} {columnIndex} {layout} visible={dragging} />
</div>

<style>
	.column {
		display: grid;
		overflow: auto;
		grid-template-columns: min-content 1fr min-content;
	}

	.column-content {
		display: grid;
		overflow: auto;
		grid-column-start: 2;
	}
</style>
