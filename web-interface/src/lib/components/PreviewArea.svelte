<script lang="ts">
  import type {Device, Position} from "$lib/types";
	import DraggablePreview from './DraggablePreview.svelte';

  export let devices: Array<Device> = [];
  export let locked: boolean = false;


  let dragging= false;

  // Storing positions on this layer so we can save the sate
  const previewPositions: Position[] = new Array(devices.length);
  for (let i=0; i<devices.length; i++) {
    previewPositions[i] = {left: i*200 + 40, top: 100};
  }
</script>

<div class="PreviewArea">
  {#each devices as device, i (device.previewElementId)}
      <DraggablePreview bind:device={device} 
                        bind:dragging={dragging}
                        bind:startLeft={previewPositions[i].left}
                        bind:startTop={previewPositions[i].top}
                        locked={locked || dragging} />
  {/each}
</div>

<style>
  .PreviewArea {
  }

</style>