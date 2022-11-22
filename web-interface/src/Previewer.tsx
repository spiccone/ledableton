import React from 'react';
import './Previewer.css';
import { render } from '@testing-library/react';
import { Device } from './Types';


function Previewer(props: {devices: Array<Device>, onIndicatorClick: any}) {
  return (
    <div className="DeviceList">
      {props.devices.map(function(device: Device, index: number){
        return <DevicePreview 
          device={device}
          onIndicatorClick={() => props.onIndicatorClick(index)}
          key={device.id}
        />;
      })}
      <AddDevice />
    </div>
  )
}

function DevicePreview(props: {device: Device, onIndicatorClick: React.MouseEventHandler<HTMLButtonElement>}) {
  return (
    <div id={props.device.id} className='DevicePreview'>
      <div className='device-toolbar'>
        <DeviceColorIndicator onClick={props.onIndicatorClick} color={props.device.color} />
        <div className='device-name'>{props.device.label}</div>
      </div>
      <div className='device-display'></div>
    </div>
  );
}

function DeviceColorIndicator(props: {onClick: React.MouseEventHandler<HTMLButtonElement>, color: string}) {
  return (
    <button className="DeviceColorIndicator" onClick={props.onClick} style={{backgroundColor: props.color}}></button>
  )
}

function AddDevice() {
  return (
    <div className='AddDevice'>

    </div>
  );
}

export default Previewer;
