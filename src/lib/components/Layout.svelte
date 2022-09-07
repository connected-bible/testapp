<script lang="ts">
	import type { App } from '$lib/modules/App';
	import LayoutColumn from './LayoutColumn.svelte';
	import LayoutSection from './LayoutSection.svelte';
	import LayoutSplit from './LayoutSplit.svelte';
	import type { LayoutData, LayoutColumnData, LayoutSectionData, LayoutTabData } from '$lib/modules/App';
	import { Draggable } from '$lib/modules/Draggable';
	import type Layout from './Layout.svelte';
	import type { DragObject, DropObject } from '$lib/modules/Draggable';

	let app: App;
	let layout: Layout;
	let layoutDiv: HTMLDivElement;
	let dragHorizontalDiv: HTMLDivElement;
	let dragVerticalDiv: HTMLDivElement;
	let overlayDiv: HTMLDivElement;
	let lastDragOver: DropObject;

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

	function getNewSection(firstTab?: LayoutTabData): LayoutSectionData {
		return { title: '(Untitled)', tabs: [firstTab ?? getNewTab()], activeTab: 0, expanded: true };
	}

	function getNewTab(): LayoutTabData {
		return { title: '(New)', reference: 'Gen-50', content: 'Open a new document or Bible passage while this window is active.' };
	}

	export function addTab(columnIndex: number, sectionIndex: number) {
		const section = data.columns[columnIndex].sections[sectionIndex];
		section.tabs.push(getNewTab());
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

	export function changeSectionTitle(columnIndex: number, sectionIndex: number, title: string) {
		const column = data.columns[columnIndex];
		if (!column) return;
		const section = column.sections[sectionIndex];
		if (!section) return;
		section.title = title;
		data = data;
	}

	export function changeTabTitle(columnIndex: number, sectionIndex: number, tabIndex: number, title: string) {
		const column = data.columns[columnIndex];
		if (!column) return;
		const section = column.sections[sectionIndex];
		if (!section) return;
		const tab = section.tabs[tabIndex];
		if (!tab) return;
		tab.title = title;
		data = data;
	}

	export function drop(dragObj: DragObject | null, dropObj: DropObject | null) {
		// Bail out if we don't have references to drag / drop objects
		if (!dragObj || !dropObj) return;

		// Tab drag
		if (dragObj.componentType == 'tab') {
			if (dropObj.componentType == 'section' && dropObj.direction == 'none') {
				const newDropObj: DropObject = {
					componentType: 'tab',
					columnIndex: dropObj.columnIndex,
					sectionIndex: dropObj.sectionIndex,
					tabIndex: data.columns[dropObj.columnIndex].sections[dropObj.sectionIndex].tabs.length,
					element: dropObj.element
				};
				moveTab(dragObj, newDropObj);
			} else if (dropObj.componentType == 'section') {
				const dragSection = data.columns[dragObj.columnIndex].sections[dragObj.sectionIndex];
				const dragTab = dragSection.tabs[dragObj.tabIndex];
				const newSection = getNewSection(dragTab);
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

		// Section drag
		else if (dragObj.componentType == 'section') {
			const dragColumn = data.columns[dragObj.columnIndex];
			const dragSection = dragColumn.sections[dragObj.sectionIndex];
			const direction = dropObj.direction;
			if (direction == 'none') return;
			const layoutDropSection = direction == 'top' || direction == 'bottom';
			const layoutDropColumn = direction == 'left' || direction == 'right';

			// Insert the section to drop column
			if (layoutDropSection) {
				// If drag column is same as drop column, just reorder the section
				if (dragObj.columnIndex == dropObj.columnIndex) {
					dragColumn.sections = Draggable.changeIndex(dragColumn.sections, dragObj.sectionIndex, dropObj.sectionIndex);
				}

				// Otherwise splice it into the drop column, remove if from the drag column
				else {
					const spliceIndex = direction == 'top' ? dropObj.sectionIndex : dropObj.sectionIndex + 1;
					data.columns[dropObj.columnIndex].sections.splice(spliceIndex, 0, dragSection);
					dragColumn.sections.splice(dragObj.sectionIndex, 1);
				}

				// Create a new column, insert the drag section, remove the drag section from old column
			} else if (layoutDropColumn) {
				const newColumn: LayoutColumnData = { sections: [dragSection] };
				const spliceIndex = direction == 'left' ? dropObj.columnIndex : dropObj.columnIndex + 1;
				data.columns.splice(spliceIndex, 0, newColumn);
				dragColumn.sections.splice(dragObj.sectionIndex, 1);
			}

			// Clean up empty columns
			removeEmptyColumns();
		}

		// Reset drag objects
		endDrag();

		// Refresh the layout
		data = data;
	}

	function removeEmptyColumns() {
		for (let c = data.columns.length - 1; c >= 0; c--) {
			if (data.columns[c].sections.length == 0) {
				data.columns.splice(c, 1);
			}
		}
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

	export function dragOverSection(dragOverObj: DropObject) {
		const direction = dragOverObj.direction;
		const sectionDiv = dragOverObj.element;
		if (direction == 'left' || direction == 'right') {
			dragVerticalDiv.style.top = `${layoutDiv.offsetTop}px`;
			dragVerticalDiv.style.left = `${direction == 'left' ? sectionDiv.offsetLeft - 6 : sectionDiv.offsetLeft + sectionDiv.offsetWidth}px`;
			dragVerticalDiv.style.height = `${layoutDiv.offsetHeight}px`;
		} else if (direction == 'top' || direction == 'bottom') {
			dragHorizontalDiv.style.top = `${direction == 'top' ? sectionDiv.offsetTop - 6 : sectionDiv.offsetTop + sectionDiv.offsetHeight}px`;
			dragHorizontalDiv.style.left = `${sectionDiv.offsetLeft - 4}px`;
			dragHorizontalDiv.style.width = `${sectionDiv.offsetWidth + 8}px`;
		} else if (direction == 'none') {
			overlayDiv.style.top = `${sectionDiv.offsetTop}px`;
			overlayDiv.style.left = `${sectionDiv.offsetLeft}px`;
			overlayDiv.style.width = `${sectionDiv.offsetWidth}px`;
			overlayDiv.style.height = `${sectionDiv.offsetHeight}px`;
		}
		dragHorizontalDiv.style.display = direction == 'top' || direction == 'bottom' ? 'grid' : 'none';
		dragVerticalDiv.style.display = direction == 'left' || direction == 'right' ? 'grid' : 'none';
		overlayDiv.style.display = direction == 'none' ? 'block' : 'none';
		lastDragOver = dragOverObj;
	}

	export function endDrag() {
		hideDragMarkers();
		overlayDiv.style.display = 'none';
		Draggable.hovering = null;
		Draggable.dragSource = null;
	}

	export function hideDragMarkers() {
		dragHorizontalDiv.style.display = 'none';
		dragVerticalDiv.style.display = 'none';
	}

	export function newSection(columnIndex: number, sectionIndex: number) {
		data.columns[columnIndex].sections.splice(sectionIndex + 1, 0, getNewSection());
		data = data;
	}

	export function deleteSection(columnIndex: number, sectionIndex: number) {
		const section = data.columns[columnIndex]?.sections[sectionIndex];
		if (!section) return;
		data.columns[columnIndex].sections.splice(sectionIndex, 1);
		removeEmptyColumns();
		data = data;
	}

	export function duplicateSection(columnIndex: number, sectionIndex: number) {
		const s = data.columns[columnIndex]?.sections[sectionIndex];
		if (!s) return;
		const newSection: LayoutSectionData = { title: s.title, activeTab: s.activeTab, expanded: s.expanded, tabs: [] };
		for (let i = 0; i < s.tabs.length; i++) {
			newSection.tabs.push({ title: s.tabs[i].title, reference: s.tabs[i].reference, content: s.tabs[i].content });
		}
		data.columns[columnIndex].sections.splice(sectionIndex + 1, 0, newSection);
		data = data;
	}

	function dropOnMarker() {
		drop(Draggable.dragSource, lastDragOver);
	}

	export function split(orientation: 'row' | 'column', row: number, column: number, position: number) {
		if (orientation == 'column') {
			const leftColumn: HTMLDivElement = layoutDiv.children[column] as HTMLDivElement;
			const rightColumn: HTMLDivElement = layoutDiv.children[column + 1] as HTMLDivElement;
			if (!leftColumn || !rightColumn) return;
			const width = leftColumn.offsetLeft + leftColumn.offsetWidth + 6 + rightColumn.offsetWidth;
			const relativePosition = (position - leftColumn.offsetLeft) / width;
			console.log(`Width: ${width}, Left: ${leftColumn.offsetLeft}, Position: ${position}, Relative Position: ${relativePosition}`);
		}
		// console.log(`Orientation: ${orientation}, Position: ${position}`);
	}
</script>

<div id="layout" bind:this={layoutDiv} style={`grid-template-columns:${getTemplateStyle(data.columns, 'columns')}`}>
	{#each data.columns as column, columnIndex}
		<LayoutColumn templateRows={getTemplateStyle(column.sections, 'sections')} columnStart={columnIndex * 2 + 1}>
			{#each column.sections as section, sectionIndex}
				<LayoutSection {...section} {sectionIndex} {columnIndex} {layout} gridRowStart={sectionIndex * 2 + 1} />
				{#if sectionIndex < column.sections.length - 1}
					<LayoutSplit orientation="row" column={columnIndex} row={sectionIndex} {layout} />
				{/if}
			{/each}
		</LayoutColumn>
		{#if columnIndex < data.columns.length - 1}
			<LayoutSplit orientation="column" column={columnIndex} {layout} />
		{/if}
	{/each}
	<div class="drag-marker drag-horizontal" bind:this={dragHorizontalDiv} style="display: none" on:drop|preventDefault={dropOnMarker} on:dragover|preventDefault on:dragenter|preventDefault on:dragleave|preventDefault>
		<div class="drag-marker-left">&nbsp;</div>
		<div class="drag-marker-right">&nbsp;</div>
	</div>
	<div class="drag-marker drag-vertical" bind:this={dragVerticalDiv} style="display: none" on:drop|preventDefault={dropOnMarker} on:dragover|preventDefault on:dragenter|preventDefault on:dragleave|preventDefault>
		<div class="drag-marker-top">&nbsp;</div>
		<div class="drag-marker-bottom">&nbsp;</div>
	</div>
	<div bind:this={overlayDiv} class="overlay" />
</div>

<style>
	.overlay {
		position: absolute;
		display: none;
		opacity: 25%;
		background-color: black;
		z-index: 2;
		pointer-events: none;
	}

	.drag-marker {
		position: absolute;
		background-color: #007fd4;
		display: grid;
	}

	.drag-horizontal {
		height: 6px;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
	}

	.drag-vertical {
		width: 6px;
		grid-template-rows: 1fr 1fr;
		grid-template-columns: 1fr;
	}

	.drag-marker-left {
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-left: 10px solid red;
		grid-column-start: 1;
		margin-top: -7px;
	}

	.drag-marker-right {
		width: 0;
		height: 0;
		border-top: 10px solid transparent;
		border-bottom: 10px solid transparent;
		border-right: 10px solid red;
		grid-column-start: 3;
		margin-top: -7px;
	}

	.drag-marker-top {
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-top: 10px solid red;
		grid-row-start: 1;
		margin-left: -7px;
	}

	.drag-marker-bottom {
		width: 0;
		height: 0;
		border-left: 10px solid transparent;
		border-right: 10px solid transparent;
		border-bottom: 10px solid red;
		grid-row-start: 3;
		margin-left: -7px;
		justify-self: end;
	}

	#layout {
		grid-area: 1 / 2 / 1 / 3;
		justify-self: center;
		color: var(--text-color);
		padding: 0;
		overflow: auto;
		display: grid;
		/* grid-template-columns: 1fr min-content 1fr; */
		grid-template-rows: 1fr;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 6px;
		box-sizing: border-box;
	}
</style>
