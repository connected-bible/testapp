<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { LayoutTab } from '$lib/modules/App';
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
</script>

<div class="section" style={`grid-row-start:${gridRowStart}`}>
	<div class="title">
		<div on:click={toggleSection} class={expanded ? 'chevron bottom' : 'chevron'} />
		<div>{title}</div>
	</div>
	<div class="tabs" style:display={expanded ? 'flex' : 'none'}>
		{#each tabs as tab, index}
			<div class={index == tabIndex ? 'tab tab-active' : 'tab'} on:click={() => (tabIndex = index)}>{tab.title ?? tab.reference}</div>
		{/each}
		<div class="tab-plus" on:click={addTab}>+</div>
	</div>
	<div class="tab-content-container" style:display={expanded ? 'block' : 'none'}>
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
		display: flex;
		flex-direction: row;
		overflow: hidden;
		background-color: gray;
		color: white;
		grid-row-start: 2;
	}

	.tab {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		min-width: 100px;
		max-width: 180px;
		box-sizing: border-box;
		padding: 2px 8px;
		background-color: #2d2d2d;
		border-right: 2px solid #1e1e1e;
		cursor: pointer;
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
		line-height: 12px;
		color: black;
		font-size: 1.8em;
		margin: 0 0 0 10px;
		padding: 3px 0 0 3px;
	}

	.tab-plus:hover {
		background-color: silver;
	}
</style>
