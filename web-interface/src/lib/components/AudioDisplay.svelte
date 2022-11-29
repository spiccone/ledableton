<script lang="ts">
  import WaveSurfer from 'wavesurfer.js';
  import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js';
  import {afterUpdate, onMount} from 'svelte';
  import {LayoutDirection as Layout} from "../types";

  export let layoutDirection: Layout = Layout.column;
  export let minimapId: string|undefined;
  export let vertical: boolean = false;

  let horizontalWave: WaveSurfer; 

  onMount(() => {
    horizontalWave = WaveSurfer.create({

      container: '#waveform',
      waveColor: '#000',
      progressColor: '#666',
      barWidth: 3,
      height: 40,
      fillParent: false,
      normalize: true,
      scrollParent: true,
      minPxPerSec: 200,
      plugins: [MinimapPlugin.create({
                    container: '#' + minimapId,
                    waveColor: '#777',
                    progressColor: '#222',
                    height: 30
                })]
    });

    horizontalWave.load('src/lib/static/bothOfUs.mp3');

    horizontalWave.on('ready', function () {
    //horizontalWave.play();
    });
  });

  afterUpdate(() => {

  });


</script>

<div class="AudioDisplay">
  <div id="waveform" class="{vertical ? 'vertical' : ''}"></div>
</div>

<style>
  .AudioDisplay {

  }
  #waveform {
    
  }
  #waveform.vertical {
    display: flex;
    height: 400px;
  }

</style>