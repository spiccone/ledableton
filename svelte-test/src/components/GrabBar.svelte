<script lang="ts">
  import {LayoutDirection} from "../types";

  //export let elementIdToScale: string;
  export let layoutDirection: LayoutDirection = LayoutDirection.row;
  export let dimension: number;
  export let minDimension: number = 60;
  export let maxDimension: number = 800;

  let grabBarElement: Element | null;

  const directionClassName = layoutDirection == LayoutDirection.row ? 'vertical' : 'horizontal';
  const useX = layoutDirection == LayoutDirection.row;

  let currentMousePosition: number | null = null;
  function onMouseDown (event: MouseEvent) {
    addEventListener('mousemove', onMouseMove)
    addEventListener('mouseup', onMouseUp)
    currentMousePosition = useX ? event.clientX : event.clientY;
  }

  function onMouseMove (event: MouseEvent) {
    event.preventDefault();
    if (currentMousePosition) {
      const clientDimension = useX ? event.clientX : event.clientY;
      let newDimension = dimension + clientDimension - currentMousePosition;
      currentMousePosition = clientDimension;

      dimension = 
        newDimension < minDimension ? minDimension :
        newDimension > maxDimension ? maxDimension :
        newDimension;

      if (grabBarElement) {
        grabBarElement.scrollIntoView();
      }
    }
  }

  function onMouseUp (event: MouseEvent) {
    currentMousePosition = null;
    removeEventListener('mousemove', onMouseMove)
    removeEventListener('mouseup', onMouseUp)
  }

</script>

<div class="GrabBar {directionClassName}" on:mousedown={onMouseDown} bind:this={grabBarElement}>
</div>

<style>
  .GrabBar {
    background-color: var(--border-color);
    flex: 0 0 auto;
  }
  .GrabBar.vertical {
    cursor: ew-resize;
    height: 100%;
    width: 4px;
  }
  .GrabBar.horizontal {
    cursor: ns-resize;
    height: 4px;
    width: 100%;
  }
  
</style>