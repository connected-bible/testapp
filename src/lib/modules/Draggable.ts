export class Draggable {
	static hovering: number | boolean | null = false;

	static drop(event: DragEvent, items: any[], target: number): any[] {
		if (!event || !event.dataTransfer) return [];
		event.dataTransfer.dropEffect = 'move';
		const start = parseInt(event.dataTransfer.getData('text/plain'));
		const newItems = Draggable.moveItem(items, start, target);
		Draggable.hovering = null;
		return newItems;
	}

	static dragstart(event: DragEvent, i: number) {
		if (!event || !event.dataTransfer) return;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		const start = i;
		event.dataTransfer.setData('text/plain', start.toString());
	}

	static moveItem(items: any[], start: number, target: number): any[] {
		const newItems = items;
		if (start < target) {
			newItems.splice(target + 1, 0, newItems[start]);
			newItems.splice(start, 1);
		} else {
			newItems.splice(target, 0, newItems[start]);
			newItems.splice(start + 1, 1);
		}
		return newItems;
	}
}
