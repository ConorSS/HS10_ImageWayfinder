<script lang="ts" context="module">
  import {Circle, Point, Polyline, Canvas} from "fabric";

	export function RenderGraph(canv: Canvas) {
		const spacer = 16;
		const height = canv.height;
		const width = canv.width;
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
				canv.add(circle);
				points[y].push(circle);
				x++;
			}
			y++;
		}

		for(let y = 0; y < points.length; y++) {
			for(let x = 0; x < points[y].length; x++) {
				DrawValidEdges(x, y, points, canv);
			}
		}
		canv.renderAll();
	}

	export function DrawValidEdges(x: number, y: number, points: Circle[][], canv: Canvas) {
		let canvasEl = canv.getElement();
		let ctx = canvasEl.getContext("2d", {willReadFrequently: true}) as CanvasRenderingContext2D;
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

				canv.add(line);
			}
		}
	}

	export function Raycast(origin: Point, dest: Point, matX: number, matY: number, imgData: ImageData): boolean {
		let x = origin.x;
		let y = origin.y;
		while (x != dest.x || y != dest.y) {
			if (imgData.data[3 + 4 * (x + y * imgData.width)] > 0) {
				return false;
			}
			x = x == dest.x ? x : x + matX;
			y = y == dest.y ? y : y + matY;
			if (x > imgData.width || y > imgData.height || x < 0 || y < 0) return false;
		}
		return true;
	}
</script>