<script lang="ts">
	var canv: HTMLCanvasElement;

	const WIDTH = 400;
	const HEIGHT = 400;

	var uploadimage: ImageData | null = $state(null);
	function UpdateImage(evt: any) {
		// tack to SO post: https://stackoverflow.com/questions/7372637/grab-image-from-input-field-to-get-image-data-display-image
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
		console.log(evt.target.files[0]);
		reader.readAsDataURL(evt.target.files[0]);
	}
	$effect(() => {
		var ctx = canv.getContext("2d");
		if (!uploadimage) return;
		ctx?.putImageData(uploadimage, 0, 0);
		var imageclone = uploadimage;
		// collect average for threshold
		var avg = 0;
		for (var i = 0; i < imageclone.data.length; i += 4) {
			avg +=
				imageclone.data[i + 0] +
				imageclone.data[i + 1] +
				imageclone.data[i + 2] +
				imageclone.data[i + 3];
		}
		avg /= imageclone.data.length * 2;

		for (var i = 0; i < imageclone.data.length; i += 4) {
			if (
				imageclone.data[i + 0] +
					imageclone.data[i + 1] +
					imageclone.data[i + 2] +
					imageclone.data[i + 3] <
				avg
			) {
				imageclone.data[i + 0] = 0;
				imageclone.data[i + 1] = 0;
				imageclone.data[i + 2] = 0;
				imageclone.data[i + 3] = 0;
			}
		}
		ctx?.putImageData(imageclone, 0, 0);
	});
</script>

<h1>Image to Graph</h1>

<div id="bundle">
	<canvas width={WIDTH} height={HEIGHT} bind:this={canv}></canvas>
	<div class="vbox optionspanel">
		<div>
			<p>Upload image;</p>
			<input type="file" onchange={UpdateImage} />
			<div class="void"></div>
		</div>
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
