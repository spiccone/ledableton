<script lang="ts">
	import PreviewList from '../components/PreviewList.svelte';
  import GrabBar from '../components/GrabBar.svelte'
  import {Device, LayoutDirection} from '../types'

  let layoutDirection = LayoutDirection.column;
  let oppositeLayoutDirection = LayoutDirection.row;
  let devices: Array<Device> = [new Device(1, 'Picture Wall', '#FCB900'), new Device(2, 'Fireplace', '#FCB900')];

  let previewHeight = 500;
</script>

<div class="LightShowStudio">
    <div class="preview-area" style="height: {previewHeight}px">
        <PreviewList devices={devices} layoutDirection={oppositeLayoutDirection} />
    </div>
    <GrabBar bind:dimension={previewHeight} layoutDirection={layoutDirection} />
    <div class="toolbar-area"></div>
    <GrabBar bind:dimension={previewHeight} layoutDirection={layoutDirection} />
    <div class="timeline-area"></div>
</div>

<style>
  :global(body) {
      margin: 0;
  }
  .LightShowStudio {
    --background-color: #333;
    --border-color: #555;
    --text-color: #ccc;
    background: var(--background-color);
    color: var(--text-color);
    font-family: 'Comfortaa';
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
  }
  .preview-area {
    height: 400px;
    width: 100vw;
    flex: 0 1 auto;
  }

  .toolbar-area {
    height: 60px;
    width: 100vw;
    flex: 0 0 auto;
  }

  .timeline-area {
    min-width: 30px;
    flex: 1 1 auto;
  }
</style>