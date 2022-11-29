enum Status {PLAYING, PAUSED, FINISHED};

declare global {
  interface Window { 
    WaveyAudioContext: AudioContext; 
    webkitAudioContext: typeof AudioContext;
  }
}

interface WaveyAudioParams {
  audioBuffer: AudioBuffer;
  audioContext: AudioContext;
}

export default class WebAudio {

  static scriptBufferSize = 256;
  audioBuffer: AudioBuffer;
  audioContext: AudioContext;
  lastPlay = 0;
  source:AudioBufferSourceNode|null = null;
  startPosition = 0;
  schduledPause:number|null = null;
  /** gainNode: allows to control audio volume */
  gainNode:GainNode|null = null;
  sinkAudioElement:HTMLAudioElement|null  = null;
  sinkStreamDestination:MediaStreamAudioDestinationNode|null = null;

  supportsWebAudio() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  getAudioContext() {
    if (!window.WaveyAudioContext) {
        window.WaveyAudioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
    }
    return window.WaveyAudioContext;
  }

  constructor(params: WaveyAudioParams) {
    if (!this.supportsWebAudio()) {
      throw Error ('Audio context not supported');
    }
    this.audioBuffer = params.audioBuffer;
    this.audioContext = params.audioContext;
  }

  init() {
    this.createVolumeNode();
    //this.createAnalyserNode();
  }

  createVolumeNode() {
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  setSinkId(deviceId: string): Promise<HTMLAudioElement> {
    if (deviceId) {
        /**
         * The webaudio API doesn't currently support setting the device
         * output. Here we create an HTMLAudioElement, connect the
         * webaudio stream to that element and setSinkId there.
         */
        if (!this.sinkAudioElement) {
          this.sinkAudioElement = new window.Audio();
          // autoplay is necessary since we're not invoking .play()
          this.sinkAudioElement.autoplay = true;
        }
        if (!this.sinkAudioElement.setSinkId) {
          return Promise.reject(
              new Error('setSinkId is not supported in your browser')
          );
        }
        if (!this.sinkStreamDestination) {
          this.sinkStreamDestination = this.audioContext.createMediaStreamDestination();
        }
        //this.gainNode.disconnect();
        // this.gainNode.connect(this.sinkStreamDestination);
        this.sinkAudioElement.srcObject = this.sinkStreamDestination.stream;

        return this.sinkAudioElement.setSinkId(deviceId);
    } else {
      return Promise.reject(new Error('Invalid deviceId: ' + deviceId));
    }
  }

  play(start:number, end:number) {
    this.createSource();
    this.source?.start(start);
    this.resumeAudioContext();
  }

  createSource() {
    this.disconnectSource();
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
  }

  disconnectSource() {
    if (this.source) {
        this.source.disconnect();
    }
  }

  resumeAudioContext() {
    if (this.audioContext.state == 'suspended') {
        this.audioContext.resume && this.audioContext.resume();
    }
  }

}

