<script lang="ts">
	import { onMount } from "svelte";
	import { Canvas, FabricImage, PencilBrush } from "fabric";

	let { imagedata = $bindable() } : { imagedata : ImageData | null } = $props();

	const WIDTH = 400;
	const HEIGHT = 400;

	// Public accessor, through callback bc underlying methods need one
	export function SetImageData() {
		console.log("saving");
		var image = new Image();
		image.src = fab.toDataURL();
		image.onload = () => {
			// now place in a canvas and convert into image data
			let canv = new OffscreenCanvas(WIDTH, HEIGHT);
			let ctx = canv.getContext("2d");
			ctx?.drawImage(image, 0, 0);
			imagedata = ctx?.getImageData(0, 0, WIDTH, HEIGHT) ?? null;
		};
	}

	var canvas: HTMLCanvasElement;

	// upload image
	var uploadimage: HTMLImageElement | null = $state(null);
	function UpdateImage(evt: any) {
		var reader = new FileReader();
		reader.onload = function (evts) {
			if (!evts.target) return;
			const image = new Image();
			image.src = evts.target.result as string;
			image.onload = () => {
				uploadimage = image;
				fab.backgroundImage = new FabricImage(uploadimage);	
			};
		};
		reader.readAsDataURL(evt.target.files[0]);
	}

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
		if (uploadimage) fab.backgroundImage = new FabricImage(uploadimage, {});	
		if (!fab.freeDrawingBrush) return;
		fab.freeDrawingBrush.color = usercolour;
		fab.freeDrawingBrush.width = userwidth;
	});

	function Reset() {
		fab.clear();
	}
</script>

<div id="bundle">
	<canvas bind:this={canvas} width={WIDTH} height={HEIGHT} onmouseleave={SetImageData}></canvas>
	<div class="vbox optionspanel">
		<div>
			<p>Brush colour</p>
			<input type="color" bind:value={usercolour} />
		</div>
		<div>
			<p>Brush size</p>
			<input type="number" bind:value={userwidth} />
		</div>
		<div>
			<p>Background image</p>
			<input type="file" onchange={UpdateImage} />
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
