import type Header from '$lib/components/Header.svelte';
import type Layout from '$lib/components/Layout.svelte';

export type MenuItem = {
	caption: string;
	command: () => void;
};

export type LayoutData = {
	columns: LayoutColumnData[];
};

export type LayoutColumnData = {
	sections: LayoutSectionData[];
};

export type LayoutSectionData = {
	title: string;
	tabs: LayoutTabData[];
	activeTab: number;
	expanded: boolean;
};

export type LayoutTabData = {
	title?: string;
	reference: string;
	content: string;
};

export class App {
	public header: Header;
	public layout: Layout;

	constructor(header: Header, layout: Layout) {
		this.header = header;
		this.layout = layout;
		this.header.setApp(this);
		this.layout.setApp(this);
	}

	public showMenu(visible: boolean) {
		this.e$('menu')!.style.display = visible ? 'block' : 'none';
	}

	public menuVisible(): boolean {
		return this.e$('menu')!.style.display == 'block';
	}

	private e$(name: string): HTMLElement | null {
		return document.getElementById(name);
	}

	/*
	public setComponent(type: 'header' | 'body' | 'footer', component: any) {
		switch (type) {
			case 'header':
				this._header = component as Header;
				break;
			case 'body':
		}
	}
	*/
}
