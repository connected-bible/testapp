<script lang="ts">
	import '../app.css';
	import { App } from '$lib/modules/App';
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import Layout from '$lib/components/Layout.svelte';

	let app: App;
	let layout: Layout;
	let header: Header;

	function toggleMenu() {
		const mnu = e$('menu-body');
		const newDisplay = mnu!.style.display == 'block' ? 'none' : 'block';
		mnu!.style.display = newDisplay;
	}

	function e$(name: string) {
		return document.getElementById(name);
	}

	onMount(async () => {
		const setDocumentHeight = () => {
			const doc = document.documentElement;
			doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
		};
		window.addEventListener('resize', setDocumentHeight);
		setDocumentHeight();
		app = new App(header, layout);
	});
</script>

<div id="layout">
	<header>
		<Header bind:this={header} />
	</header>
	<main>
		<div id="menu" style="display:none;">
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
			<div>Menu&nbsp;Body</div>
		</div>
		<Layout bind:this={layout} />
	</main>
	<footer>
		<div id="view-tabs">
			<div>Tab 1</div>
			<div>Tab 2</div>
		</div>
	</footer>
</div>

<style>
	#layout {
		display: grid;
		height: var(--doc-height);
		grid-template-columns: 1fr;
		grid-template-rows: min-content 1fr min-content;
		grid-template-areas: 'header' 'main' 'footer';
		box-sizing: border-box;
		overflow: hidden;
	}

	#layout > header {
		grid-area: header;
		background-color: var(--primary-color);
		color: var(--text-color-light);
		box-sizing: border-box;
		height: var(--header-height);
		overflow: hidden;
	}

	#layout > main {
		grid-area: main;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: min-content 1fr;
		overflow: hidden;
	}

	#layout > footer {
		grid-area: footer;
		background-color: #44546a;
		color: white;
		box-sizing: border-box;
		height: var(--footer-height);
		overflow: hidden;
	}

	@media screen and (max-width: 600px) {
		#layout > footer {
			height: 0;
		}
	}

	@media screen and (max-height: 600px) {
		#layout > footer {
			height: 0;
		}
	}

	#menu {
		grid-area: 1 / 1 / 1 / 2;
		background-color: aqua;
		color: black;
		margin: 0;
		padding: 5px 20px 5px 10px;
		overflow: auto;
	}

	#view-tabs {
		display: flex;
		flex-direction: row;
	}
</style>
