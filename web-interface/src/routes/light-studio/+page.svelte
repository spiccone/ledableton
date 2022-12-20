<script lang="ts">
  import { onMount } from 'svelte';
  import Menu from '$lib/components/timeline/Menu.svelte';
	import PreviewArea from '$lib/components/preview/PreviewArea.svelte';
  import TimelineList from '$lib/components/timeline/TimelineList.svelte';
  import GrabBar from '$lib/components/GrabBar.svelte'
  import {LayoutDirection as Layout, LayoutDirection } from '$lib/types';
  import Icon from '@iconify/svelte';
  import createIcon from '@iconify/icons-gridicons/create';
  import folderOpenOutlineRounded from '@iconify/icons-material-symbols/folder-open-outline-rounded';
  import lockOpenOutline from '@iconify/icons-material-symbols/lock-open-outline';
  import lockOutline from '@iconify/icons-material-symbols/lock-outline';
  import rotate90DegreesCcwOutlineRounded from '@iconify/icons-material-symbols/rotate-90-degrees-ccw-outline-rounded';
  import rotate90DegreesCwOutlineRounded from '@iconify/icons-material-symbols/rotate-90-degrees-cw-outline-rounded';
  import saveOutlineRounded from '@iconify/icons-material-symbols/save-outline-rounded';
  import settingsOutlineRounded from '@iconify/icons-material-symbols/settings-outline-rounded';
	import type { DeviceDisplay } from '$lib/device';

  const audioMinimapId = "audio-minimap";
  let locked = false;
  let layoutDirection = Layout.column;
  let oppositeLayoutDirection = Layout.row;
  let columnLayout = true;

  let devices: DeviceDisplay[] = [];

  let windowHeight = 0;
  let previewHeight = 500;
  let previewWidth = 600;

  function handleSave() {}
  function handleOpen() {}

  function handleRotate() {
    columnLayout = !columnLayout;
		layoutDirection = columnLayout ? Layout.column : Layout.row;
    oppositeLayoutDirection = columnLayout ? Layout.row : Layout.column;
	}

  function handleLock() {
    locked = !locked;
  }
</script>

<svelte:window bind:innerHeight={windowHeight}/>

<svelte:head>
	<title>Ledabledon</title>
	<meta name="description" content="Ledableton" />
</svelte:head>

<div class="LightShowStudio {columnLayout ? 'layout-column' : 'layout-row'}"
     style="{columnLayout ?
           'grid-template-columns: minmax(200px, ' + previewWidth + 'px) 4px minmax(200px, 1fr); ' + 
           'grid-template-rows: minmax(20px, ' + previewHeight + 'px) 4px minmax(60px, 1fr)' :
           'grid-template-columns: minmax(200px, ' + previewWidth + 'px) 4px minmax(100px, '+previewHeight+'px) 4px minmax(60px, 1fr);' +
           'grid-template-rows: 1fr;'}">
  <div class="preview-area">
    <PreviewArea
      bind:devices={devices} 
      locked = {locked} />
  </div>
  <div class="grab-bar vertical">
    <GrabBar 
      bind:dimension={previewWidth} 
      layoutDirection={LayoutDirection.row} 
      locked = {locked} />
  </div>
  <div class="menu-area">
    <Menu minimapId={audioMinimapId} bind:devices={devices} />
  </div>
  <div class="grab-bar horizontal">
    <GrabBar 
      bind:dimension={previewHeight} 
      layoutDirection={layoutDirection} 
      locked = {locked} />
  </div>
  <div class="timeline-area">
    <TimelineList 
      bind:devices={devices} 
      layoutDirection={layoutDirection}
      audioMinimapId={audioMinimapId} 
      verticalAudio={!columnLayout} />
  </div>

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
    <div class="layout-button">
      <Icon icon={settingsOutlineRounded} />
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
  .LightShowStudio {
    display: grid;
    height: 100vh;
    width: 100vw;
  }
  .layout-column {
    grid-template-areas: 
      "preview grabv menu"
      "grabh grabh grabh"
      "timeline timeline timeline";
  }
  .layout-row {
    grid-template-areas: 
      "preview grabv menu grabh timeline";
  }
  .preview-area {
    grid-area: preview;
  }

  .menu-area {
    grid-area: menu;
  }

  .timeline-area {
    grid-area: timeline;
    min-height: 0px;
  }

  .audio-area {
    grid-area: audio;
    height: 60px;
  }

  .grab-bar {
    background-color: var(--color-border);
    flex: 0 0 auto;
  }
  .grab-bar.horizontal {
    grid-area: grabh;
    height: 4px;
    width: 100%;
  }
  .grab-bar.vertical {
    grid-area: grabv;
    height: 100%;
    width: 4px;
  }
  .layout-row .grab-bar.horizontal {
    width: 4px;
    height: 100%;
  }

  .layout-button-area {
    display: flex;
    position: fixed;
    flex-direction: column;
    position: fixed;
    left: 12px;
    top: 12px;
  }

  .layout-button {
    color: #fff;
    cursor: pointer;
    height: 24px;
    opacity: 30%;
    margin-bottom: 10px;
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
    opacity: 15%;
    height: 2px;
    margin: 0 1px 10px 1px;
    width: 22px;
  }
</style>
