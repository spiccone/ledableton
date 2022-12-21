<script lang="ts">
	import type { DeviceDisplay } from '$lib/device';
  import {onMount} from 'svelte';
	import DevicePreview from './DevicePreview.svelte';
  import DeviceColorPicker from './DeviceColorPicker.svelte';
  import Icon from '@iconify/svelte';
  import roundZoomIn from '@iconify/icons-ic/round-zoom-in';
  import roundZoomOut from '@iconify/icons-ic/round-zoom-out';
  import settingsOutlineRounded from '@iconify/icons-material-symbols/settings-outline-rounded';


  export let device: DeviceDisplay;
  export let dragging = false;
  export let locked = false;

  let element: HTMLElement;
  let hovering = false;
  let drag = false;
  let colorPickerOpen = false;
  let scale = {index: 0, levels: []}; //levels will be initalized in DevicePreview

  let left: number;
  let top: number;

  onMount(() => {
    left = device.previewLeft - element.getBoundingClientRect().left;
    top = device.previewTop - element.getBoundingClientRect().top;
  });

  let xOffset = 0;
  let yOffset = 0;

  function enter() {
    hovering = true;
  }

  function leave() {
    hovering = false;
  }

  function startDragging(event: MouseEvent) {
    if (locked) {
      return;
    }
    dragging = true;
    drag = true;
    xOffset = event.clientX;
    yOffset = event.clientY;
    addEventListener('mousemove', onMouseMove);
    addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if(colorPickerOpen) {
      onMouseUp();
      return;
    }
    left += event.clientX - xOffset;
    top += event.clientY - yOffset;
    xOffset = event.clientX;
    yOffset = event.clientY;
    keepOnPage();
  }

  function onMouseUp() {
    removeEventListener('mousemove', onMouseMove);
    removeEventListener('mouseup', onMouseUp);
    const rect = element.getBoundingClientRect();
    device.previewLeft = rect.x;
    device.previewTop = rect.y;
    dragging = false;
    drag = false;
  }

  // TODO: Change this so the container grows up/left
  function keepOnPage() {
    const rect = element.getBoundingClientRect();
    if(rect.left < 0) {
      device.previewLeft = 0;
      left -= rect.left;
    }
    if(rect.top < 0) {
      device.previewTop = 0;
      top -= rect.top;
    }
    element.scrollIntoView();
  }

  function zoomOut() {
    scale.index = Math.max(scale.index - 1, 0);
  }

  function zoomIn() {
    scale.index = Math.min(scale.index + 1, scale.levels.length - 1);
  }

  function openSettings() {

  }

</script>

<div class="DraggablePreview {drag || (hovering && !locked) ? 'hovering' : ''}"
    class:locked
    bind:this={element}
    on:mouseenter={enter}
    on:mouseleave={leave}
    on:mousedown={startDragging}
    style="left: {left}px; top: {top}px;">
  <div class="device-toolbar">
    <DeviceColorPicker 
      bind:open={colorPickerOpen}
      bind:color={device.color}
      locked={locked} />
    <div class="device-label">{device.label}</div>
    {#if hovering && !locked}
      <div class="actions">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div role="button" class="icon-button settings-button" on:click={openSettings}>
          <Icon icon={settingsOutlineRounded} />
        </div>
      </div>
    {/if}
  </div>
  <div class="display">
    <DevicePreview bind:ledPositions={device.ledPositions} 
                   bind:ledColors={device.ledColors}
                   bind:scale={scale} />
  </div>
  <div class="device-bottom-toolbar">
    {#if hovering && !locked}
      <div class="actions">
        <div class="scale">
          {Math.round(scale.levels[scale.index] * 100)}%
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div role="button" class="icon-button" on:click={zoomOut}>
          <Icon icon={roundZoomOut} />
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div role="button" class="icon-button" on:click={zoomIn}>
          <Icon icon={roundZoomIn} />
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .DraggablePreview {
    cursor: move;
    border: 2px solid rgba(0,0,0,0);
    border-radius: 12px;
    padding: 12px 12px 6px;
    position: relative;
    width: fit-content;
  }
  .DraggablePreview.locked {
    cursor: default;
  }
  .DraggablePreview.hovering {
    border-color: var(--color-border);
    cursor: move;
  }

  .device-toolbar,
  .device-bottom-toolbar {
    align-items: center;
    box-sizing: border-box;
    display: flex;
  }
  .device-toolbar {
    height: 32px;
    padding-bottom: 12px;
  }
  .device-bottom-toolbar {
    height: 26px;
    justify-content: flex-end;
  }
  .device-label {
    font-size: 14px;
    flex: 1 1 auto;
  }
  
  .actions {
    align-items: center;
    display: flex;
    flex-direction: row;
    font-size: 10px;
  }
  .icon-button {
    box-sizing: border-box;
    color: var(--color-input-text);
    cursor: pointer;
    height: 24px;
    width: 24px;
  }
  .icon-button:hover {
    color: var(--color-input-text-hover);
  }
  .icon-button:active {
    color: var(--color-input-text-active);
  }

  .settings-button {
    padding: 2px;
  }
  .scale {
    padding: 0 4px;
  }

  .display {
    width: fit-content;
  }
</style>