import React from 'react';
import './App.css';
import Previewer from './Previewer';
import Timeline from './Timeline';
import {Device} from './Types';
import {ColorChangeHandler, ColorResult, TwitterPicker} from 'react-color';

interface AppProps {
}

interface AppState {
  devices: Array<Device>;
  activeDeviceColorPicker: Device | null;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      devices: [
        new Device(1, 'test', '#593af3'),
        new Device(2, 'test', '#593af3')
      ],
      activeDeviceColorPicker: null
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
        <div className="preview-container">
          <Previewer
            devices={this.state.devices}
            onColorIndicatorClick={(device: Device) => this.handleDeviceIndicatorClick(device)}
          />
        </div>
        <div className="toolbar-container">

        </div>
        <div className="timeline-container">
          <Timeline
            devices={this.state.devices}
          />
        </div>
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
