<script lang="ts">
	import type { LayoutTabData, MenuItem } from '$lib/modules/App';
	import type Layout from '$lib/components/Layout.svelte';
	import { Draggable } from '$lib/modules/Draggable';
	import type { DragObject, DropObject } from '$lib/modules/Draggable';
	import LayoutTabs from '$lib/components/LayoutTabs.svelte';
	import ContextMenu from './ContextMenu.svelte';
	export let title: string;
	export let tabs: LayoutTabData[];
	export let columnIndex: number;
	export let sectionIndex: number;
	export let activeTab: number;
	export let expanded: boolean;
	export let gridRowStart: number;
	export let layout: Layout;
	let sectionDiv: HTMLDivElement;
	let titleContainer: HTMLDivElement;
	let titleDiv: HTMLDivElement;
	let titleInput: HTMLInputElement;
	let renaming: boolean = false;
	let layoutTabs: LayoutTabs;
	let contextMenuItems: MenuItem[] = [
		{
			caption: 'New Section',
			command: () => {
				layout.newSection(columnIndex, sectionIndex);
			}
		},
		{
			caption: 'Delete',
			command: () => {
				layout.deleteSection(columnIndex, sectionIndex);
			}
		},
		{
			caption: 'Duplicate',
			command: () => {
				layout.duplicateSection(columnIndex, sectionIndex);
			}
		}
	];

	function dragSection(e: DragEvent, columnIndex: number, sectionIndex: number) {
		if (renaming) {
			e.preventDefault();
			return;
		}
		e.cancelBubble = true;
		Draggable.dragStart(e, { componentType: 'section', targetTypes: ['section', 'layout-drop'], columnIndex: columnIndex, sectionIndex: sectionIndex } as DragObject, titleContainer);
		const dragSource = Draggable.dragSource;
	}

	function dropOnSection(e: DragEvent) {
		e.cancelBubble = true;
		const dragObj = Draggable.dragSource;
		if (!dragObj) return;
		layout.drop(dragObj, { componentType: 'section', columnIndex: columnIndex, sectionIndex: sectionIndex, direction: getDragDirection(e, dragObj.componentType), element: sectionDiv } as DropObject);
	}

	function editTitle() {
		renaming = true;
		titleDiv.style.display = 'none';
		titleInput.value = title;
		titleInput.style.display = 'block';
		titleInput.focus();
		titleInput.select();
	}

	function changeTitle(title: string) {
		if (!title) title = '(Untitled)';
		titleInput.style.display = 'none';
		titleDiv.style.display = 'block';
		layout.changeSectionTitle(columnIndex, sectionIndex, title);
		renaming = false;
	}

	export function setActiveTab(tabIndex: number) {
		activeTab = tabIndex;
	}

	function dragOverSection(e: DragEvent, visible: boolean) {
		if (!visible) {
			Draggable.hovering = null;
			return;
		}
		const dragSource = Draggable.dragSource;
		if (!dragSource) return;
		Draggable.hovering = { componentType: 'section', columnIndex: columnIndex, sectionIndex: sectionIndex, direction: getDragDirection(e, dragSource.componentType), element: sectionDiv };
		layout.dragOverSection(Draggable.hovering as DropObject);
	}

	function getDragDirection(e: DragEvent, componentType: string): 'left' | 'right' | 'top' | 'bottom' | 'none' {
		const x = (e.clientX - sectionDiv.offsetLeft) / sectionDiv.offsetWidth;
		const y = (e.clientY - sectionDiv.offsetTop) / sectionDiv.offsetHeight;
		const xGap = x < 0.5 ? x : 1 - x;
		const yGap = y < 0.5 ? y : 1 - y;
		if (componentType == 'tab' && xGap > 0.1 && yGap > 0.1) return 'none';
		let direction: 'left' | 'right' | 'top' | 'bottom';
		if (xGap < yGap) {
			direction = x < 0.5 ? 'left' : 'right';
		} else {
			direction = y < 0.5 ? 'top' : 'bottom';
		}
		return direction;
	}
</script>

<div
	bind:this={sectionDiv}
	class="section"
	style={`grid-row-start:${gridRowStart}`}
	on:drop|preventDefault={(e) => {
		layoutTabs.hideDragMarker();
		dropOnSection(e);
	}}
	on:dragover|preventDefault={(e) => dragOverSection(e, true)}
	on:dragenter={(e) => {
		layoutTabs.hideDragMarker();
		dragOverSection(e, true);
	}}
	on:dragleave={(e) => {
		layoutTabs.hideDragMarker();
		dragOverSection(e, false);
	}}
>
	<div class="title" bind:this={titleContainer} draggable={true} on:dragstart={(e) => dragSection(e, columnIndex, sectionIndex)} on:dragend={() => layout.endDrag()}>
		<div on:click={() => layout.toggleSection(columnIndex, sectionIndex, !expanded)} class={expanded ? 'chevron bottom' : 'chevron'} />
		<div style="display: block;" class="title-text" bind:this={titleDiv} on:dblclick={editTitle} on:blur={() => changeTitle(titleDiv.innerText)}>{title}</div>
		<input style="display: none;" class="title-input" bind:this={titleInput} type="text" on:change={() => changeTitle(titleInput.value)} on:blur={() => changeTitle(titleInput.value)} />
		<ContextMenu menuItems={contextMenuItems} iconType={'dots-vertical'} offsetTop={2} offsetRight={2} iconStyle={'grid-column-start:3;margin-right: 15px; place-self: center; width: 80%; height: 80%; margin-top: 1px;padding: 2px;'} />
	</div>
	<LayoutTabs bind:this={layoutTabs} {columnIndex} {sectionIndex} {tabs} {activeTab} {expanded} {layout} />
	<div class="tab-content-container" style:display={expanded ? 'grid' : 'none'} on:dragenter|preventDefault>
		{#each tabs as tab, index}
			<div class="tab-content" style={`display:${index == activeTab ? 'block' : 'none'}`}>{tab.content}</div>
		{/each}
	</div>
</div>

<style>
	.section {
		background-color: white;
		border: 1px solid gray;
		border-radius: 6px;
		overflow: auto;
		display: grid;
		grid-template-rows: min-content min-content 1fr;
		grid-template-columns: 1fr;
	}

	.chevron {
		grid-column-start: 1;
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
		margin: 5px 10px 0 5px;
		z-index: 0;
	}

	.chevron.bottom:before {
		top: 0;
		transform: rotate(135deg);
	}

	.title {
		display: grid;
		grid-template-columns: min-content 1fr min-content;
		background-color: purple;
		font-weight: bold;
		color: white;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		padding-bottom: 3px;
		padding-left: 8px;
	}

	.title-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		grid-column-start: 2;
	}

	.title-input {
		width: 100%;
		max-width: 250px;
		border: none;
		background-color: white;
		grid-column-start: 2;
	}

	.tab-content-container {
		overflow: auto;
	}

	.tab-content {
		color: var(--text-color);
		padding: 6px;
		box-sizing: border-box;
		overflow: auto;
	}
</style>
