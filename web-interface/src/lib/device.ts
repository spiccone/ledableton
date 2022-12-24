export class DisplayRoom {
  devices: DeviceEffectDisplay[] = [];
}

/**
 * This is to preview the device effect. The positions will be generated on load.
 */
 export class DeviceEffectDisplay {
  deviceDisplay: DeviceDisplay;
  ledPositions: Position[];
  ledColors: Color[];

  constructor(device: DeviceDisplay, positions : Position[]) {
    this.deviceDisplay = device;
    this.ledPositions = positions;
    this.ledColors = [];
    for (const position of positions) {
      this.ledColors.push({r: 0, g: 0, b: 0});
    }
  }
}

/**
 * This is what will be saved to a file.
 */
export class SavedRoom {
  label: string = "Room";
  devices: DeviceDisplay[] = [];
}


/**
 * This is the device info that will be saved for the web interface.
 * We're keeping this seperate from anything generated on load to 
 * make saving easier.
 */
export class DeviceDisplay {
  device: DeviceInRoom;
  label: string;
  color: string = "#2CCCE4";
  previewLeft: number = 0;
  previewTop: number = 0;

  constructor(name: string, device: DeviceInRoom) {
    this.label = name;
    this.device = device;
  }
}

/**
 * This is the device info needed by both the c++ and the web interface.
 */
export class DeviceInRoom {
  settings: SavedDevice;
  positionInRoom: PositionInRoom | null = null;

  constructor(settings: SavedDevice) {
    this.settings = settings;
  }
}

export interface PositionInRoom {

}

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface Position {
  x: number;
  y: number;
}
export class SavedDevice {
  name: string;
  settings: DeviceMessageObject;

  constructor(name: string, settings: DeviceMessageObject) {
    this.name = name;
    this.settings = settings;
  }

  static compare(a: SavedDevice, b: SavedDevice) {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  }
}

export interface Value {
  value: number|string|boolean,
  type: string
}

export interface UnitValue {
  value: number,
  type: "Unit"
}

export interface Dimension {
  unit: UnitValue, 
  dimension: Value
}

export interface RepeatedNumber {
  repeatedNumber: number[];
}

export type FieldValue = 
  number|string|boolean|BucketMessageObject|Dimension|DeviceMessageObject|FieldValue[]|OneOf;

export type DeviceMessageObject = {
  [key: string]: any;
}

export interface BucketMessageObject {
  devices: DeviceMessageObject[];
  selectedDevice: number;
  type: "Settings";
}

export interface OneOf {
  selectedIndex: number,
  oneOf: DeviceMessageObject[]
}