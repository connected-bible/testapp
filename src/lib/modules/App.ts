import { writable } from 'svelte/store';
import type Header from '../components/Header.svelte';

export type Layout = {
	columns: LayoutColumn[];
};

export type LayoutColumn = {
	sections: LayoutSection[];
};

export type LayoutSection = {
	title: string;
	tabs: LayoutTab[];
	tabIndex: number;
	expanded: boolean;
};

export type LayoutTab = {
	title?: string;
	reference: string;
	content: string;
};

export class App {
	private _header: Header | null = null;

	constructor() {}

	public showMenu(visible: boolean) {
		this.e$('menu')!.style.display = visible ? 'block' : 'none';
	}

	public menuVisible(): boolean {
		return this.e$('menu')!.style.display == 'block';
	}

	private e$(name: string): HTMLElement | null {
		return document.getElementById(name);
	}

	public setComponent(type: 'header' | 'body' | 'footer', component: any) {
		switch (type) {
			case 'header':
				this._header = component as Header;
				break;
			case 'body':
		}
	}
}

export const globalApp = writable(new App());
