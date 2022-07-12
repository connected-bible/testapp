<script lang="ts">
	import '../../app.css';
	import { globalApp } from '../modules/App';
	import type { App } from '../modules/App';
	let app: App = $globalApp as App;
</script>

<!-- #region HTML -->
<header>
	<nav>
		<!-- #region HTML -->
		<div id="header-left">
			<div id="main-menu-button" on:click={() => app.showMenu(!app.menuVisible())}>
				<div class="menu-line" />
				<div class="menu-line" />
				<div class="menu-line" />
			</div>
		</div>
		<div id="header-middle">Location</div>
		<div id="header-right">Search</div>
	</nav>
</header>

<style>
	header {
		grid-area: header;
		position: sticky;
		background-color: var(--primary-color);
		color: var(--text-color-light);
		height: var(--header-height);
	}

	nav {
		display: grid;
		grid-template-columns: min-content 1fr min-content;
		padding-right: 10px;
	}

	#header-left {
		grid-column-start: 1;
	}

	#main-menu-button {
		width: 1.6em;
		height: 1.6em;
		padding: 0.3em 1em 0.3em 0.5em;
		cursor: pointer;
	}

	.menu-line {
		height: 3px;
		width: 100%;
		background-color: white;
		margin: 4px 4px;
		border-radius: 3px;
	}

	#header-middle {
		grid-column-start: 2;
		justify-self: center;
		padding: 0.3em 1em 0.3em 1em;
	}

	#header-right {
		grid-column-start: 3;
		padding: 0.3em 1em 0.3em 1em;
		justify-self: right;
	}
</style>
