<script lang="ts">
  import { onMount } from "svelte";
	import type { Position } from "$lib/device";

  export let ledPositions: Position[];

  let LED_SIZE = 4;
  const PI2 = Math.PI * 2;
  let scale = 1;
  let width = 0;
  let height = 0;

  let canvasElement : HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null; 

  $: ledPositions, updateCanvas();

  onMount(() => {
    updateCanvas();
  });

  function updateSizes() {
    width = 0;
    height = 0;
    scale = 1;
    for (const position of ledPositions) {
      width = Math.max(width, position.x);
      height = Math.max(height, position.y);
    }
    const max = Math.max(width, height);
    if (max > 500) {
      scale = 500/max;
    }
    canvasElement.width = scale * width + LED_SIZE + 4;
    canvasElement.height = scale * height + LED_SIZE + 4;
  }

  function updateCanvas() { 
    if (!canvasElement) {
      return;
    } 
    updateSizes();
    ctx = canvasElement.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.lineWidth = .5;
    ctx.fillStyle = '#000';
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    const hl = LED_SIZE/2;
    for (var i = 0; i <= width; i += 100) {
      const x = scale*(0.5+i) + hl + 2;
      ctx.moveTo(x, hl + 2);
      ctx.lineTo(x, scale*(height)+hl - 2);
    }
    for (var i = 0; i <= height; i += 100) {
      const y = scale*(0.5+i) + hl + 1;
      ctx.moveTo(hl + 2, y);
      ctx.lineTo(scale*(width)+hl - 2, y);
    }
    ctx.stroke();
    for (const position of ledPositions) {
      const x = scale*position.x + hl + 2;
      const y = scale*position.y + hl + 2;

      ctx.moveTo(x + hl, y); 
      ctx.arc(x, y, hl, 0, PI2, true);
    }
    ctx.fill();
  }

</script>

<div class="DevicePreview">
  <canvas class="canvas" bind:this={canvasElement}></canvas>
</div>

<style>
  .DevicePreview {
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 8px;
    position: relative;
    margin: 12px 0;
  }

  .canvas {
    background: #444;
    border: 4px solid #222;
    border-radius: 20px;
    padding: 12px;
  }
</style>