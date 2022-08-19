export interface DragObject {
	componentType: string;
	targetTypes: string[];
	[key: string]: any;
}

export interface DropObject {
	componentType: string;
	[key: string]: any;
}

export class Draggable {
	static dragSource: DragObject | null = null;
	static hovering: DropObject | null = null;

	static dragStart(event: DragEvent, dragObj: DragObject, dragImage?: HTMLElement) {
		if (!event || !event.dataTransfer) return;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		Draggable.dragSource = dragObj;
		if (dragImage) event.dataTransfer.setDragImage(dragImage, 0, 0);
	}

	static moveItem(dragItems: any[], dropItems: any[], drag: number, drop: number): { dragItems: any[]; dropItems: any[] } {
		// Move within a set
		if (dragItems === dropItems) {
			const newItems = Draggable.changeIndex(dropItems, drag, drop);
			return { dragItems: newItems, dropItems: newItems };
		}

		// Move to a new set
		const dragObj = dragItems[drag];
		const newDragItems = [...dragItems];
		const newDropItems = [...dropItems];
		newDragItems.splice(drag, 1);
		if (drop >= newDropItems.length) {
			newDropItems.push(dragObj);
		} else {
			newDropItems.splice(drop, 0, dragObj);
		}
		return { dragItems: newDragItems, dropItems: newDropItems };
	}

	static changeIndex(items: any[], drag: number, drop: number): any[] {
		const newItems = [...items];

		if (drag < drop) {
			newItems.splice(drop + 1, 0, newItems[drag]);
			newItems.splice(drag, 1);
		} else {
			newItems.splice(drop, 0, newItems[drag]);
			newItems.splice(drag + 1, 1);
		}
		return newItems;
	}
}
