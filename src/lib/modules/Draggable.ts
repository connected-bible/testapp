export interface DragObject {
	componentType: 'section' | 'tab';
	targetTypes: string[];
	[key: string]: any;
}

export interface DropObject {
	componentType: 'section' | 'tab' | 'layout-drop';
	[key: string]: any;
}

export class Draggable {
	static hovering: any = false;

	static getDragSource(event: DragEvent): DragObject | null {
		if (!event || !event.dataTransfer) return null;
		event.dataTransfer.dropEffect = 'none';
		Draggable.hovering = null;
		return JSON.parse(event.dataTransfer.getData('text/plain')) as DragObject;
	}

	static dragStart(event: DragEvent, dragObj: DragObject, dragImage?: HTMLElement) {
		if (!event || !event.dataTransfer) return;
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.dropEffect = 'move';
		event.dataTransfer.setData('text/plain', JSON.stringify(dragObj));
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
