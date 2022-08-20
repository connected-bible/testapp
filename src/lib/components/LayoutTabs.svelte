<script lang="ts">
	// import { createEventDispatcher } from 'svelte';
	import type { LayoutTabData } from '$lib/modules/App';
	import { flip } from 'svelte/animate';
	import { Draggable } from '$lib/modules/Draggable';
	import type { DropObject } from '$lib/modules/Draggable';
	import type Layout from '$lib/components/Layout.svelte';
	export let columnIndex: number;
	export let sectionIndex: number;
	export let tabs: LayoutTabData[];
	export let activeTab: number;
	export let expanded: boolean;
	export let layout: Layout;
	let tabDiv: HTMLDivElement[] = [];
	let titleDiv: HTMLDivElement[] = [];
	let titleInput: HTMLInputElement[] = [];
	let dragMarkerDiv: HTMLDivElement;
	let renaming: boolean = false;

	// const dispatch = createEventDispatcher();

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
		if (renaming) return;
		if (!e || !e.target || !(e.target as HTMLElement).children) return;
		const button: HTMLElement = (e.target as HTMLElement).children[2] as HTMLElement;
		if (!button) return;
		button.style.display = visible ? 'block' : 'none';
	}

	function dragTab(e: DragEvent, tabIndex: number) {
		if (renaming) {
			e.preventDefault();
			return;
		}
		e.cancelBubble = true;
		Draggable.dragStart(e, { componentType: 'tab', targetTypes: ['tab', 'section', 'layout-drop'], columnIndex: columnIndex, sectionIndex: sectionIndex, tabIndex: tabIndex });
	}

	function dropOnTab(e: DragEvent, tabIndex: number) {
		e.cancelBubble = true;
		dragMarkerDiv.style.display = 'none';
		const dragObj = Draggable.dragSource;
		if (!dragObj) return;
		const dropIndex = tabIndex >= tabs.length ? tabIndex : tabIndex + getTabOffset(e, tabIndex);
		layout.drop(dragObj, { componentType: 'tab', columnIndex: columnIndex, sectionIndex: sectionIndex, tabIndex: dropIndex, element: tabDiv[tabIndex] } as DropObject);
	}

	function editTitle(tabIndex: number) {
		renaming = true;
		const tab = tabs[tabIndex];
		const title = tab.title ?? tab.reference;
		titleDiv[tabIndex].style.display = 'none';
		const input = titleInput[tabIndex];
		input.value = title;
		input.style.display = 'block';
		input.focus();
		input.select();
	}

	function changeTitle(tabIndex: number, title: string) {
		if (!title) title = '(Untitled)';
		titleInput[tabIndex].style.display = 'none';
		titleDiv[tabIndex].style.display = 'block';
		layout.changeTabTitle(columnIndex, sectionIndex, tabIndex, title);
		renaming = false;
	}

	function dragOverTab(e: DragEvent, tabIndex: number) {
		if (Draggable.dragSource?.componentType != 'tab') return;
		const left = tabDiv[tabIndex].offsetLeft;
		const width = tabDiv[tabIndex].offsetWidth;
		const tabOffset = getTabOffset(e, tabIndex);
		const offset = tabOffset == 1 ? width - 2 : -2;
		dragMarkerDiv.style.left = `${left + offset}px`;
		dragMarkerDiv.style.top = `${tabDiv[tabIndex].offsetTop - 5}px`;
		dragMarkerDiv.style.height = `${tabDiv[tabIndex].offsetHeight + 10}px`;
		dragMarkerDiv.style.display = 'grid';
	}

	function getTabOffset(e: DragEvent, tabIndex: number): number {
		const src = Draggable.dragSource;
		if (!src) return 0;
		if (src.componentType != 'tab') return 0;
		const otherTabs = src.columnIndex != columnIndex || src.sectionIndex != sectionIndex;
		let offsetPoint = 0.5;
		if (!otherTabs) offsetPoint = src.tabIndex == tabIndex - 1 ? 0 : src.tabIndex == tabIndex + 1 ? 1 : 0.5;
		const left = tabDiv[tabIndex].offsetLeft;
		const width = tabDiv[tabIndex].offsetWidth;
		const x = (e.clientX - left) / width;
		return x > offsetPoint ? 1 : 0;
	}

	export function hideDragMarker() {
		dragMarkerDiv.style.display = 'none';
	}
</script>

<div
	class="tabs"
	style={`display:${expanded ? 'flex' : 'none'};`}
	on:drop|preventDefault={(e) => dropOnTab(e, tabs.length)}
	on:dragleave|preventDefault={(e) => {
		const cType = Draggable.dragSource?.componentType;
		if (cType == 'tab') e.cancelBubble = true;
	}}
	on:dragover|preventDefault={(e) => {
		const cType = Draggable.dragSource?.componentType;
		if (cType == 'tab') e.cancelBubble = true;
	}}
	on:dragenter|preventDefault={(e) => {
		const cType = Draggable.dragSource?.componentType;
		if (cType == 'tab') {
			e.cancelBubble = true;
			layout.hideDragMarkers();
		}
	}}
>
	{#each tabs as tab, index (index)}
		<div
			bind:this={tabDiv[index]}
			class="tab"
			class:tab-active={index == activeTab}
			on:mouseenter={(e) => showTabClose(e, true)}
			on:mouseleave={(e) => showTabClose(e, false)}
			on:click={() => clickTab(index)}
			style={`width:${Math.trunc(100 / tabs.length)}%`}
			animate:flip
			draggable={true}
			on:dragstart={(e) => dragTab(e, index)}
			on:dragend={() => {
				layout.endDrag();
				dragMarkerDiv.style.display = 'none';
			}}
			on:drop|preventDefault={(e) => dropOnTab(e, index)}
			on:dragover|preventDefault={(e) => dragOverTab(e, index)}
		>
			<div style="display: block;" bind:this={titleDiv[index]} class="tab-title" on:dblclick={() => editTitle(index)} on:dragover|preventDefault on:dragenter|preventDefault on:dragleave|preventDefault>{tab.title ?? tab.reference}</div>
			<input style="display: none;" bind:this={titleInput[index]} type="text" class="tab-title-input" on:change={() => changeTitle(index, titleInput[index].value)} on:blur={() => changeTitle(index, titleInput[index].value)} />
			<div class="tab-close" style="display:none;" on:click={(e) => deleteTab(e, index)} on:dragover|preventDefault on:dragenter|preventDefault on:dragleave|preventDefault>&#10006;</div>
		</div>
	{/each}
	<div class="tab-plus" on:click={addTab}><span style="margin-left:2px;">+</span></div>
	<div class="drag-marker" bind:this={dragMarkerDiv} style="display: none">
		<div class="drag-marker-top">&nbsp;</div>
		<div class="drag-marker-bottom">&nbsp;</div>
	</div>
</div>

<style>
	.tabs {
		overflow-x: auto;
		overflow-y: hidden;
		background-color: gray;
		color: white;
	}

	.tab {
		min-width: 60px;
		max-width: 210px;
		box-sizing: border-box;
		padding: 2px 8px;
		background-color: #606060; /*#2d2d2d*/
		border-right: 2px solid #1e1e1e;
		cursor: pointer;
		display: grid;
		grid-template-columns: 1fr min-content;
	}

	.tab-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		grid-column-start: 1;
	}

	.tab-title-input {
		grid-column-start: 1;
		width: 100%;
		border: none;
		background-color: white;
	}

	.tab-close {
		color: white;
		border-radius: 4px;
		padding: 0 4px;
		grid-column-start: 2;
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
		font-size: 1.65em;
		margin: 1px 10px;
		padding: 0;
	}

	.tab-plus:hover {
		background-color: silver;
	}

	.drag-marker {
		position: absolute;
		background-color: #007fd4;
		display: grid;
		width: 4px;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr;
		pointer-events: none;
	}

	.drag-marker-top {
		width: 0;
		height: 0;
		border-left: 7px solid transparent;
		border-right: 7px solid transparent;
		border-top: 7px solid red;
		grid-row-start: 1;
		margin-left: -5px;
	}

	.drag-marker-bottom {
		width: 0;
		height: 0;
		border-left: 7px solid transparent;
		border-right: 7px solid transparent;
		border-bottom: 7px solid red;
		grid-row-start: 3;
		margin-left: -5px;
		justify-self: end;
	}
</style>
