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
			<div id="content-cell">
				<div
					class="content"
					style="width:100%;display:flex;flex-direction:row;justify-self:center;max-width:1200px;display:none;"
				>
					<div style="width:50%;background-color:orange;">Hello</div>
					<div style="width:50%;background-color:red;">World!</div>
				</div>
				<div class="content" style="display:block;">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua. Mi proin sed libero enim sed faucibus. Sem et tortor
					consequat id porta. Tellus molestie nunc non blandit massa enim nec dui. Pellentesque sit
					amet porttitor eget dolor morbi. Sit amet mauris commodo quis imperdiet massa tincidunt.
					Eget felis eget nunc lobortis. Fames ac turpis egestas sed tempus urna et pharetra
					pharetra. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. At auctor
					urna nunc id. Amet justo donec enim diam. Diam vulputate ut pharetra sit amet aliquam id
					diam. Lacus vel facilisis volutpat est velit. In cursus turpis massa tincidunt dui ut
					ornare. Iaculis urna id volutpat lacus laoreet non curabitur. Praesent tristique magna sit
					amet purus gravida quis blandit turpis. Et tortor at risus viverra adipiscing at in.
					Cursus sit amet dictum sit amet justo. Ultrices tincidunt arcu non sodales neque sodales
					ut. Accumsan lacus vel facilisis volutpat est velit egestas dui id. A diam maecenas sed
					enim ut. Tellus mauris a diam maecenas sed. Ultrices vitae auctor eu augue ut lectus. Amet
					facilisis magna etiam tempor orci eu lobortis elementum. Id diam vel quam elementum
					pulvinar etiam non quam. Nisi lacus sed viverra tellus in. Phasellus vestibulum lorem sed
					risus ultricies tristique nulla aliquet. Elit at imperdiet dui accumsan. Enim sit amet
					venenatis urna cursus eget nunc scelerisque. Erat velit scelerisque in dictum non
					consectetur a erat. Lectus magna fringilla urna porttitor rhoncus dolor. Condimentum vitae
					sapien pellentesque habitant morbi tristique senectus. Semper viverra nam libero justo
					laoreet sit. Elementum tempus egestas sed sed risus pretium quam. Eu lobortis elementum
					nibh tellus molestie. Vehicula ipsum a arcu cursus vitae congue. Maecenas volutpat blandit
					aliquam etiam. At erat pellentesque adipiscing commodo elit. Proin nibh nisl condimentum
					id venenatis a condimentum. Odio eu feugiat pretium nibh ipsum consequat nisl. Sed id
					semper risus in hendrerit gravida rutrum. Malesuada proin libero nunc consequat interdum
					varius sit amet mattis. Orci a scelerisque purus semper eget duis. Dictumst quisque
					sagittis purus sit amet volutpat consequat mauris nunc. Gravida cum sociis natoque
					penatibus et magnis dis parturient montes. Sit amet aliquam id diam. Tempus imperdiet
					nulla malesuada pellentesque elit. Malesuada nunc vel risus commodo viverra. Aliquet
					porttitor lacus luctus accumsan tortor posuere ac ut. Est lorem ipsum dolor sit amet
					consectetur adipiscing elit pellentesque. Faucibus pulvinar elementum integer enim neque
					volutpat ac tincidunt vitae. Est velit egestas dui id ornare arcu odio ut sem. Sed sed
					risus pretium quam vulputate. Blandit libero volutpat sed cras. Dui faucibus in ornare
					quam viverra orci. In vitae turpis massa sed elementum tempus egestas sed. Id volutpat
					lacus laoreet non curabitur gravida arcu ac. Lacus vestibulum sed arcu non odio. Purus
					semper eget duis at tellus at. Venenatis urna cursus eget nunc. Vitae proin sagittis nisl
					rhoncus mattis. Vulputate sapien nec sagittis aliquam malesuada. Ultricies leo integer
					malesuada nunc vel risus commodo viverra maecenas. Quis hendrerit dolor magna eget est.
					Cras adipiscing enim eu turpis egestas pretium aenean. Amet consectetur adipiscing elit ut
					aliquam purus sit amet. At urna condimentum mattis pellentesque id. Et tortor consequat id
					porta nibh. Egestas pretium aenean pharetra magna ac. Est sit amet facilisis magna etiam
					tempor. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida.
					Facilisis sed odio morbi quis commodo odio. Aliquam eleifend mi in nulla. Placerat duis
					ultricies lacus sed turpis tincidunt. Vel turpis nunc eget lorem dolor sed. Sollicitudin
					nibh sit amet commodo. At tempor commodo ullamcorper a lacus. Blandit turpis cursus in hac
					habitasse platea. Dis parturient montes nascetur ridiculus mus mauris. Fringilla ut morbi
					tincidunt augue interdum velit. Suspendisse ultrices gravida dictum fusce ut placerat
					orci. Fusce id velit ut tortor pretium viverra suspendisse potenti. Sit amet nisl suscipit
					adipiscing bibendum est ultricies integer quis. Aenean euismod elementum nisi quis
					eleifend quam adipiscing vitae proin. Ipsum nunc aliquet bibendum enim facilisis gravida
					neque convallis. Erat nam at lectus urna duis convallis convallis tellus id. Morbi leo
					urna molestie at elementum. Arcu felis bibendum ut tristique et egestas quis. Dui ut
					ornare lectus sit amet est placerat in. Et netus et malesuada fames ac turpis egestas sed.
					Phasellus faucibus scelerisque eleifend donec pretium. Pharetra magna ac placerat
					vestibulum lectus mauris ultrices eros. Ultricies leo integer malesuada nunc vel risus
					commodo viverra maecenas. Et magnis dis parturient montes nascetur ridiculus mus. Ultrices
					mi tempus imperdiet nulla malesuada. Tortor pretium viverra suspendisse potenti nullam ac.
					Diam quis enim lobortis scelerisque fermentum. Lacus laoreet non curabitur gravida arcu ac
					tortor. Vulputate eu scelerisque felis imperdiet proin fermentum leo. Eleifend quam
					adipiscing vitae proin. Augue eget arcu dictum varius duis. A pellentesque sit amet
					porttitor eget dolor. Eget nunc scelerisque viverra mauris. Arcu non sodales neque sodales
					ut etiam. A pellentesque sit amet porttitor eget dolor morbi non arcu. Eget est lorem
					ipsum dolor sit. Egestas pretium aenean pharetra magna ac placerat vestibulum. Morbi leo
					urna molestie at elementum eu facilisis sed odio. Diam volutpat commodo sed egestas
					egestas fringilla phasellus. Sit amet cursus sit amet dictum. Nam libero justo laoreet
					sit. Porttitor massa id neque aliquam vestibulum morbi blandit. In metus vulputate eu
					scelerisque felis imperdiet proin. Integer enim neque volutpat ac tincidunt vitae semper.
					In hac habitasse platea dictumst vestibulum rhoncus est. Tempus iaculis urna id volutpat
					lacus laoreet non. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur
					vitae nunc. Sagittis eu volutpat odio facilisis mauris sit. In tellus integer feugiat
					scelerisque varius morbi enim nunc faucibus.
				</div>
				<div id="content-footer">&copy; Connected Bible 2022</div>
			</div>
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
		grid-area: 2 / 1 / 2 / 2;
		background-color: aqua;
		color: black;
		padding: 5px 30px 5px 4px;
		overflow: auto;
	}

	#content-grid {
		grid-area: 2 / 2 / 2 / 3;
		display: grid;
		grid-template-columns: auto 1fr auto;
		margin: 0;
		overflow: auto;
	}

	#content-cell {
		grid-area: 1 / 2 / 1 / 3;
		justify-self: center;
		color: var(--text-color);
		margin: 4px 10px;
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
