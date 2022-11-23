<script lang="ts">
	import PreviewList from '../components/PreviewList.svelte';
  import {Device, LayoutDirection} from '../types'

  let devices: Array<Device> = [new Device(1, 'Picture Wall', '#FCB900'), new Device(2, 'Fireplace', '#FCB900')];
</script>

<div class="LightShowStudio">
    <div class="preview-area">
        <PreviewList devices={devices} />
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
    }
    .preview-area {
      height: 400px;
      width: 100vw;
    }
</style>