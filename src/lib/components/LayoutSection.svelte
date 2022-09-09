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
	export let fullScreen: boolean = false;
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
		if (renaming || fullScreen) {
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

	function viewFullScreen(full: boolean) {
		layout.viewFullScreen(full ? { columnIndex: columnIndex, sectionIndex: sectionIndex } : null);
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
		{#if fullScreen}
			<div class="button-restore-screen" on:click={() => viewFullScreen(false)}>
				<svg viewBox="0 0 512 512">
					<path
						fill="var(--ci-primary-color, currentColor)"
						d="M352,153H40.247a24.028,24.028,0,0,0-24,24V458a24.028,24.028,0,0,0,24,24H352a24.028,24.028,0,0,0,24-24V177A24.028,24.028,0,0,0,352,153Zm-8,32v45.22H48.247V185ZM48.247,450V262.22H344V450Z"
						class="ci-primary"
					/>
					<path fill="var(--ci-primary-color, currentColor)" d="M472,32H152a24.028,24.028,0,0,0-24,24v65h32V64H464V339.143H408v32h64a24.028,24.028,0,0,0,24-24V56A24.028,24.028,0,0,0,472,32Z" class="ci-primary" />
				</svg>
			</div>
			<div><!-- Grid placeholder, column 4 / context menu --></div>
		{:else}
			<div class="button-full-screen" on:click={() => viewFullScreen(true)}>
				<svg x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" style="stroke: white;fill: white;">
					<g>
						<path
							d="M44.8451996,18.5058994h-8c-0.5527,0-1,0.4473-1,1s0.4473,1,1,1h5.5859985L32.4310989,30.5069008l1.4141006,1.4139996
				l10-10.0008011V27.5049c0,0.5527992,0.4473,1,1,1s1-0.4472008,1-1v-7.9990005
				C45.8451996,18.9531994,45.3978996,18.5058994,44.8451996,18.5058994z"
						/>
						<path
							d="M22.3178005,42.0918007L10.8451996,53.5644989v-6.0585976c0-0.5527-0.4473-1-1-1s-1,0.4473-1,1v7.9990005
				c0,0.5527992,0.4473,1,1,1h8c0.5527,0,1-0.4472008,1-1c0-0.5527-0.4473-1-1-1h-5.1122999l10.9989996-10.9990005
				L22.3178005,42.0918007z"
						/>
						<path
							d="M57.3041992,0H16.7884998C13.4946003,0,10.8139,2.6807001,10.8139,5.9747v4.1181002H6.6947999
				c-3.2939,0-5.9735999,2.6807003-5.9735999,5.9745998v41.9580002C0.7212,61.3194008,3.4008999,64,6.6947999,64h40.5165977
				c3.2938995,0,5.9746017-2.6805992,5.9746017-5.9746017v-2.6766968h4.1181984c3.2938995,0,5.9746017-2.6807022,5.9746017-5.9746017
				V5.9747C63.278801,2.6807001,60.5980988,0,57.3041992,0z M51.1860008,58.0253983
				C51.1860008,60.2168007,49.4028015,62,47.2113991,62H6.6947999C4.5033998,62,2.7212,60.2168007,2.7212,58.0253983V16.0674
				c0-2.1913996,1.7821999-3.9745998,3.9735999-3.9745998h40.5165977c2.1914024,0,3.9746017,1.7832003,3.9746017,3.9745998V58.0253983
				z M61.278801,49.3740997c0,2.1913986-1.7831993,3.9746017-3.9746017,3.9746017h-4.1181984V16.0674
				c0-3.2938995-2.6807022-5.9745998-5.9746017-5.9745998H12.8139V5.9747C12.8139,3.7832999,14.5971003,2,16.7884998,2h40.5157013
				c2.1914024,0,3.9746017,1.7832999,3.9746017,3.9747V49.3740997z"
						/>
					</g>
				</svg>
			</div>
			<ContextMenu menuItems={contextMenuItems} iconType={'dots-vertical'} offsetTop={2} offsetRight={2} iconStyle={'grid-column-start:4;margin-right: 15px; place-self: center; width: 80%; height: 80%; margin-top: 1px;padding: 2px;'} />
		{/if}
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
		grid-template-columns: min-content 1fr min-content min-content;
		background-color: purple;
		font-weight: bold;
		color: white;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
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

	.button-full-screen {
		margin: 2px 4px 0 4px;
		width: 18px;
		height: 18px;
		grid-column-start: 3;
		cursor: pointer;
	}

	.button-restore-screen {
		margin: 2px 4px 0 4px;
		width: 18px;
		height: 18px;
		grid-column-start: 3;
		cursor: pointer;
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
