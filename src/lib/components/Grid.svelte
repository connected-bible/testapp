<script lang="ts">
	import ContentSection from './Section.svelte';
	import type { Layout, LayoutColumn, LayoutSection } from '$lib/modules/App';
	import { select_options } from 'svelte/internal';

	const longString =
		'Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done. Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done.';

	let layout: Layout = {
		columns: [
			{
				sections: [
					{
						title: 'Jeffrey',
						tabs: [
							{ title: 'Creation of the World', reference: 'Gen-1', content: 'Jeffrey is a very interesting code monkey.' },
							{ reference: 'Gen-2', content: longString },
							{ title: 'Fall of Mankind', reference: 'Gen-3', content: longString.substring(longString.length - 100, 100) + longString.substring(0, longString.length - 100) }
						],
						tabIndex: 2,
						expanded: true
					}
				]
			},
			{
				sections: [
					{ title: 'Russell', tabs: [{ reference: 'Lev-19', content: 'Russell is the longstanding family name.' }], tabIndex: 0, expanded: false },
					{ title: 'Kelleran', tabs: [{ reference: 'Rth-1', content: 'Kelleran is a rare and unusual name.' }], tabIndex: 0, expanded: true }
				]
			}
		]
	};

	function getTemplateStyle(items: LayoutColumn[] | LayoutSection[], type: 'columns' | 'sections'): string {
		const style: string[] = [];
		for (let i = 0; i < items.length; i++) {
			style.push(type == 'columns' ? '1fr' : (items[i] as LayoutSection).expanded ? '1fr' : 'min-content');
			if (i < items.length - 1) style.push('min-content');
		}
		return style.join(' ');
	}

	function refreshLayout(section: LayoutSection, expanded: boolean) {
		section.expanded = expanded;
		layout = layout;
	}

	function addTab(section: LayoutSection) {
		section.tabs.push({ title: '(New)', reference: 'Gen-50', content: 'Open a new document or Bible passage while this window is active.' });
		section.tabIndex = section.tabs.length - 1;
		layout = layout;
	}

	function deleteTab(columnIndex: number, sectionIndex: number, tabIndex: number) {
		const column = layout.columns[columnIndex];
		const section = column.sections[sectionIndex];
		if (section.tabIndex > tabIndex || section.tabIndex == section.tabs.length - 1) section.tabIndex = section.tabIndex - 1;
		section.tabs.splice(tabIndex, 1);
		if (section.tabs.length == 0) column.sections.splice(sectionIndex, 1);
		if (column.sections.length == 0) layout.columns.splice(columnIndex, 1);
		layout = layout;
	}

	function clickTab(section: LayoutSection, tabIndex: number) {
		section.tabIndex = tabIndex;
	}
</script>

<div id="content-grid" style={`grid-template-columns:${getTemplateStyle(layout.columns, 'columns')}`}>
	{#each layout.columns as column, columnIndex}
		<div class="grid-column" style={`grid-template-rows:${getTemplateStyle(column.sections, 'sections')};grid-column-start:${columnIndex * 2 + 1}`}>
			{#each column.sections as section, sectionIndex}
				<ContentSection
					on:toggle={(e) => refreshLayout(section, e.detail)}
					on:addTab={() => addTab(section)}
					on:deleteTab={(e) => deleteTab(columnIndex, sectionIndex, e.detail)}
					on:clickTab={(e) => clickTab(section, e.detail)}
					title={section.title}
					tabs={section.tabs}
					gridRowStart={sectionIndex * 2 + 1}
					tabIndex={section.tabIndex}
					expanded={section.expanded}
				/>
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
		overflow: auto; /* overflow: auto; -- Set to auto if only one item in the grid */
		background-color: orange;
		display: grid;
		grid-template-columns: 1fr min-content 1fr;
		grid-template-rows: 1fr;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 6px;
		box-sizing: border-box;
	}

	.grid-column {
		display: grid;
		overflow: auto;
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
