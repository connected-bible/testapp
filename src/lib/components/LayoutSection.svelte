<script lang="ts">
	import type { LayoutTabData } from '$lib/modules/App';
	import type Layout from '$lib/components/Layout.svelte';
	import { Draggable } from '$lib/modules/Draggable';
	import type { DragObject, DropObject } from '$lib/modules/Draggable';
	import LayoutDrop from './LayoutDrop.svelte';
	import LayoutTabs from './LayoutTabs.svelte';
	export let title: string;
	export let tabs: LayoutTabData[];
	export let columnIndex: number;
	export let sectionIndex: number;
	export let isLastSection: boolean;
	export let activeTab: number;
	export let expanded: boolean;
	export let gridRowStart: number;
	export let dragging: boolean = true;
	export let layout: Layout;
	let dragImage: HTMLElement;

	function dragSection(e: DragEvent, columnIndex: number, sectionIndex: number) {
		e.cancelBubble = true;
		Draggable.dragStart(e, { componentType: 'section', targetTypes: ['section', 'layout-drop'], columnIndex: columnIndex, sectionIndex: sectionIndex } as DragObject, dragImage);
	}

	function dropOnSection(e: DragEvent) {
		e.cancelBubble = true;
		const dragObj = Draggable.getDragSource(e);
		if (!dragObj) return;
		layout.drop(dragObj, { componentType: 'section', columnIndex: columnIndex, sectionIndex: sectionIndex } as DropObject);
	}

	export function setActiveTab(tabIndex: number) {
		activeTab = tabIndex;
	}
</script>

<div
	class="section"
	style={`grid-row-start:${gridRowStart}`}
	draggable={true}
	on:dragstart={(e) => dragSection(e, columnIndex, sectionIndex)}
	on:drop|preventDefault={(e) => dropOnSection(e)}
	on:dragover|preventDefault
	on:dragenter={() => (Draggable.hovering = { columnIndex: columnIndex, sectionIndex: sectionIndex })}
	on:dragleave={() => (Draggable.hovering = null)}
>
	<LayoutDrop direction={'top'} {columnIndex} {sectionIndex} {layout} visible={dragging} />
	<div class="title" bind:this={dragImage}>
		<div on:click={() => layout.toggleSection(columnIndex, sectionIndex, !expanded)} class={expanded ? 'chevron bottom' : 'chevron'} />
		<div>{title}</div>
	</div>
	<LayoutTabs {columnIndex} {sectionIndex} {tabs} {expanded} {activeTab} {layout} />

	<div class="tab-content-container" style:display={expanded ? 'grid' : 'none'}>
		{#each tabs as tab, index}
			<div class="tab-content" style={`display:${index == activeTab ? 'block' : 'none'}`}>{tab.content}</div>
		{/each}
	</div>
	<LayoutDrop direction={'bottom'} {columnIndex} {sectionIndex} {layout} visible={isLastSection && dragging} />
</div>

<style>
	.section {
		background-color: white;
		border: 1px solid gray;
		border-radius: 6px;
		overflow: auto;
		display: grid;
		grid-template-rows: min-content min-content min-content 1fr min-content;
		grid-template-columns: 1fr;
	}

	.chevron::before {
		border-style: solid;
		border-width: 0.2em 0.2em 0 0;
		content: '';
		display: inline-block;
		height: 0.27em;
		left: 0.15em;
		position: relative;
		top: 0.15em;
		transform: rotate(45deg);
		vertical-align: top;
		width: 0.27em;
		color: white;
		margin: 4px 5px 0 5px;
		z-index: 0;
	}

	.chevron.bottom:before {
		top: 0;
		transform: rotate(135deg);
	}

	.title {
		display: flex;
		flex-direction: row;
		background-color: purple;
		font-weight: bold;
		color: white;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		padding-left: 8px;
		white-space: nowrap;
		text-overflow: ellipsis;
		grid-row-start: 2;
	}

	.tab-content-container {
		grid-row-start: 4;
		overflow: auto;
	}

	.tab-content {
		color: var(--text-color);
		padding: 6px;
		box-sizing: border-box;
		overflow: auto;
	}
</style>
