import React from 'react';
import './Timeline.css';
import { Device } from './Types';

const audioContext = new AudioContext();


function Timeline(props: {devices: Array<Device>}) {
  return (
    <div className='Timeline'>
      <div className='TimelineList'>
        {props.devices.map(function(device: Device){
          return <DeviceTimeline 
            device={device}
            key={device.timelineElementId}
          />;
        })}
      </div>
      <Scrubber />
    </div>
  )
}

function DeviceTimeline(props: {device: Device}) {
  return (
    <div className='DeviceTimeline'>
      <div className='device-label-container' style={{backgroundColor: props.device.color}}>
        <div className='device-label'>
          {props.device.label}
        </div>
      </div>
    </div>
  );
}

function Scrubber() {
  return (
    <div className='Scrubber'></div>
  )
}

export default Timeline;
