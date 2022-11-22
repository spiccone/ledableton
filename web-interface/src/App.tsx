import React from 'react';
import './App.css';
import Previewer from './Previewer';
import { Device } from './Types';
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
        {id: 'device_1', label: 'test', color: '#593af3'},
        {id: 'device_2', label: 'test2', color: '#593af3'}],
      activeDeviceColorPicker: null
    }
  }

  handleDeviceIndicatorClick(deviceIndex: number) {
    this.setState({
      activeDeviceColorPicker: this.state.devices[deviceIndex]
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
        <div className="Previewer">
          <Previewer
            devices={this.state.devices}
            onIndicatorClick={(deviceIdex: number) => this.handleDeviceIndicatorClick(deviceIdex)}
          />
        </div>
        <div className="Toolbar">

        </div>
        <div className="Timeline">

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
  const el = document.getElementById(props.device.id)?.querySelector('.DeviceColorIndicator');
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
