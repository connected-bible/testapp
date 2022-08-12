<script lang="ts">
	import { flip } from 'svelte/animate';
	import { createEventDispatcher } from 'svelte';
	import type { LayoutTab } from '$lib/modules/App';
	import { Draggable } from '$lib/modules/Draggable';
	export let title: string;
	export let tabs: LayoutTab[];
	export let tabIndex: number;
	export let expanded: boolean;
	export let gridRowStart: number;

	const dispatch = createEventDispatcher();

	function toggleSection() {
		dispatch('toggle', !expanded);
	}

	function addTab() {
		dispatch('addTab');
	}

	function deleteTab(e: MouseEvent, index: number) {
		e.cancelBubble = true;
		e.preventDefault();
		dispatch('deleteTab', index);
	}

	function clickTab(index: number) {
		tabIndex = index;
		dispatch('clickTab', tabIndex);
	}

	function showTabClose(e: MouseEvent, visible: boolean) {
		if (!e || !e.target || !(e.target as HTMLElement).children) return;
		const button: HTMLElement = (e.target as HTMLElement).children[1] as HTMLElement;
		if (!button) return;
		button.style.visibility = visible ? 'visible' : 'hidden';
	}
</script>

<div class="section" style={`grid-row-start:${gridRowStart}`}>
	<div class="title">
		<div on:click={toggleSection} class={expanded ? 'chevron bottom' : 'chevron'} />
		<div>{title}</div>
	</div>
	<div class="tabs" style={`display:${expanded ? 'flex' : 'none'};`}>
		{#each tabs as tab, index (index)}
			<div
				class="tab"
				class:tab-active={index == tabIndex}
				on:mouseenter={(e) => showTabClose(e, true)}
				on:mouseleave={(e) => showTabClose(e, false)}
				on:click={() => clickTab(index)}
				style={`width:${Math.trunc(100 / tabs.length)}%`}
				animate:flip
				draggable={true}
				on:dragstart={(event) => Draggable.dragstart(event, index)}
				on:drop|preventDefault={(event) => Draggable.drop(event, tabs, index)}
				on:dragover|preventDefault
				on:dragenter={() => (Draggable.hovering = index)}
				class:multi-trans-item-active={Draggable.hovering === index}
			>
				<div class="tab-label">{tab.title ?? tab.reference}</div>
				<div class="tab-close" style="visibility: hidden;" on:click={(e) => deleteTab(e, index)}>&#10006;</div>
			</div>
		{/each}

		<div class="tab-plus" on:click={addTab}>+</div>
	</div>
	<div class="tab-content-container" style:display={expanded ? 'grid' : 'none'}>
		{#each tabs as tab, index}
			<div class="tab-content" style={`display:${index == tabIndex ? 'block' : 'none'}`}>{tab.content}</div>
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
		grid-row-start: 1;
	}

	.tabs {
		overflow-x: auto;
		overflow-y: hidden;
		background-color: gray;
		color: white;
		grid-row-start: 2;
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

	.tab-content-container {
		grid-row-start: 3;
		overflow: auto;
	}

	.tab-content {
		color: var(--text-color);
		padding: 6px;
		box-sizing: border-box;
		overflow: auto;
	}

	.tab-plus {
		border-radius: 50%;
		background-color: transparent;
		cursor: pointer;
		padding: 0;
		height: 22px;
		width: 22px;
		line-height: 14px;
		color: black;
		font-size: 1.95em;
		margin: 0 10px;
		padding: 0;
	}

	.tab-plus:hover {
		background-color: silver;
	}
</style>
