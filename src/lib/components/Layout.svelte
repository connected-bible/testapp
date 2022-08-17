<script lang="ts">
	import type { App } from '$lib/modules/App';
	import LayoutColumn from './LayoutColumn.svelte';
	import LayoutSection from './LayoutSection.svelte';
	import type { LayoutData, LayoutColumnData, LayoutSectionData } from '$lib/modules/App';
	import { Draggable } from '$lib/modules/Draggable';
	import type Layout from './Layout.svelte';
	import type { DragObject, DropObject } from '$lib/modules/Draggable';

	let app: App;
	let layout: Layout;

	export function setApp(a: App) {
		app = a;
		layout = app.layout;
	}

	const longString =
		'Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done. Thus the heavens and the earth were finished, and all the host of them. And on the seventh day God finished his work that he had done, and he rested on the seventh day from all his work that he had done.';

	let data: LayoutData = {
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
						activeTab: 2,
						expanded: true
					}
				]
			},
			{
				sections: [
					{ title: 'Russell', tabs: [{ reference: 'Lev-19', content: 'Russell is the longstanding family name.' }], activeTab: 0, expanded: false },
					{ title: 'Kelleran', tabs: [{ reference: 'Rth-1', content: 'Kelleran is a rare and unusual name.' }], activeTab: 0, expanded: true }
				]
			}
		]
	};

	function getTemplateStyle(items: LayoutColumnData[] | LayoutSectionData[], type: 'columns' | 'sections'): string {
		const style: string[] = [];
		for (let i = 0; i < items.length; i++) {
			style.push(type == 'columns' ? '1fr' : (items[i] as LayoutSectionData).expanded ? '1fr' : 'min-content');
			if (i < items.length - 1) style.push('min-content');
		}
		return style.join(' ');
	}

	export function toggleSection(columnIndex: number, sectionIndex: number, expanded: boolean) {
		const section = data.columns[columnIndex].sections[sectionIndex];
		section.expanded = expanded;
		data = data;
	}

	export function addTab(columnIndex: number, sectionIndex: number) {
		const section = data.columns[columnIndex].sections[sectionIndex];
		section.tabs.push({ title: '(New)', reference: 'Gen-50', content: 'Open a new document or Bible passage while this window is active.' });
		section.activeTab = section.tabs.length - 1;
		data = data;
	}

	export function deleteTab(columnIndex: number, sectionIndex: number, tabIndex: number) {
		data.columns[columnIndex].sections[sectionIndex].tabs.splice(tabIndex, 1);
		onDeleteTab(columnIndex, sectionIndex, tabIndex);
		data = data;
	}

	function onDeleteTab(columnIndex: number, sectionIndex: number, deletedTab: number) {
		const column = data.columns[columnIndex];
		const section = column.sections[sectionIndex];

		// Set the active tab
		setActiveTabOnDelete(section, deletedTab);

		// Remove the section if it is empty
		if (section.tabs.length == 0) column.sections.splice(sectionIndex, 1);

		// Remove the column if it is empty
		if (column.sections.length == 0) data.columns.splice(columnIndex, 1);
	}

	function setActiveTabOnDelete(section: LayoutSectionData, deletedTab: number) {
		// If deleted tab was active and was the last tab, or if it was less than the active tab => reset to the last tab (could be = -1 if no tabs left, in which case the section will be deleted)
		if ((section.activeTab == deletedTab && deletedTab > section.tabs.length - 1) || deletedTab < section.activeTab) section.activeTab = section.tabs.length - 1;
	}

	export function clickTab(columnIndex: number, sectionIndex: number, tabIndex: number) {
		const section = data.columns[columnIndex].sections[sectionIndex];
		section.activeTab = tabIndex;
		data = data;
	}

	export function drop(dragObj: DragObject, dropObj: DropObject) {
		if (dragObj.componentType == 'tab') {
			if (dropObj.componentType == 'section') {
				const newDropObj: DropObject = { componentType: 'tab', columnIndex: dropObj.columnIndex, sectionIndex: dropObj.sectionIndex, tabIndex: data.columns[dropObj.columnIndex].sections[dropObj.sectionIndex].tabs.length };
				moveTab(dragObj, newDropObj);
			} else if (dropObj.componentType == 'layout-drop') {
				const newSection: LayoutSectionData = { title: '(New)', tabs: [], activeTab: 0, expanded: true };
				const dragSection = data.columns[dragObj.columnIndex].sections[dragObj.sectionIndex];
				const dragTab = dragSection.tabs[dragObj.tabIndex];
				newSection.tabs.push(dragTab);
				dragSection.tabs.splice(dragObj.tabIndex, 1);
				if (dropObj.direction == 'left' || dropObj.direction == 'right') {
					const newColumn: LayoutColumnData = { sections: [] };
					const spliceIndex = dropObj.direction == 'left' ? dropObj.columnIndex : dropObj.columnIndex + 1;
					data.columns.splice(spliceIndex, 0, newColumn);
					data.columns[spliceIndex].sections.push(newSection);
				} else {
					const spliceIndex = dropObj.direction == 'top' ? dropObj.sectionIndex : dropObj.sectionIndex + 1;
					data.columns[dropObj.columnIndex].sections.splice(spliceIndex, 0, newSection);
				}

				// Reset the active tab on the dragSection
				setActiveTabOnDelete(dragSection, dragObj.tabIndex);

				// Clean up the layout (descending order so the collections don't shift as you clean them up)
				for (let c = data.columns.length - 1; c >= 0; c--) {
					const column = data.columns[c];
					for (let s = column.sections.length - 1; s >= 0; s--) {
						if (column.sections[s].tabs.length == 0) {
							column.sections.splice(s, 1);
						}
					}
					if (column.sections.length == 0) {
						data.columns.splice(c, 1);
					}
				}
			} else if (dropObj.componentType == 'tab') {
				moveTab(dragObj, dropObj);
			}
		}

		// Refresh the layout
		data = data;
	}

	function moveTab(dragObj: DragObject, dropObj: DropObject) {
		const dragColumn = data.columns[dragObj.columnIndex];
		const dragSection = dragColumn.sections[dragObj.sectionIndex];
		const dropSection = data.columns[dropObj.columnIndex].sections[dropObj.sectionIndex];
		const dragResult = Draggable.moveItem(dragSection.tabs, dropSection.tabs, dragObj.tabIndex, dropObj.tabIndex);
		dragSection.tabs = dragResult.dragItems;
		dropSection.tabs = dragResult.dropItems;
		dropSection.activeTab = dropObj.tabIndex >= dropSection.tabs.length ? dropSection.tabs.length - 1 : dropObj.tabIndex;
		if (dragSection !== dropSection) onDeleteTab(dragObj.columnIndex, dragObj.sectionIndex, dragObj.tabIndex);
	}
</script>

<div id="layout" style={`grid-template-columns:${getTemplateStyle(data.columns, 'columns')}`}>
	{#each data.columns as column, columnIndex}
		<LayoutColumn templateRows={getTemplateStyle(column.sections, 'sections')} {columnIndex} {layout} columnStart={columnIndex * 2 + 1}>
			{#each column.sections as section, sectionIndex}
				<LayoutSection {...section} {sectionIndex} {columnIndex} {layout} gridRowStart={sectionIndex * 2 + 1} isLastSection={sectionIndex == column.sections.length - 1} />
				{#if sectionIndex < column.sections.length - 1}
					<div class="split-row" style={`grid-row-start:${sectionIndex * 2 + 2}`} />
				{/if}
			{/each}
		</LayoutColumn>
		{#if columnIndex < data.columns.length - 1}
			<div class="split-col" style={`grid-column-start:${columnIndex * 2 + 2}`} />
		{/if}
	{/each}
</div>

<style>
	#layout {
		grid-area: 1 / 2 / 1 / 3;
		justify-self: center;
		color: var(--text-color);
		padding: 0;
		overflow: auto;
		display: grid;
		grid-template-columns: 1fr min-content 1fr;
		grid-template-rows: 1fr;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 6px;
		box-sizing: border-box;
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
