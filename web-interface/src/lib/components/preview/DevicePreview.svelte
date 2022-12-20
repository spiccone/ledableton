<script lang="ts">
  import { onMount } from "svelte";
	import type { Color, Position } from "$lib/device";

  export let ledPositions: Position[];
  export let ledColors: Color[];

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
    if (max > 300) {
      scale = 300/max;
    }
    canvasElement.width = scale * width + LED_SIZE + 4;
    canvasElement.height = scale * height + LED_SIZE + 4;
  }

  function updateCanvas() { 
    console.log(ledPositions);
    if (!canvasElement) {
      return;
    } 
    updateSizes();
    ctx = canvasElement.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.lineWidth = .5;
    
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    const hl = LED_SIZE/2;
    for (let i=0; i<ledPositions.length; i++) {
      const x = scale*ledPositions[i].x + hl + 2;
      const y = scale*ledPositions[i].y + hl + 2;

      ctx.moveTo(x + hl, y); 
      ctx.arc(x, y, hl, 0, PI2, true);
      //ctx.fillStyle = 'rgb('+ledColors[i].r+','+ledColors[i].g+','+ledColors[i].b+'}';
      ctx.fillStyle = "#000";
      ctx.fill();
    }
    
  }

</script>


<canvas bind:this={canvasElement}></canvas>
