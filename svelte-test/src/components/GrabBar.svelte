<script lang="ts">
  import {LayoutDirection} from "../types";

  //export let elementIdToScale: string;
  export let layoutDirection: LayoutDirection = LayoutDirection.row;
  export let dimension: number;
  export let minDimension: number = 100;
  export let maxDimension: number = 800;

  let grabBarElement: Element | null;

  const directionClassName = layoutDirection == LayoutDirection.row ? 'vertical' : 'horizontal';
  const useX = layoutDirection == LayoutDirection.row;

  let currentMousePosition: number | null = null;
  let lastGrabBarPosition: number | undefined = undefined;

  function onMouseDown (event: MouseEvent) {
    addEventListener('mousemove', onMouseMove)
    addEventListener('mouseup', onMouseUp)
    currentMousePosition = useX ? event.clientX : event.clientY;
    lastGrabBarPosition = undefined;
  }

  let stuck: boolean = false;
  let stuckPosition: number | null = null;

  function onMouseMove (event: MouseEvent) {
    event.preventDefault();
    if (currentMousePosition) {
      document.body.style.cursor = useX ? "ew-resize" : "ns-resize" ;
      const mousePosition = useX ? event.clientX : event.clientY;

      if (mousePosition == 0) {
        // It will get stuck at 0 - no idea why. 
        return;
      }
      let mouseMovement = mousePosition - currentMousePosition;
      let lastDimension = dimension;
      let newDimension = dimension + mouseMovement;
      currentMousePosition = mousePosition;

      let grabBarClientRect = grabBarElement?.getBoundingClientRect();
      let grabBarPosition = useX ? grabBarClientRect?.left : grabBarClientRect?.top;      

      /* If the layout limits the scalable dimension, the value could be
      significantly off from it's actual display dimension, causing a delay
      with subsequent scaling until it catches up. This will prevent the values
      from drifting. This number will be close but not exact, depnding on how
      the mouse moved. */ 
      if (grabBarPosition == lastGrabBarPosition) {
        if (!stuck) {
          stuckPosition = lastDimension;
        }
        stuck = true;
      } else {
        stuck = false;
        stuckPosition = null;
      }

      const mouseDistanceFromBar = grabBarPosition ? mousePosition - grabBarPosition : 0;
      if (!stuck &&
          (mouseDistanceFromBar < -5 || 
          mouseDistanceFromBar > 5)) {
        newDimension += mouseDistanceFromBar;
      }

      dimension = 
          newDimension < minDimension ? minDimension :
          newDimension > maxDimension ? maxDimension :
          newDimension;
        grabBarElement?.scrollIntoView();  
        
      lastGrabBarPosition = grabBarPosition;
    }
  }

  function onMouseUp (event: MouseEvent) {
    if (stuckPosition) {
      dimension = stuckPosition;
    }
    document.body.style.cursor = "";
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