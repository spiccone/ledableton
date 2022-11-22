import React from 'react';
import './Timeline.css';
import { Device } from './Types';


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
      <div className='DeviceColor' style={{backgroundColor: props.device.color}}></div>
    </div>
  );
}

function Scrubber() {
  return (
    <div className='Scrubber'></div>
  )
}

export default Timeline;
