<script lang=ts>
    import { onMount } from "svelte";
	import { Canvas, Circle, FabricObject, PencilBrush, Point, Polyline } from "fabric";

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

	function RenderGraph() {
		let spacer = 20;
		let height = fab.height;
		let width = fab.width;
		let points: Circle[][] = [[]];
		let x = 0;
		let y = 0;
		for (let i = spacer / 2; i < height; i += spacer) {
			points[y] = [];
			for (let j = spacer / 2; j < width; j += spacer) {
				let circle = new Circle();
				circle.setXY(new Point(j, i));
				circle.backgroundColor = "rgb(255,0,0)";
				circle.scale(4);
				fab.add(circle);
				points[y].push(circle);
				x++;
			}
			y++;
		}

		for(let y = 0; y < points.length; y++) {
			for(let x = 0; x < points[y].length; x++) {
				DrawValidEdges(x, y, points);
			}
		}
		fab.renderAll();
	}

	function DrawValidEdges(x: number, y: number, points: Circle[][]) {
		let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		ctx.getContextAttributes().willReadFrequently = true;
		let img = ctx.getImageData(0, 0, 400, 400) as ImageData;
		for (let yOffset = -1; yOffset < 2; yOffset++) {
			let destY = y + yOffset;
			if (destY < 0 || destY >= points.length) break;
			for (let xOffset = -1; xOffset < 2; xOffset++) {
				let destX = x + xOffset;
				if (destX < 0 || destX >= points[y].length) break;
				if (xOffset == 0 && yOffset == 0) continue;

				let origin = points[y][x];
				let dest = points[destY][destX];

				let isObstructed: boolean = !Raycast(origin.getRelativeXY(), dest.getRelativeXY(), xOffset, yOffset, img);
				if (isObstructed) continue;

				let line = new Polyline([origin.getXY(), dest.getXY()]);
				line.stroke = "rgb(0,255,0)";
				line.strokeWidth = 2;

				fab.add(line);
			}
		}
	}

	function Raycast(origin: Point, dest: Point, matX: number, matY: number, imgData: ImageData): boolean {
		let x = origin.x;
		let y = origin.y;
		while (x != dest.x || y != dest.y) {
			if (imgData.data[3 + 4 * (x + y * 400)] > 0) {
				return false;
			}
			x = x == dest.x ? x : x + matX;
			y = y == dest.y ? y : y + matY;
			if (x > 400 || y > 400 || x < 0 || y < 0) return false;
		}
		return true;
	}
</script>

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
		<button onclick={RenderGraph}>Render Nodes and Edges</button>
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