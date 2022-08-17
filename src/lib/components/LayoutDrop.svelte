<script lang="ts">
	import { Draggable } from '$lib/modules/Draggable';
	import type { DropObject } from '$lib/modules/Draggable';
	import type Layout from './Layout.svelte';
	export let direction: 'top' | 'bottom' | 'left' | 'right';
	export let columnIndex: number;
	export let sectionIndex: number | null = null;
	export let visible: boolean;
	export let layout: Layout;

	/*
    on:mouseenter={(e) => showTabClose(e, true)}
    on:mouseleave={(e) => showTabClose(e, false)}
    on:click={() => clickTab(index)}
    style={`width:${Math.trunc(100 / tabs.length)}%`}
    animate:flip
    draggable={true}
    on:dragstart={(e) => dragStart(e, index)}
    on:drop|preventDefault={(e) => drop(e, index)}
    on:dragover|preventDefault
    on:dragenter={() => (Draggable.hovering = index)}
    class:multi-trans-item-active={Draggable.hovering === index}
    */
	function highlight(e: DragEvent, on: boolean) {
		console.log('called highlight');
		let elem = e.target as HTMLElement | null;
		if (elem && !elem.classList.contains('drop-area')) elem = elem.parentElement;
		if (!elem) return;
		e.stopPropagation();
		elem.style.backgroundColor = on ? 'cornflowerblue' : '';
		elem.style.color = on ? 'white' : '';
		Draggable.hovering = on ? { columnIndex: columnIndex, sectionIndex: sectionIndex } : null;
	}

	function drop(e: DragEvent) {
		e.cancelBubble = true;
		highlight(e, false);
		const dragObj = Draggable.getDragSource(e);
		if (!dragObj) return;
		Draggable.hovering = null;
		layout.drop(dragObj, { componentType: 'layout-drop', columnIndex: columnIndex, sectionIndex: sectionIndex, direction: direction } as DropObject);
	}
</script>

<div class="drop-area" style:display={visible ? 'grid' : 'none'} draggable={false} on:drop|preventDefault={(e) => drop(e)} on:dragover|preventDefault on:dragenter={(e) => highlight(e, true)} on:dragleave={(e) => highlight(e, false)}>
	<div class:drop-horizontal={direction == 'top' || direction == 'bottom'} class:drop-left={direction == 'left'} class:drop-right={direction == 'right'}>
		{direction == 'left' || direction == 'right' ? 'DROP - NEW COLUMN' : 'DROP - NEW ROW'}
	</div>
</div>

<style>
	.drop-area {
		background-color: white;
		border: 1px dashed silver;
		border-radius: 6px;
		color: #808080;
		box-sizing: border-box;
		place-items: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.drop-area > .drop-horizontal {
		height: 30px;
		line-height: 30px;
	}

	.drop-area > .drop-left {
		width: 30px;
		transform: rotate(-90deg);
	}

	.drop-area > .drop-right {
		width: 30px;
		transform: rotate(90deg);
	}
</style>
