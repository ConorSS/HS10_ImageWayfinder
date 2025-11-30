<script lang="ts">

	var canv: HTMLCanvasElement;

	var uploadimage: ImageData | null = $state(null);
	var mask: ImageData | null = $state(null);

	export function SetImageData(newimage: ImageData) {
		uploadimage = newimage;
	}
	export function SetMask(newimage: ImageData) {
		mask = newimage;
	}

	const WIDTH = 400;
	const HEIGHT = 400;

	var status = $state("nothing happening...");

	function pathfind() {
		// Make a graph...
		interface Point {
			x: Number;
			y: Number;
		}

		var graph: Point[] = [];

		if (!mask) {console.error("NO MASK!!"); return;}

		// get buffer
		status = "making graph";
		console.log(status);
		var buffer = mask?.data;
		for (var x = 0; x < WIDTH; x++)
			for (var y = 0; y < HEIGHT; y++) {
				let bindex = (x + y * WIDTH) * 4;
				if (buffer[bindex + 3] != 0) graph.push({ x: x, y: y });
			}

		status = "getting distance";
		console.log(status);
		var distances = new Map<number, { dist: number; visited: boolean; prev: number; }>();
		for (var i = 0; i < graph.length; i++) {
			distances.set(i, { dist: 99999999, visited: false, prev:-1 });
		}

		var start = { x: 16, y: 16 };
		const startidx = graph.findIndex((point) => {
			return point == start;
		});
		var cursor = startidx;
		distances.set(cursor, { dist: 0, visited: false, prev:-1 });

		var end = { x: WIDTH - 16, y: HEIGHT - 16 };
		const endidx = graph.findIndex((point) => {
			return (point.x == end.x && point.y == end.y);
		});
		// start from 16,16, go to other side
		// go cw

		for (let i = 0; i< graph.length; i++) {
			for (let i = 0; i < graph.length; i++) {
				if (!distances.get(i)?.visited && distances.get(i)!.dist < distances.get(cursor)!.dist)
					cursor = i;
			}
			// get dist for closest nodes;
			let connected = [];
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x == 0 && y == 0) continue;
					let found = graph.findIndex((point) => {
						return point.x == x && point.y == y;
					});
					if (found != -1) connected.push(found);
				}
			}
			// for all connected;
			let thisdist = distances.get(cursor)!.dist + 1;
			for (let i = 0; i < connected.length; i++) {
				var current = distances.get(i);
				if (current!.dist > thisdist) {
					current!.dist = thisdist;
					current!.prev = cursor;
					
					distances.set(i, current!);
				}
			}
		}

		// find our path
		status = "traversing";
		console.log(status);
		var passingpath : number[] = [];
		passingpath.push(endidx);
		while (passingpath[passingpath.length - 1] != startidx) {
			// find minima connected to cursor and push node connection
			cursor = distances.get(cursor)?.prev!;
			passingpath.push(
				cursor
			);
		}
		

		// draw path
		status = "drawing";
		console.log(status);
		let ctx = canv.getContext("2d");
		ctx!.strokeStyle = 'green';
		ctx?.moveTo(start.x, start.y);
		for (let i = 1; i < passingpath.length; i++) {
			ctx?.lineTo(graph[passingpath[i]].x, graph[passingpath[i]].y);
		}

		status = `done (length is ${passingpath.length})`;
	}

	function canvasload() {
		var ctx = canv.getContext("2d");
		if (!uploadimage) return;
		ctx?.putImageData(uploadimage, 0, 0);
		// process output here!!
	}
	$effect(canvasload);
</script>

<div id="bundle">
	<canvas width={WIDTH} height={HEIGHT} bind:this={canv} onload={canvasload}
	></canvas>
	<div class="vbox optionspanel">
		<div>
			<button onclick={pathfind}> Run pathfinder </button>
		</div>
		<div>
			<p>Status;</p>
			<p>{status}</p>
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
