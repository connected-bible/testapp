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
		button.style.visibility = visible ? 'visible' : 'hidden';
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
		const dragObj = Draggable.dragSource;
		if (!dragObj) return;
		layout.drop(dragObj, { componentType: 'tab', columnIndex: columnIndex, sectionIndex: sectionIndex, tabIndex: tabIndex, element: tabDiv[tabIndex] } as DropObject);
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
</script>

<div class="tabs" style={`display:${expanded ? 'flex' : 'none'};`}>
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
			on:dragend={() => layout.endDrag()}
			on:drop|preventDefault={(e) => dropOnTab(e, index)}
			on:dragover|preventDefault={(e) => (e.cancelBubble = true)}
			on:dragenter={(e) => {
				e.cancelBubble = true;
				layout.hideDragMarkers();
			}}
			on:dragleave={(e) => (e.cancelBubble = true)}
		>
			<div style="display: block;" bind:this={titleDiv[index]} class="tab-title" on:dblclick={() => editTitle(index)}>{tab.title ?? tab.reference}</div>
			<input style="display: none;" bind:this={titleInput[index]} type="text" class="tab-title-input" on:change={() => changeTitle(index, titleInput[index].value)} on:blur={() => changeTitle(index, titleInput[index].value)} />
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
		font-size: 2.05em;
		margin: 0 10px;
		padding: 0;
	}

	.tab-plus:hover {
		background-color: silver;
	}
</style>
