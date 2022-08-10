<script lang="ts">
	import ContentSection from './Section.svelte';
	import type { Layout, LayoutColumn, LayoutSection } from '$lib/modules/App';

	let layout: Layout = {
		columns: [
			{
				sections: [
					{
						title: 'Jeffrey',
						gridArea: '1/1/4/2',
						tabs: [
							{ reference: 'Gen-1', content: 'Jeffrey is a very interesting code monkey.' },
							{
								reference: 'Gen-2',
								content:
									'Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done. Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done.'
							}
						],
						tabIndex: 1,
						expanded: true
					}
				]
			},
			{
				sections: [
					{ title: 'Russell', gridArea: '1/3/1/4', tabs: [{ reference: 'Lev-19', content: 'Russell is the longstanding family name.' }], tabIndex: 0, expanded: false },
					{ title: 'Kelleran', gridArea: '3/3/3/4', tabs: [{ reference: 'Rth-1', content: 'Kelleran is a rare and unusual name.' }], tabIndex: 0, expanded: true }
				]
			}
		]
	};

	// const splitter: Splitter = { columns: ['1/2/4/3'], rows: ['2/3/3/4'] };

	function getTemplateStyle(items: LayoutColumn[] | LayoutSection[], type: 'columns' | 'sections'): string {
		const style: string[] = [];
		for (let i = 0; i < items.length; i++) {
			style.push(type == 'columns' ? '1fr' : (items[i] as LayoutSection).expanded ? '1fr' : 'min-content');
			if (i < items.length - 1) style.push('min-content');
		}
		console.log(`template style (${type}): ${style.join(' ')}`);
		return style.join(' ');
	}

	function refreshLayout(column: number, section: number, e: { detail: boolean }) {
		layout.columns[column].sections[section].expanded = e.detail;
		layout = layout;
	}
</script>

<div id="content-grid" style={`grid-template-columns:${getTemplateStyle(layout.columns, 'columns')}`}>
	{#each layout.columns as column, columnIndex}
		<div class="grid-column" style={`grid-template-rows:${getTemplateStyle(column.sections, 'sections')};grid-column-start:${columnIndex * 2 + 1}`}>
			{#each column.sections as section, sectionIndex}
				<ContentSection on:toggle={(e) => refreshLayout(columnIndex, sectionIndex, e)} title={section.title} tabs={section.tabs} gridRowStart={sectionIndex * 2 + 1} tabIndex={section.tabIndex} expanded={section.expanded} />
				{#if sectionIndex < column.sections.length - 1}
					<div class="split-row" style={`grid-row-start:${sectionIndex * 2 + 2}`} />
				{/if}
			{/each}
		</div>
		{#if columnIndex < layout.columns.length - 1}
			<div class="split-col" style={`grid-column-start:${columnIndex * 2 + 2}`} />
		{/if}
	{/each}
</div>

<style>
	#content-grid {
		grid-area: 1 / 2 / 1 / 3;
		justify-self: center;
		color: var(--text-color);
		padding: 0;
		overflow: hidden; /* overflow: auto; -- Set to auto if only one item in the grid */
		background-color: orange;
		display: grid;
		grid-template-columns: 1fr min-content 1fr;
		width: 100%;
		margin: 0;
		padding: 6px;
		box-sizing: border-box;
	}

	.grid-column {
		display: grid;
	}

	.split-col {
		background-color: transparent;
		width: 6px;
	}

	.split-row {
		background-color: transparent;
		height: 6px;
	}

	.split-col:hover {
		cursor: ew-resize;
		background-color: #007fd4;
	}

	.split-row:hover {
		cursor: ns-resize;
		background-color: #007fd4;
	}
</style>
