<script lang="ts">
  import WaveSurfer from 'wavesurfer.js';
  import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js';
  import {onMount} from 'svelte';
  import {LayoutDirection as Layout} from "../types";

  export let layoutDirection: Layout = Layout.column;
  export let minimapSelector: string|undefined;

  let wavesurfer: WaveSurfer; 

  const plugins = minimapSelector ? [
                          MinimapPlugin.create({
                              container: minimapSelector,
                              waveColor: '#777',
                              progressColor: '#222',
                              height: 50
                          })] : [];

  onMount(() => {
    wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#888',
      progressColor: '#666',
      height: 40,
      fillParent: false,
      normalize: true,
      scrollParent: true,
      minPxPerSec: 100,
      plugins: plugins
    });

    wavesurfer.load('src/lib/static/strangeSternum.mp3');

    wavesurfer.on('ready', function () {
    });
  });

</script>

<div class="AudioDisplay">
  <div id="waveform"></div>
</div>

<style>
  .AudioDisplay {

  }
  #waveform {
    height: 40px;
  }

</style>