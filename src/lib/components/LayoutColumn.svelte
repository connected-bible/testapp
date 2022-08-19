<script lang="ts">
	export let templateRows: string;
	export let columnStart: number;
</script>

<div class="column" style={`grid-column-start:${columnStart};grid-template-rows:${templateRows};`}>
	<slot />
</div>

<style>
	.column {
		display: grid;
		overflow: auto;
		grid-column-start: 2;
	}
</style>
