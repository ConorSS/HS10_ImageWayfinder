
<script lang="ts">
    import Binarizer from "./Binarizer.svelte";
import DrawCanvas from "./DrawCanvas.svelte";

	var stage = $state(0);

	function ResetStage() { stage = 0; }
	function IncrementStage() { stage = min(2, stage + 1); }
	function DecrementStage() { stage = max(0, stage - 1); }
	function StageToName(stage) {
		switch (stage) {
			case 0: return "Drawing";
			case 1: return "Filtering";
			default: return "Undefined";
		}
	}


	var drawcanvas : DrawCanvas;
	var binarizer : Binarizer;
</script>

<div id="multipanel" class=vbox>
	<div class=vbox> 
		<button onclick={DecrementStage}>←</button> 
		<div class=hbox>
			<span>{StageToName(stage)}</span>
			<span>{stage+1}/3</span>
		</div>
		<button onclick={IncrementStage}>→</button>
	</div>
	{#if stage == 0}
		<DrawCanvas bind:this={drawcanvas}/>
	{:else if stage == 1}
		<Binarizer bind:this={binarizer}/>
	{:else}
		<button >Return to drawcanvas</button>
	{/if}
</div>

<style>
	#multipanel {
		display: flex;
		flex-direction: column;
	}

	.vbox {
		display: flex;
		flex-direction: row;
	}
	.hbox {
		display: flex;
		flex-direction: column;
	}
</style>