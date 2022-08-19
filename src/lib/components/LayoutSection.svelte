<script lang="ts">
	import type { LayoutTabData } from '$lib/modules/App';
	import type Layout from '$lib/components/Layout.svelte';
	import { Draggable } from '$lib/modules/Draggable';
	import type { DragObject, DropObject } from '$lib/modules/Draggable';
	import LayoutTabs from './LayoutTabs.svelte';
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

	function dragSection(e: DragEvent, columnIndex: number, sectionIndex: number) {
		e.cancelBubble = true;
		Draggable.dragStart(e, { componentType: 'section', targetTypes: ['section', 'layout-drop'], columnIndex: columnIndex, sectionIndex: sectionIndex } as DragObject, titleContainer);
		const dragSource = Draggable.dragSource;
	}

	function dropOnSection(e: DragEvent) {
		e.cancelBubble = true;
		const dragObj = Draggable.dragSource;
		if (!dragObj) return;
		layout.drop(dragObj, { componentType: 'section', columnIndex: columnIndex, sectionIndex: sectionIndex, direction: getDragDirection(e, dragObj.componentType) } as DropObject);
	}

	function editTitle() {
		titleDiv.contentEditable = 'true';
		const sel = window.getSelection();
		const range = document.createRange();
		range.setStart(titleDiv.childNodes[0], 0);
		range.setEnd(titleDiv.childNodes[0], titleDiv.innerText.length);
		sel?.removeAllRanges();
		sel?.addRange(range);
	}

	function changeTitle(title: string) {
		if (!title) {
			title = '(Untitled)';
			titleDiv.innerText = title;
		} else if (title.indexOf('\n') != 0) {
			title = title.replace(/\n/g, ' ');
			titleDiv.innerText = title;
		}
		layout.changeSectionTitle(columnIndex, sectionIndex, title);
		titleDiv.contentEditable = 'false';
		titleDiv.scrollLeft = 0;
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
		Draggable.hovering = { componentType: 'section', columnIndex: columnIndex, sectionIndex: sectionIndex, direction: getDragDirection(e, dragSource.componentType) };
		layout.dragOverSection(Draggable.hovering as DropObject, sectionDiv);
	}

	function getDragDirection(e: DragEvent, componentType: string): 'left' | 'right' | 'top' | 'bottom' | '' {
		const x = (e.clientX - sectionDiv.offsetLeft) / sectionDiv.offsetWidth;
		const y = (e.clientY - sectionDiv.offsetTop) / sectionDiv.offsetHeight;
		const xGap = x < 0.5 ? x : 1 - x;
		const yGap = y < 0.5 ? y : 1 - y;
		if (componentType == 'tab' && xGap > 0.07 && yGap > 0.07) return '';
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
	on:drop|preventDefault={(e) => dropOnSection(e)}
	on:dragover|preventDefault={(e) => dragOverSection(e, true)}
	on:dragenter={(e) => dragOverSection(e, true)}
	on:dragleave={(e) => dragOverSection(e, false)}
>
	<div class="title" bind:this={titleContainer} draggable={true} on:dragstart={(e) => dragSection(e, columnIndex, sectionIndex)} on:dragend={() => layout.endDrag()}>
		<div on:click={() => layout.toggleSection(columnIndex, sectionIndex, !expanded)} class={expanded ? 'chevron bottom' : 'chevron'} />
		<div class="title-text" bind:this={titleDiv} on:dblclick={editTitle} on:blur={() => changeTitle(titleDiv.innerText)}>{title}</div>
	</div>
	<LayoutTabs {columnIndex} {sectionIndex} {tabs} {activeTab} {expanded} {layout} />
	<div class="tab-content-container" style:display={expanded ? 'grid' : 'none'}>
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
		margin: 4px 10px 0 5px;
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
		padding-bottom: 3px;
		padding-left: 8px;
	}

	.title-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
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
