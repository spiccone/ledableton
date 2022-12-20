
export class DeviceDisplay {
  label: string;
  color: string = "#2CCCE4";
  ledPositions: Position[] = [];
  ledColors: Color[] = [];

  previewLeft: number = 0;
  previewTop: number = 0;

  constructor(name: string) {
    this.label = name;
  }
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

export type Value = {
  value: number|string|boolean,
  type: string
}

export type UnitValue = {
  value: number,
  type: "Unit"
}

export type Dimension = {
  unit: UnitValue, 
  dimension: Value
}

export type RepeatedNumber = {
  repeatedNumber: number[];
}

export type FieldValue = 
  number|string|boolean|BucketMessageObject|Dimension|DeviceMessageObject|FieldValue[]|OneOf;

export type DeviceMessageObject = {
  [key: string]: any;
}

export type BucketMessageObject = {
  devices: DeviceMessageObject[];
  selectedDevice: number
  type: "Settings"
}

export type OneOf = {
  selectedIndex: number,
  oneOf: DeviceMessageObject[]
}