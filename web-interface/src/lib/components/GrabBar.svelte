<script lang="ts">
  import {afterUpdate } from 'svelte';
  import {LayoutDirection as Layout} from "../types";

  //export let elementIdToScale: string;
  export let layoutDirection: Layout;
  export let dimension: number;
  export let minDimension: number = 20;
  export let maxDimension: number = 2000;
  export let locked: boolean = false;

  let grabBarElement: Element | null;

  let directionClassName = layoutDirection == Layout.row ? 'vertical' : 'horizontal';
  let useX = layoutDirection == Layout.row;
   
  afterUpdate(() => {
    directionClassName = layoutDirection == Layout.row ? 'vertical' : 'horizontal';
    useX = layoutDirection == Layout.row;
    window.dispatchEvent(new Event('resize'));
	})

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

      /* This will make sure the grab bar and cursor stay aligned */
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

<div 
  class="GrabBar {directionClassName}" 
  on:mousedown={onMouseDown} 
  bind:this={grabBarElement}
  style="{locked ? 'pointer-events:none' : ''}">
</div>

<style>
  .GrabBar {
    height: 100%;
    width: 100%;
  }
  .GrabBar.vertical {
    cursor: ew-resize;
  }
  .GrabBar.horizontal {
    cursor: ns-resize;
  }
  
</style>