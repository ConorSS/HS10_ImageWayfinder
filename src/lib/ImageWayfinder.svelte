<script lang="ts">
	import { draw } from "svelte/transition";
	import Binarizer from "./Binarizer.svelte";
	import DrawCanvas from "./DrawCanvas.svelte";
    import StartEndPicker from "./StartEndPicker.svelte";
    import PixelPath from "./PixelPath.svelte";

	var stage = $state(0);

	let drawing = $state(null);
	let binmask = $state(null);
	function update() {
		if (drawcanvas) drawcanvas.SetImageData();
	}

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
				binarizer?.SetImageData(drawing);
				break;
			case 2:
				canGoBack = true;
				canGoForward = true;
				// dump drawing into sendpicker
				sendpicker?.SetImageData(drawing);
				break;
			case 3:
				canGoBack = true;
				canGoForward = false;
				// dump many into pixpath
				pixpath?.SetImageData(drawing);
				pixpath?.SetMask(binmask);
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
		update();
		stage++;
	}
	function DecrementStage() {
		update();
		stage--;
	}
	function StageToName(stage) {
		switch (stage) {
			case 0:
				return "Drawing";
			case 1:
				return "Filtering";
			case 2:
				return "Pick start and end";
			case 3:
				return "Find path";
			default:
				return "Undefined";
		}
	}

	var drawcanvas: DrawCanvas | null = $state(null);
	var binarizer: Binarizer | null = $state(null);
	var sendpicker: StartEndPicker | null = $state(null);
	var pixpath: PixelPath | null = $state(null);
</script>

<div id="multipanel" class="vbox">
	<div class="hbox toolbar">
		<button onclick={DecrementStage} disabled={!canGoBack}>←</button>
		<div class="vbox">
			<span>{StageToName(stage)}</span>
			<span>{stage + 1}/4</span>
		</div>
		<button onclick={IncrementStage} disabled={!canGoForward}>→</button>
	</div>

	{#if stage == 0}
		<DrawCanvas bind:this={drawcanvas} bind:imagedata={drawing} />
	{:else if stage == 1}
		<Binarizer bind:this={binarizer} bind:mask={binmask}/>
	{:else if stage == 2}
		<StartEndPicker bind:this={sendpicker}/>
	{:else if stage == 3}
		<PixelPath bind:this={pixpath}/>
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
