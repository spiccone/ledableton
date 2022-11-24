<script lang="js">
  import { browser } from '$app/env';
	import { onMount, onDestroy } from 'svelte'
  import WaveformData from 'waveform-data';

  const AudioContext = window.AudioContext;

  // //export const audioPath = "/strangeSternum.mp3";

  // const audioContext = new AudioContext();

  // onMount(init);

  // function init() {
    
  // }

  // fetch(audioPath)
  // .then(response => response.arrayBuffer())
  // .then(buffer => {
  //   const options = {
  //     audio_context: audioContext,
  //     array_buffer: buffer,
  //     scale: 128
  //   };

  //   return new Promise((resolve, reject) => {
  //     WaveformData.createFromAudio(options, (err, waveform) => {
  //       if (err) {
  //         reject(err);
  //       }
  //       else {
  //         resolve(waveform);
  //       }
  //     });
  //   });
  // })
  // .then(waveform => {
  //   console.log(`Waveform has ${waveform.channels} channels`);
  //   console.log(`Waveform has length ${waveform.length} points`);
  // });
</script>

<div class="Waveform"></div>