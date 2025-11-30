<script lang="ts">
	import { draw } from "svelte/transition";
	import Binarizer from "./Binarizer.svelte";
	import DrawCanvas from "./DrawCanvas.svelte";

	var stage = $state(0);

	let drawing = $state(null);
	let binmask = $state(null);

	// tried doing min/max on increment/decrement functions. didn't work. table time
	var canGoBack = $state(false);
	var canGoForward = $state(true);
	$effect(() => {
		switch (stage) {
			case 0:
				canGoBack = false;
				canGoForward = true;
				break;
			case 1:
				canGoBack = true;
				canGoForward = true;
				// dump drawing into binarizer
				binarizer.SetImageData(drawing);
				break;
			default:
				canGoBack = false;
				canGoForward = false;
				break;
		}
	});

	function ResetStage() {
		stage = 0;
	}
	function IncrementStage() {
		stage++;
	}
	function DecrementStage() {
		stage--;
	}
	function StageToName(stage) {
		switch (stage) {
			case 0:
				return "Drawing";
			case 1:
				return "Filtering";
			default:
				return "Undefined";
		}
	}

	var drawcanvas: DrawCanvas | null = $state(null);
	var binarizer: Binarizer | null = $state(null);
</script>

<div id="multipanel" class="vbox">
	<div class="hbox toolbar">
		<button onclick={DecrementStage} disabled={!canGoBack}>←</button>
		<div class="vbox">
			<span>{StageToName(stage)}</span>
			<span>{stage + 1}/3</span>
		</div>
		<button onclick={IncrementStage} disabled={!canGoForward}>→</button>
	</div>

	{#if stage == 0}
		<DrawCanvas bind:this={drawcanvas} bind:imagedata={drawing} />
	{:else if stage == 1}
		<Binarizer bind:this={binarizer} />
	{:else}
		<button onclick={ResetStage}>Return to drawcanvas</button>
	{/if}
</div>

<style>
	#multipanel {
		.toolbar {
			width: 100%;
		}
	}

	.vbox {
		display: flex;
		flex-direction: column;
	}
	.hbox {
		display: flex;
		flex-direction: row;
	}
</style>
