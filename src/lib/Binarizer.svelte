<script lang="ts">
	var canv: HTMLCanvasElement;

	var uploadimage: ImageData | null = $state(null);

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
	function UpdateImage(evt: any) {
		// tack to SO post: https://stackoverflow.com/questions/7372637/grab-image-from-input-field-to-get-image-data-display-image
		// this solution is awful, look at the amount of callbacks (so it'll do for now)
		var reader = new FileReader();
		reader.onload = function (evts) {
			if (!evts.target) return;
			const image = new Image();
			image.src = evts.target.result as string;
			image.onload = () => {
				const c = new OffscreenCanvas(WIDTH, HEIGHT);
				const cx = c.getContext("2d");
				cx?.drawImage(image, 0, 0);
				uploadimage = cx?.getImageData(0, 0, WIDTH, HEIGHT) ?? null;
			};
		};
		reader.readAsDataURL(evt.target.files[0]);
	}
	var multiplier = $state(0.5);
	$effect(() => {
		var ctx = canv.getContext("2d");
		if (!uploadimage) return;
		ctx?.putImageData(uploadimage, 0, 0);
		var imageclone = new ImageData(WIDTH, HEIGHT);
		// collect average for threshold
		var avg = 0;
		for (var i = 0; i < uploadimage.data.length; i += 4) {
			avg +=
				uploadimage.data[i + 0] +
				uploadimage.data[i + 1] +
				uploadimage.data[i + 2];
		}
		avg /= imageclone.data.length / 3;
		imageaverage = avg;
		avg *= multiplier;

		for (var i = 0; i < uploadimage.data.length; i += 4) {
			if (
				uploadimage.data[i + 0] +
					uploadimage.data[i + 1] +
					uploadimage.data[i + 2] <
				avg
			) {
				imageclone.data[i + 0] = 255;
				imageclone.data[i + 1] = 255;
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
	});
</script>

<div id="bundle">
	<canvas width={WIDTH} height={HEIGHT} bind:this={canv}></canvas>
	<div class="vbox optionspanel">
		<div>
			<p>Upload image;</p>
			<input type="file" onchange={UpdateImage} />
		</div>
		<div>
			<p>Image average: {imageaverage.toFixed(2)}</p>
		</div>
		<div>
			<p>Multiplier;</p>
			{multiplier}
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
</style>
