<script lang="ts">
  import { onMount } from "svelte";
  import Page from "../routes/+page.svelte";
  import {
    Canvas,
    Circle,
    type TPointerEvent,
    type TPointerEventInfo,
  } from "fabric";

  var canv: HTMLCanvasElement;

  let resetButton:HTMLButtonElement;

  // export function LoadImage(newimage: ImageData) {

  // }

  export function SetImageData(newimage: ImageData) {
    uploadimage = newimage;
  }

  export function GetOutBuffer(): ImageData | null {
    return outbuffer;
  }

  const WIDTH = 400;
  const HEIGHT = 400;

  var uploadimage: ImageData | null = $state(null);
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
    console.log(evt.target.files[0]);
    reader.readAsDataURL(evt.target.files[0]);
  }
  var multiplier = $state(0.5);

  $effect(() => {
    var ctx = canv.getContext("2d");
    if (!uploadimage) return;
    ctx?.putImageData(uploadimage, 0, 0);

    outbuffer = ctx?.getImageData(0, 0, WIDTH, HEIGHT) ?? null;
  });


  var startX = $state(-1);
  var startY = $state(-1);
  var endX = $state(-1);
  var endY = $state(-1);

  var startCircle = $state(new Circle());
  var endCircle = $state(new Circle());

  startCircle.radius = 5;
  startCircle.fill = "green";
  endCircle.radius = 5;
  endCircle.fill = "red";

  function reset(fabricCanv:Canvas) {
    startX = -1;
    startY = -1;
    endX = -1;
    endY = -1;
    let ctx = canv.getContext("2d");
	startCircle.dispose();
	endCircle.dispose();
	fabricCanv.forEachObject(element => {
		if (element == startCircle || element == endCircle) {
			fabricCanv.remove(element);
		}
	});
	fabricCanv.renderAll();
  }

  function clickEvent(
    canvas: HTMLCanvasElement,
    eventInfo: TPointerEventInfo<TPointerEvent>,
    fabricCanv: Canvas
  ) {
    let event = eventInfo.e as MouseEvent;
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let ctx = canv.getContext("2d") as CanvasRenderingContext2D;

    console.log("Coordinate x: " + x, "Coordinate y: " + y);
    if (startX == -1) {
      ctx.strokeStyle = "green";
      ctx.fillStyle = "green";
      startX = Math.trunc(x);
      startY = Math.trunc(y);

	  startCircle.setX(x);
	  startCircle.setY(y);

	  fabricCanv.add(startCircle);

    //   ctx?.beginPath();
    //   ctx?.arc(startX, startY, 5, 0, Math.PI * 2);
    //   ctx?.stroke();
    //   ctx?.fill();
    } else if (endX == -1) {
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      endX = Math.trunc(x);
      endY = Math.trunc(y);

	  endCircle.setX(x);
	  endCircle.setY(y);

	  fabricCanv.add(endCircle);

    //   ctx?.beginPath();
    //   ctx?.arc(endX, endY, 5, 0, Math.PI * 2);
    //   ctx?.stroke();
    //   ctx?.fill();
    }
	fabricCanv.renderAll();
  }

  function displayStart() {
    if (startX == -1 && startY == -1) {
      return "Click to set co-ordinates...";
    } else {
      return startX + ", " + startY;
    }
  }

  function displayEnd() {
    if (endX == -1 && endY == -1) {
      return "Click to set co-ordinates...";
    } else {
      return endX + ", " + endY;
    }
  }

  onMount(() => {
    // as soon as canvas is loaded, run this
    var fabricCanv = new Canvas(canv);
	resetButton.addEventListener("onclick", function (e) {reset(fabricCanv);});
    // canv.addEventListener("mousedown", function (e) {clickEvent(canv, e, fabricCanv);})
    fabricCanv.on("mouse:down", function (e) {
      clickEvent(canv, e, fabricCanv);
    });
  });
</script>

<div id="bundle">
  <canvas width={WIDTH} height={HEIGHT} bind:this={canv}></canvas>
  <div class="vbox optionspanel">
    <div>
      <p>Upload image;</p>
      <input type="file" onchange={UpdateImage} />
    </div>
    <!-- <div>
			<p>Image average: {imageaverage.toFixed(2)}</p>
		</div> -->

    <div>
      <h1>Start: {displayStart()}</h1>
      <h1>End: {displayEnd()}</h1>
    </div>
    <!-- 
		<div>
			<p>Multiplier;</p>
			{multiplier} <input type="range" min="0" max="2" step="0.01" bind:value={multiplier}/>
		</div> -->

    <div>
      <button bind:this={resetButton}>reset</button>
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

  canvas {
    border: 2px solid rgb(255, 101, 101);
  }
</style>
