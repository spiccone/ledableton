<script lang="js">
  /* TODO - waveform should eventually be created in
  a audio update page and then just read in here */
  import WaveformData from 'waveform-data';

  const AudioContext = window.AudioContext;
  const audioContext = new AudioContext();

  const path = 'src/lib/static/strangeSternum.mp3';

  fetch(path)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const options = {
        audio_context: audioContext,
        array_buffer: buffer,
        scale: 128
      };

      return new Promise((resolve, reject) => {
        WaveformData.createFromAudio(options, (err, waveform) => {
          if (err) {
            reject(err);
          }
          else {
            resolve(waveform);
          }
        });
      });
    })
    .then(waveform => {
      createWaveform(waveform);
    });

    function createWaveform(waveform) {
      const scaleY = (amplitude, height) => {
      const range = 256;
      const offset = 128;

      return height - ((amplitude + offset) * height) / range;
    }

    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;
    const ctx = canvas?.getContext('2d'); 
    ctx.beginPath();

    const channel = waveform.channel(0);

    // Loop forwards, drawing the upper half of the waveform
    for (let x = 0; x < waveform.length; x++) {
      const val = channel.max_sample(x);

      ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
    }

    // Loop backwards, drawing the lower half of the waveform
    for (let x = waveform.length - 1; x >= 0; x--) {
      const val = channel.min_sample(x);

      ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
    }

    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    }
</script>

<div class="Waveform">
  <canvas class="waveformCanvas" id="waveformCanvas"></canvas>
</div>

<style>
  .Waveform {
    width: 100%;
    height: 60px;
  }
  .waveformCanvas {
    width: 100%;
    height: 60px;
  }

</style>