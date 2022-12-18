<script lang="ts">
  import { onMount } from "svelte";
	import type { Position } from "$lib/device";

  export let ledPositions: Position[];

  const LED_SIZE = 6;
  const PI2 = Math.PI * 2;
  let width = 0;
  let height = 0;

  let canvasElement : HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null; 

  let mounted = false;

  $: ledPositions, updateCanvas();

  onMount(() => {
    console.log(ledPositions);
    mounted = true;
    updateCanvas();
  });

  function updateSizes() {
    for (const position of ledPositions) {
      width = Math.max(width, position.x + LED_SIZE + 4);
      height = Math.max(height, position.y + LED_SIZE + 4);
    }
    canvasElement.width = width;
    canvasElement.height = height;
  }

  function updateCanvas() { 
    if (!mounted) {
      return;
    } 
    updateSizes();
    ctx = canvasElement.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    for (const position of ledPositions) {
      const x = position.x + LED_SIZE/2 + 2;
      const y = position.y + LED_SIZE/2 + 2;

      ctx.moveTo(x + LED_SIZE/2, y); 
      ctx.arc(x, y, LED_SIZE/2, 0, PI2, true);
    }
    ctx.stroke();
    ctx.fill();
    console.log(ctx);
    width = width;
  }

</script>

<div class="DevicePreview">
  <canvas class="canvas" bind:this={canvasElement}></canvas>
</div>

<style>
  .DevicePreview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
  }

  .canvas {
    border: 2px solid #777;
    padding: 12px;
    border-radius: 20px;
    background: #222;
  }
</style>