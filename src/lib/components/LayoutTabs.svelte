<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import type { LayoutTabData } from '$lib/modules/App';
	import { Draggable } from '$lib/modules/Draggable';
	import type { DropObject } from '$lib/modules/Draggable';
	import type Layout from '$lib/components/Layout.svelte';
	export let columnIndex: number;
	export let sectionIndex: number;
	export let tabs: LayoutTabData[];
	export let activeTab: number;
	export let expanded: boolean;
	export let layout: Layout;
	const dispatch = createEventDispatcher();

	/*
    export function setLayout(l: Layout) {
        layout = l;
    }
    */

	function addTab() {
		layout.addTab(columnIndex, sectionIndex);
	}

	function deleteTab(e: MouseEvent, tabIndex: number) {
		e.cancelBubble = true;
		e.preventDefault();
		layout.deleteTab(columnIndex, sectionIndex, tabIndex);
	}

	function clickTab(tabIndex: number) {
		activeTab = tabIndex;
		layout.clickTab(columnIndex, sectionIndex, activeTab);
	}

	function showTabClose(e: MouseEvent, visible: boolean) {
		if (!e || !e.target || !(e.target as HTMLElement).children) return;
		const button: HTMLElement = (e.target as HTMLElement).children[1] as HTMLElement;
		if (!button) return;
		button.style.visibility = visible ? 'visible' : 'hidden';
	}

	function dragTab(e: DragEvent, tabIndex: number) {
		e.cancelBubble = true;
		Draggable.dragStart(e, { componentType: 'tab', targetTypes: ['tab', 'section', 'layout-drop'], columnIndex: columnIndex, sectionIndex: sectionIndex, tabIndex: tabIndex });
	}

	function dropOnTab(e: DragEvent, tabIndex: number) {
		e.cancelBubble = true;
		const dragObj = Draggable.getDragSource(e);
		if (!dragObj) return;
		layout.drop(dragObj, { componentType: 'tab', columnIndex: columnIndex, sectionIndex: sectionIndex, tabIndex: tabIndex } as DropObject);
	}
</script>

<div class="tabs" style={`display:${expanded ? 'flex' : 'none'};`}>
	{#each tabs as tab, index (index)}
		<div
			class="tab"
			class:tab-active={index == activeTab}
			on:mouseenter={(e) => showTabClose(e, true)}
			on:mouseleave={(e) => showTabClose(e, false)}
			on:click={() => clickTab(index)}
			style={`width:${Math.trunc(100 / tabs.length)}%`}
			animate:flip
			draggable={true}
			on:dragstart={(e) => dragTab(e, index)}
			on:drop|preventDefault={(e) => dropOnTab(e, index)}
			on:dragover|preventDefault
			on:dragenter={() => (Draggable.hovering = index)}
			on:dragleave={() => (Draggable.hovering = null)}
			class:multi-trans-item-active={Draggable.hovering === index}
		>
			<div class="tab-label">{tab.title ?? tab.reference}</div>
			<div class="tab-close" style="visibility: hidden;" on:click={(e) => deleteTab(e, index)}>&#10006;</div>
		</div>
	{/each}

	<div class="tab-plus" on:click={addTab}>+</div>
</div>

<style>
	.tabs {
		overflow-x: auto;
		overflow-y: hidden;
		background-color: gray;
		color: white;
		grid-row-start: 3;
	}

	.tab {
		min-width: 60px;
		max-width: 170px;
		box-sizing: border-box;
		padding: 2px 8px;
		background-color: #606060; /*#2d2d2d*/
		border-right: 2px solid #1e1e1e;
		cursor: pointer;
		display: grid;
		grid-template-columns: 1fr min-content;
	}

	.tab-label {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tab-close {
		color: white;
		border-radius: 4px;
		padding: 0 4px;
	}

	.tab-close:hover {
		background-color: red;
		color: white;
	}

	.tab.tab-active {
		background-color: #1e1e1e;
	}

	.tab-plus {
		border-radius: 50%;
		background-color: transparent;
		cursor: pointer;
		padding: 0;
		height: 22px;
		width: 22px;
		line-height: 15px;
		color: black;
		font-size: 2.05em;
		margin: 0 10px;
		padding: 0;
	}

	.tab-plus:hover {
		background-color: silver;
	}
</style>
