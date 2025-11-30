<script lang="ts">
  import {RenderGraph} from "$lib/RenderGraph.svelte";
  import { onMount } from "svelte";
	import { Canvas, PencilBrush } from "fabric";

	var canvas : HTMLCanvasElement;
	var usercolour : string = $state("#000000");
	var userwidth : number = $state(4);
	
	var fab : Canvas;

	onMount(() => {
		fab = new Canvas(canvas);
		fab.isDrawingMode = true;
		fab.freeDrawingBrush = new PencilBrush(fab);
		fab.freeDrawingBrush.width = userwidth;
		fab.freeDrawingBrush.color = usercolour;
	});

	$effect(() => {
		if ( !fab.freeDrawingBrush) return;
		fab.freeDrawingBrush.color = usercolour;
		fab.freeDrawingBrush.width = userwidth;
	});

	function Reset() {
		fab.clear();
	}

	let Render = () => {RenderGraph(fab)};

</script>
<a href="..">Return to index</a>

<h1>Node Render Test</h1>

<div id=bundle>
	<canvas bind:this={canvas} width=400 height=400></canvas>
	<div class="vbox optionspanel">
		<div>
			<p>Brush colour</p>
			<input type="color" bind:value={usercolour}/>
		</div>
		<div>
			<p>Brush size</p>
			<input type="number" bind:value={userwidth}/>
		</div>
		<div class=void></div>
		<button onclick={Reset}>Reset</button>
		<button onclick={Render}>Render Nodes and Edges</button>
	</div>
</div>


<style>
	canvas {
		border-right: 1px solid black;
	}

	#bundle {
		display:  flex;
		flex-direction: row;
		border : 1px solid black;
	}

	.vbox {
		display: flex;
		flex-direction: column;

		.void {
			height: 100%;
		}
	}
	.optionspanel>* {
		padding: 8px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>