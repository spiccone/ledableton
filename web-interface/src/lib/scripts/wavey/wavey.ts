
import FFT from './fft';
import {style} from './util';
import WebAudio from './webAudio';

interface WaveyParams {
  containerId:string;
  pxPerSecond?: number;
}

export class Wavey {
  audioBuffer:AudioBuffer|null = null;
  audioContext:AudioContext;
  canvases:Array<HTMLElement>;
  duration:number|null = null;
  height:number = 60;
  maxCanvasWidth:number = 4000;
  pxPerSecond:number = 20;
  source: AudioBufferSourceNode|null = null;
  wrapper: HTMLElement;

  playline: HTMLElement;

  playing = false;

  webAudio: WebAudio|null = null;

  isReady:boolean = false;

  static create(params: WaveyParams) {
    const wavey = new Wavey(params);
    return wavey.init();
  }

  constructor(params: WaveyParams) {
    window.AudioContext = window.AudioContext;
    this.audioContext = new AudioContext();
    const container = document.querySelector('#' + params.containerId);
    if (!container) {
      throw new Error('Container element not found');
    }
    this.wrapper = document.createElement('div');
    style(this.wrapper, {
          width: '100%',
          overflowX: 'scroll',
          overflowY: 'hidden',
          'white-space': 'nowrap',
    })
    container.appendChild(this.wrapper);
    this.canvases = [];

    this.playline = document.createElement('div');
    style(this.playline, {
          width: '1px',
          height: this.height + 'px',
          position: 'absolute',
          background: '#fff'
    })
    this.wrapper.appendChild(this.playline);
  }

  init() {
    return this;
  }

  load(audioPath: string) {
    const load = (audioPath: string) => {
      fetch(audioPath)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => this.run(audioBuffer));
    };
    return load(audioPath);
  }

  filterData(audioBuffer: AudioBuffer): Array<number> {
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const pixelsPerSecond = 100;
    const samples = audioBuffer.duration * pixelsPerSecond - 1; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    let max = 0;
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      const value = sum/blockSize;
      max = Math.max(max, value);
      filteredData.push(value); // divide the sum by the block size to get the average
    }
    return this.normalizeData(filteredData, max);
  }

  normalizeData(filteredData: Array<number>, max: number): Array<number> {
    if (max && max != 0) {
      const multiply = 1/max;
      for (let i=0; i<filteredData.length; i++) {
        filteredData[i] = multiply * filteredData[i];
      }
    }
    return filteredData;
  }

  center(time: number) {
    const wrapper = this.wrapper;
    console.log(wrapper.getBoundingClientRect().right);
    wrapper.scrollLeft = time;
  }

  draw(normalizedData: number[]) {
    if (!this.duration) {
      throw Error("Duration not set");
    }
    let numberOfCanvases = normalizedData.length / this.maxCanvasWidth;

    for(let i=0; i<numberOfCanvases; i++) {
      this.drawIndividual(normalizedData, i);
    }

    for (const canvas of this.canvases) {
      this.wrapper.appendChild(canvas);
    }
  }

  drawIndividual(
    normalizedData: number[], 
    canvasIndex: number) {
    let startIndex = this.maxCanvasWidth * canvasIndex;
    let width = this.maxCanvasWidth;
    if (startIndex + width >= normalizedData.length) {
      width = normalizedData.length - startIndex;
    }
    const canvas = document.createElement('canvas');
    canvas.id = "wavey-canvas-" + canvasIndex;
    canvas.height = this.height;
    canvas.width = width;
    style(canvas, {
      display: 'inline-block'
    });

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw Error("No ctx");
    }
    for (let i = 0; i < width; i++) {
      let height = normalizedData[startIndex + i] * canvas.height;
      if (height < 0) {
          height = 0;
      }
      //this.drawLineSegment(ctx, x, height, width, (i + 1) % 2 == 0);
      this.drawBlock(ctx, i, canvas.height - height, height, 1);
    }
    this.canvases.push(canvas);
  }

  drawBlock(ctx: CanvasRenderingContext2D, 
            x: number, 
            y: number,
            height: number, 
            width: number) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, 1, height);
  }

  drawLineSegment(ctx: CanvasRenderingContext2D, 
                  x: number, 
                  height: number, 
                  width: number, 
                  isEven: boolean){
  }

  run(audioBuffer: AudioBuffer) {
    this.audioBuffer = audioBuffer;
    this.duration = audioBuffer.duration;
    this.draw(this.filterData(audioBuffer));
    return this;
  }

  play() {
    if (this.source) {
      this.source.stop();
      this.source = null;
      this.playing = false;
    } else {
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = this.audioBuffer;
      this.source.connect(this.audioContext.destination);
      this.source.start(0, 0, 200);
      this.resumeAudioContext();
      this.center(200);
      this.playing = true;
      this.update();
    }
  }

  resumeAudioContext() {
    if (this.audioContext.state == 'suspended') {
      this.audioContext.resume;
    }
  }

  update() {
    if(this.playing) {
      style(this.playline, {
        left: this.audioContext.currentTime + 'px'
      });

      this.update();
    }
  }

  fft(audioBuffer: AudioBuffer): Array<Array<Uint8Array>> {
    const fftSamples = 512;
    const buffer = audioBuffer;

    const uniqueSamplesPerPx = buffer.length / 500;
    let noverlap = Math.max(0, Math.round(fftSamples - uniqueSamplesPerPx));

    const fft = new FFT(
      fftSamples,
      audioBuffer.sampleRate,
      'hann',
      1
    );
    const frequencies : Array<Array<Uint8Array>> = [];

    const channelData = buffer.getChannelData(0);
    const channelFreq = [];
    let currentOffset = 0;

    while (currentOffset + fftSamples < channelData.length) {
        const segment = channelData.slice(
            currentOffset,
            currentOffset + fftSamples
        );
        const spectrum = fft.calculateSpectrum(segment);
        const array = new Uint8Array(fftSamples / 2);
        let j;
        for (j = 0; j < fftSamples / 2; j++) {
            array[j] = Math.max(-255, Math.log10(spectrum[j]) * 45);
        }
        channelFreq.push(array);
        // channelFreq: [sample, freq]

        currentOffset += fftSamples - noverlap;
    }
    frequencies.push(channelFreq);
    // frequencies: [channel, sample, freq]

    return frequencies;
  }
}