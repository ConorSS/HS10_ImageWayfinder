<script lang="ts">
	var canv: HTMLCanvasElement;

	var uploadimage: ImageData | null = $state(null);

	let { mask = $bindable() } : { mask : ImageData | null } = $props();

	export function SetImageData(newimage: ImageData) {
		uploadimage = newimage;
	}

	export function GetOutBuffer(): ImageData | null {
		return outbuffer;
	}

	const WIDTH = 400;
	const HEIGHT = 400;

	var imageaverage = $state(0);
	var outbuffer: ImageData | null = $state(null);
	var multiplier = $state(0.5);
	$effect(canvasload);

	function canvasload() {
		var ctx = canv.getContext("2d");
		if (!uploadimage) return;
		ctx?.putImageData(uploadimage, 0, 0);
		var imageclone = new ImageData(WIDTH, HEIGHT);
		// collect median for threshold
		var avg = 0;
		var min = 99999;
		var max = 0;
		for (var i = 0; i < uploadimage.data.length; i += 4) {
			min = Math.min(
				min,
				uploadimage.data[i + 0] +
					uploadimage.data[i + 1] +
					uploadimage.data[i + 2] +
					uploadimage.data[i + 3],
			);
			max = Math.max(
				max,
				uploadimage.data[i + 0] +
					uploadimage.data[i + 1] +
					uploadimage.data[i + 2] +
					uploadimage.data[i + 3],
			);
		}
		avg = max - min;
		imageaverage = avg;
		avg *= multiplier;

		for (var i = 0; i < uploadimage.data.length; i += 4) {
			if (
				uploadimage.data[i + 0] +
					uploadimage.data[i + 1] +
					uploadimage.data[i + 2] +
					uploadimage.data[i + 3] <=
				avg
			) {
				imageclone.data[i + 0] = 255;
				imageclone.data[i + 1] = 0;
				imageclone.data[i + 2] = 255;
				imageclone.data[i + 3] = 255;
			} else {
				imageclone.data[i + 0] = 0;
				imageclone.data[i + 1] = 0;
				imageclone.data[i + 2] = 0;
				imageclone.data[i + 3] = 0;
			}
		}
		ctx?.putImageData(imageclone, 0, 0);

		outbuffer = ctx?.getImageData(0, 0, WIDTH, HEIGHT) ?? null;
		mask = ctx?.getImageData(0, 0, WIDTH, HEIGHT) ?? null;
	}
</script>

<div id="bundle">
	<canvas width={WIDTH} height={HEIGHT} bind:this={canv} onload={canvasload}
	></canvas>
	<div class="vbox optionspanel">
		<div>
			<p>Avg: {imageaverage.toFixed(2)}</p>
		</div>
		<div>
			<p>Threshold: {multiplier.toFixed(2)}</p>
			<input
				type="range"
				min="0"
				max="2"
				step="0.01"
				bind:value={multiplier}
			/>
		</div>
		<div class="void"></div>
	</div>
</div>

<style>
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

	input[type="range"] {
		writing-mode: sideways-lr;
	}
</style>
