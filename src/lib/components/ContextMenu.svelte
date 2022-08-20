<script lang="ts">
	import type { MenuItem } from '$lib/modules/App';
	export let iconType: 'dots-vertical' | 'dots-horizontal' = 'dots-vertical';
	export let iconStyle: string = '';
	export let iconHoverColor: string = 'silver';
	export let dotsHoverColor: string = '#404040';
	export let dotColor: string = 'white';
	export let dotSize: number = 3;
	export let dotMargin: number = 1;
	export let justifyMenu: 'left' | 'right' = 'right';
	export let offsetTop: number = 0;
	export let offsetRight: number = 0;
	export let offsetLeft: number = 0;
	export let menuItems: MenuItem[];

	let dotsDiv: HTMLDivElement;
	let menuDiv: HTMLDivElement;
	let visible = false;

	function getDotStyle(): string {
		return `background-color:${dotColor}; width:${dotSize}px; height:${dotSize}px; margin:${dotMargin}px;`;
	}

	function hover(on: boolean) {
		dotsDiv.style.backgroundColor = on ? iconHoverColor : '';
		const children = dotsDiv.children;
		for (let i = 0; i < children.length; i++) {
			(children[i] as HTMLDivElement).style.backgroundColor = on ? dotsHoverColor : dotColor;
		}
	}

	function showMenu(show: boolean) {
		hover(show);
		menuDiv.style.top = `${dotsDiv.offsetTop + dotsDiv.offsetHeight + offsetTop}px`;
		menuDiv.style.display = show ? 'block' : 'none';
		if (justifyMenu == 'right') menuDiv.style.left = `${dotsDiv.offsetLeft + dotsDiv.offsetWidth - menuDiv.offsetWidth + offsetRight}px`;
		else if (justifyMenu == 'left') menuDiv.style.left = `${dotsDiv.offsetLeft + offsetLeft}px`;
		const menuListener = (e: MouseEvent) => {
			const target: any = e.target;
			const isCommand = target && target.classList && target.classList.contains('command');
			console.log(`Command: ${isCommand}`);
			if (!isCommand) showMenu(false);
		};
		if (show) {
			window.addEventListener('mousedown', menuListener);
		} else {
			window.removeEventListener('mousedown', menuListener);
		}
		visible = show;
	}
</script>

<div>
	<div
		bind:this={dotsDiv}
		class="dots"
		class:dots-vertical={iconType == 'dots-vertical'}
		class:dots-horizontal={iconType == 'dots-horizontal'}
		style={iconStyle}
		on:click={() => showMenu(!visible)}
		on:mouseover={() => hover(true)}
		on:mouseout={() => hover(false)}
		on:focus={() => hover(true)}
		on:blur={() => hover(false)}
	>
		{#if iconType == 'dots-vertical' || iconType == 'dots-horizontal'}
			<div class="menu-dot" style={getDotStyle()} />
			<div class="menu-dot" style={getDotStyle()} />
			<div class="menu-dot" style={getDotStyle()} />
		{/if}
	</div>
	<div bind:this={menuDiv} class="menu" style="display:none;">
		{#each menuItems as menuItem}
			<div
				class="command"
				on:click={() => {
					showMenu(false);
					menuItem.command();
				}}
			>
				{menuItem.caption}
			</div>
		{/each}
	</div>
</div>

<style>
	.menu {
		position: absolute;
		background-color: white;
		border: 1px solid gray;
		display: grid;
		cursor: pointer;
		color: var(--text-color);
		border-radius: 6px;
		box-shadow: 3px 3px 8px #404040;
	}

	.command {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		padding: 4px 8px;
		font-size: 0.8em;
		font-weight: normal;
	}

	.dots {
		border-radius: 50%;
		cursor: pointer;
	}

	.dots-vertical {
		display: grid;
		grid-template-rows: 1fr 1fr 1fr;
		place-items: center;
	}

	.dots-horizontal {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		place-items: center;
	}

	.menu-dot {
		border-radius: 50%;
		pointer-events: none;
	}
</style>
