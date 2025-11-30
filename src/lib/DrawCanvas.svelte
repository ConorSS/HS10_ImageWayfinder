<script lang="ts">
	import { onMount } from "svelte";
	import { Canvas, PencilBrush } from "fabric";

	let { imagedata = $bindable() } : { imagedata : ImageData | null } = $props();

	// Public accessor, through callback bc underlying methods need one
	function SetImageData() {
		console.log("saving");
		var image = new Image();
		var height = canvas.height;
		var width = canvas.width;
		image.src = fab.toDataURL();
		image.onload = () => {
			// now place in a canvas and convert into image data
			let canv = new OffscreenCanvas(height, width);
			let ctx = canv.getContext("2d");
			ctx?.drawImage(image, 0, 0);
			imagedata = ctx?.getImageData(0, 0, height, width) ?? null;
		};
	}

	var canvas: HTMLCanvasElement;
	var usercolour: string = $state("#000000");
	var userwidth: number = $state(1);

	var fab: Canvas;

	onMount(() => {
		fab = new Canvas(canvas);
		fab.isDrawingMode = true;
		fab.freeDrawingBrush = new PencilBrush(fab);
		fab.freeDrawingBrush.width = userwidth;
		fab.freeDrawingBrush.color = usercolour;
	});

	$effect(() => {
		if (!fab.freeDrawingBrush) return;
		fab.freeDrawingBrush.color = usercolour;
		fab.freeDrawingBrush.width = userwidth;
	});

	function Reset() {
		fab.clear();
	}
</script>

<div id="bundle">
	<canvas bind:this={canvas} width="400" height="400" onmouseleave={SetImageData}></canvas>
	<div class="vbox optionspanel">
		<div>
			<p>Brush colour</p>
			<input type="color" bind:value={usercolour} />
		</div>
		<div>
			<p>Brush size</p>
			<input type="number" bind:value={userwidth} />
		</div>
		<div class="void"></div>
		<button onclick={Reset}>Reset</button>
	</div>
</div>

<style>
	canvas {
		border-right: 1px solid black;
	}

	#bundle {
		display: flex;
		flex-direction: row;
		border: 1px solid black;
	}

	.vbox {
		display: flex;
		flex-direction: column;

		.void {
			height: 100%;
		}
	}
	.optionspanel > * {
		padding: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
