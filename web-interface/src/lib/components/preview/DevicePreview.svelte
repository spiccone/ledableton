<script lang="ts">
  import { onMount } from "svelte";
	import type { Color, Position } from "$lib/device";

  export let ledPositions: Position[];
  export let ledColors: Color[];
  export let scale: {index: number, levels: number[]};

  $: scale, updateSizes();

  let LED_SIZE = 4;
  const PI2 = Math.PI * 2;

  let width = 0;
  let height = 0;
  let MAX_SIZE = 600; //largest of the larger dimension
  let MIN_SIZE = 100; //smallest of the larger dimension

  let canvasElement : HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null; 

  onMount(() => {
    initSizes();
    updateCanvas();
  });

  function initSizes() {
    for (const position of ledPositions) {
      width = Math.max(width, position.x);
      height = Math.max(height, position.y);
    }
    const max = Math.max(width, height);
    for(let i=0; i<=4; i++) {
      let size = MIN_SIZE*(4-i)/4 + MAX_SIZE*i/4;
      scale.levels.push(size/max);
    }
    if (max > MAX_SIZE/2 + MIN_SIZE/2) {
      scale.index = 2;
    }
    updateSizes();
  }

  function updateSizes() {
    if (canvasElement) {
      canvasElement.width = scale.levels[scale.index] * width + LED_SIZE + 4;
      canvasElement.height = scale.levels[scale.index] * height + LED_SIZE + 4;
      updateCanvas();
    }
  }

  function updateCanvas() { 
    if (!canvasElement) {
      return;
    } 
    ctx = canvasElement.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.lineWidth = .5;
    
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    const hl = LED_SIZE/2;
    const scaleValue = scale.levels[scale.index];
    for (let i=0; i<ledPositions.length; i++) {
      const x = scaleValue*ledPositions[i].x + hl + 2;
      const y = scaleValue*ledPositions[i].y + hl + 2;

      ctx.moveTo(x + hl, y); 
      ctx.arc(x, y, hl, 0, PI2, true);
      //ctx.fillStyle = 'rgb('+ledColors[i].r+','+ledColors[i].g+','+ledColors[i].b+'}';
      ctx.fillStyle = "#000";
      ctx.fill();
    }
    
  }

</script>


<canvas bind:this={canvasElement}></canvas>
