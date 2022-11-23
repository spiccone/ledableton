<script lang="ts">
  import { onMount } from 'svelte';
	import PreviewList from '../components/PreviewList.svelte';
  import GrabBar from '../components/GrabBar.svelte'
  import {Device, LayoutDirection as Layout} from '../types'
  import Icon from '@iconify/svelte';
  import rotate90DegreesCcwOutlineRounded from '@iconify/icons-material-symbols/rotate-90-degrees-ccw-outline-rounded';
  import rotate90DegreesCwOutlineRounded from '@iconify/icons-material-symbols/rotate-90-degrees-cw-outline-rounded';

  let layoutDirection = Layout.column;
  let oppositeLayoutDirection = Layout.row;
  let layoutDirectionClass = "layout-column";
  let columnLayout = true;

  let devices: Array<Device> = [new Device(1, 'Picture Wall', '#FCB900'), new Device(2, 'Fireplace', '#FCB900')];

  let scalableDimension = 500;
  let height = 500;
  let width = 500;

  function handleRotate() {
    if(columnLayout) {
      height = scalableDimension;
      scalableDimension = width;
    } else {
      width = scalableDimension;
      scalableDimension = height;
    }
    columnLayout = !columnLayout;
		layoutDirection = columnLayout ? Layout.column : Layout.row;
    oppositeLayoutDirection = columnLayout ? Layout.row : Layout.column;
    layoutDirectionClass = layoutDirection == Layout.column ? "layout-column" : "layout-row";
	}

</script>

<div class="LightShowStudio {layoutDirectionClass}">
  {#if columnLayout}
    <div class="preview-area" style="height: {scalableDimension}px">
      <PreviewList devices={devices} layoutDirection={oppositeLayoutDirection} />
    </div>
  {:else}
    <div class="preview-area" style="width: {scalableDimension}px">
      <PreviewList devices={devices} layoutDirection={oppositeLayoutDirection} />
    </div>
  {/if}
  <div class="grab-bar {layoutDirectionClass}">
    <GrabBar bind:dimension={scalableDimension} layoutDirection={layoutDirection} />
  </div>
  <div class="toolbar-area"></div>
  <div class="grab-bar {layoutDirectionClass}">
    <GrabBar bind:dimension={scalableDimension} layoutDirection={layoutDirection} />
  </div>
  <div class="timeline-area"></div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="rotate-button" on:click={handleRotate}>
    {#if layoutDirection == Layout.column}
      <Icon icon={rotate90DegreesCcwOutlineRounded} width="24" height="24" rotate={3} />
    {:else}
      <Icon icon={rotate90DegreesCwOutlineRounded} width="24" height="24" />
    {/if}
  </div>
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
  }
  .layout-column.LightShowStudio {
    flex-direction: column;
  }
  .layout-row.LightShowStudio {
    flex-direction: row;
  }
  .preview-area {
    flex: 0 1 auto;
  }
  .layout-column .preview-area {
    height: 400px;
    width: 100vw;
  }
  .layout-row .preview-area {
    height: 100vh;
    width: 400px;
  }

  .toolbar-area {
    flex: 0 0 auto;
  }
  .layout-column .toolbar-area {
    height: 60px;
    width: 100vw;
  }
  .layout-row .toolbar-area {
    height: 100vh;
    width: 60px;
  }

  .timeline-area {
    flex: 1 1 auto;
  }

  .grab-bar {
    background-color: var(--border-color);
    flex: 0 0 auto;
  }
  .layout-column .grab-bar {
    height: 4px;
    width: 100%;
  }
  .layout-row .grab-bar{
    height: 100%;
    width: 4px;
  }

  .rotate-button {
    position: fixed;
    color: #fff;
    opacity: 30%;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  .rotate-button:hover {
    opacity: 80%;
  }
</style>