<script lang=ts>
    import { onMount } from "svelte";
	import { Canvas, CircleBrush, PencilBrush } from "fabric";

	var canvas : HTMLCanvasElement;

	onMount(() => {
		var fab = new Canvas(canvas);
		fab.isDrawingMode = true;
		fab.freeDrawingBrush = new PencilBrush(fab);
		fab.freeDrawingBrush.width = 1;
		fab.freeDrawingBrush.color = "#ff0000";
	});
</script>

<canvas bind:this={canvas} width=400 height=400></canvas>

<style>
	canvas {
		border : 1px solid black;
	}
</style>