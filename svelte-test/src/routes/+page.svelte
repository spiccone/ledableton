<script lang="ts">
	import PreviewList from '../components/PreviewList.svelte';
  import TimelineList from '../components/TimelineList.svelte';
  import GrabBar from '../components/GrabBar.svelte'
  import {Device, LayoutDirection as Layout} from '../types'
  import Icon from '@iconify/svelte';
  import createIcon from '@iconify/icons-gridicons/create';
  import folderOpenOutlineRounded from '@iconify/icons-material-symbols/folder-open-outline-rounded';
  import lockOpenOutline from '@iconify/icons-material-symbols/lock-open-outline';
  import lockOutline from '@iconify/icons-material-symbols/lock-outline';
  import rotate90DegreesCcwOutlineRounded from '@iconify/icons-material-symbols/rotate-90-degrees-ccw-outline-rounded';
  import rotate90DegreesCwOutlineRounded from '@iconify/icons-material-symbols/rotate-90-degrees-cw-outline-rounded';
  import saveOutlineRounded from '@iconify/icons-material-symbols/save-outline-rounded';

  let locked = false;
  let layoutDirection = Layout.column;
  let oppositeLayoutDirection = Layout.row;
  let layoutDirectionClass = "layout-column";
  let columnLayout = true;

  let devices: Array<Device> = [
    new Device(1, 'Picture Wall', '#FCB900'), 
    new Device(2, 'Fireplace', '#FCB900')];

  let scalableDimension = 500;
  let height = 500;
  let width = 500;

  function handleSave() {}
  function handleOpen() {}

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

  function handleLock() {
    locked = !locked;
  }

</script>

<div class="LightShowStudio {layoutDirectionClass}">
  <div class="preview-area" style="{columnLayout ? 'height' : 'width'}: {scalableDimension}px">
    <PreviewList 
      bind:devices={devices} 
      layoutDirection={oppositeLayoutDirection}
      locked = {locked} />
  </div>
  <div class="grab-bar {layoutDirectionClass}">
    <GrabBar 
      bind:dimension={scalableDimension} 
      layoutDirection={layoutDirection} 
      locked = {locked} />
  </div>
  <div class="toolbar-area">

  </div>
  <div class="grab-bar {layoutDirectionClass}">
    <GrabBar 
      bind:dimension={scalableDimension} 
      layoutDirection={layoutDirection} 
      locked = {locked} />
  </div>
  <div class="timeline-area">
    <TimelineList 
      bind:devices={devices} 
      layoutDirection={oppositeLayoutDirection} />
  </div>
  <div class="bottom-toolbar"></div>

  <div class="layout-button-area">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="layout-button" on:click={handleOpen}>
      <Icon icon={createIcon} />
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="layout-button" on:click={handleOpen}>
      <Icon icon={folderOpenOutlineRounded} />
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="layout-button" on:click={handleSave}>
      <Icon icon={saveOutlineRounded} />
    </div>
    <div class="button-separator"></div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="layout-button" on:click={handleLock}>
      {#if locked}
        <Icon icon={lockOutline} />
      {:else}
        <Icon icon={lockOpenOutline} />
      {/if}
    </div>

    {#if !locked}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="layout-button" on:click={handleRotate}>
        {#if layoutDirection == Layout.column}
          <Icon icon={rotate90DegreesCcwOutlineRounded} rotate={3} />
        {:else}
          <Icon icon={rotate90DegreesCwOutlineRounded} />
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  :global(body) {
      margin: 0;
  }
  :global(svg) {
    height: 100%;
    width: 100%;
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

  .layout-button-area {
    position: fixed;
    right: 10px;
    top: 10px;
  }
  .layout-button {
    color: #fff;
    cursor: pointer;
    height: 24px;
    margin-bottom: 10px;
    opacity: 30%;
    width: 24px;
  }
  .layout-button:hover {
    opacity: 80%;
  }
  .layout-button:active {
    opacity: 100%;
  }

  .button-separator {
    background-color: #fff;
    border-radius: 1px;
    height: 2px;
    margin: 10px 1px;
    opacity: 8%;
    width: 22px;
  }
</style>