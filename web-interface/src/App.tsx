import React from 'react';
import './App.css';
import Previewer from './Previewer';
import Timeline from './Timeline';
import {Device} from './Types';
import {ColorChangeHandler, ColorResult, TwitterPicker} from 'react-color';
import { SplitView } from './SplitView';

interface AppProps {
}

interface AppState {
  devices: Array<Device>;
  activeDeviceColorPicker: Device | null;
  timelineHeight: number;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      devices: [
        new Device(1, 'Picture Wall', '#FCB900'),
        new Device(2, 'Fireplace', '#8ED1FC')
      ],
      activeDeviceColorPicker: null,
      timelineHeight: 200,
      
    }
  }

  handleDeviceIndicatorClick(device: Device) {
    this.setState({
      activeDeviceColorPicker: device
    });
  }

  handleDeviceColorChange = (color: ColorResult) => {
    if (this.state?.activeDeviceColorPicker) {
      this.state.activeDeviceColorPicker.color = color.hex;
    }
    this.forceUpdate()
  };

  handleCloseDeviceColorPicker = () => {
     this.setState({
      activeDeviceColorPicker: null
     });
  };
  
  render() {
    return (
      <div className="App">
        <SplitView 
          top={
            <Previewer
              devices={this.state.devices}
              onColorIndicatorClick={(device: Device) => this.handleDeviceIndicatorClick(device)}
            />
          }
          middle={
            <div></div>
          }
          bottom={
            <Timeline
              devices={this.state.devices}
            />
          }
        />
        {this.state.activeDeviceColorPicker ? 
          <DeviceColorPicker 
            device={this.state.activeDeviceColorPicker} 
            onSelect={this.handleDeviceColorChange}
            handleClose={this.handleCloseDeviceColorPicker}
          /> : null
        }
      </div>
      
    );
  }
}

function DeviceColorPicker(props: {device: Device, onSelect: ColorChangeHandler, handleClose: any}) {
  const el = document.getElementById(props.device.previewElementId)?.querySelector('.DeviceColorIndicator');
  const elRect = el?.getBoundingClientRect();

  return (
    <div>
      <div 
        className="DeviceColorPicker" 
        style={{
          left: elRect ? (elRect.left + elRect.width/2) + 'px' : '0',
          top: elRect ? elRect.bottom + 'px' : '0',
        }}>
        <TwitterPicker color={ props.device.color } onChangeComplete={props.onSelect}/>
      </div>
      <div className="cover" onClick={props.handleClose}></div>
    </div>
  )
}

export default App;
