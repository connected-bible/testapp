<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';

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
	});
</script>

<div id="layout">
	<header>
		<Header />
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
		<div id="content-grid">
			<div
				class="content"
				style="width:100%;display:flex;flex-direction:row;justify-self:center;max-width:1200px;display:none;"
			>
				<div style="width:50%;background-color:orange;">Hello</div>
				<div style="width:50%;background-color:red;">World!</div>
			</div>
			<div class="content" style="display:block;">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
				labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus. Sem et tortor
				consequat id porta. Tellus molestie nunc non blandit massa enim nec dui. Pellentesque sit
				amet porttitor eget dolor morbi. Sit amet mauris commodo quis imperdiet massa tincidunt.
				Eget felis eget nunc lobortis. Fames ac turpis egestas sed tempus urna et pharetra pharetra.
				Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. At auctor urna nunc id.
				Amet justo donec enim diam. Diam vulputate ut pharetra sit amet aliquam id diam. Lacus vel
				facilisis volutpat est velit. In cursus turpis massa tincidunt dui ut ornare. Iaculis urna
				id volutpat lacus laoreet non curabitur. Praesent tristique magna sit amet purus gravida
				quis blandit turpis. Et tortor at risus viverra adipiscing at in. Cursus sit amet dictum sit
				amet justo. Ultrices tincidunt arcu non sodales neque sodales ut. Accumsan lacus vel
				facilisis volutpat est velit egestas dui id. A diam maecenas sed enim ut. Tellus mauris a
				diam maecenas sed. Ultrices vitae auctor eu augue ut lectus. Amet facilisis magna etiam
				tempor orci eu lobortis elementum. Id diam vel quam elementum pulvinar etiam non quam. Nisi
				lacus sed viverra tellus in. Phasellus vestibulum lorem sed risus ultricies tristique nulla
				aliquet. Elit at imperdiet dui accumsan.
			</div>
			<div id="content-footer">&copy; Connected Bible 2022</div>
		</div>
	</main>
	<footer>
		<div id="view-tabs">
			<div>Tab 1</div>
			<div>Tab 2</div>
		</div>
	</footer>
</div>

<style>
	/* Grid-based layout */
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

	#menu {
		grid-area: 1 / 1 / 1 / 2;
		background-color: aqua;
		color: black;
		margin: 0;
		padding: 5px 30px 5px 10px;
		overflow: auto;
	}

	/*
	#content-grid {
		grid-area: 1 / 2 / 1 / 3;
		display: grid;
		grid-template-columns: auto 1fr auto;
		margin: 0;
		overflow: auto;
	}
    */

	#content-grid {
		grid-area: 1 / 2 / 1 / 3;
		justify-content: center;
		justify-self: center;
		color: var(--text-color);
		margin: 0;
		overflow: auto;
		padding: 5px 10px;
	}

	.content {
		max-width: 900px;
	}

	#content-footer {
		margin: 10px;
		text-align: center;
	}

	#view-tabs {
		display: flex;
		flex-direction: row;
	}
</style>
