export enum LayoutDirection {row, column};

export class Device {
  id: number;
  label: string;
  color: string;
  subDevices: Array<Device>;
  //effects: LinkedList<Effect>;

  previewElementId: string;
  timelineElementId: string;
  previewLeft: number = 0;
  previewTop: number = 0;

  constructor(id: number, label: string, color: string) {
    this.id = id;
    this.previewElementId = "preview_" + id;
    this.timelineElementId = "timeline_" + id;
    this.label = label;
    this.color = color;
    this.subDevices = [];
  }
}

export interface Position {
  left: number;
  top: number;
}

export class SimpleField {
  key: string;
  label: string;
  type: string;

  constructor(key: string, label: string, type: string) {
    this.key = key;
    this.label = label;
    this.type = type;
  }
}
export class Field {
  key: string;
  label: string;
  type: string;
  repeated: boolean = false;
  oneofs: Field[];

  constructor(key: string, label: string, type: string, repeated: boolean) {
    this.key = key;
    this.label = label;
    this.type = type;
    this.oneofs = [];
    this.repeated = repeated;
  }

  addOneofList(oneoflist: Field[]) {
    this.oneofs = oneoflist;
  }
}

export type Unit = {
  selectedUnit: number
}

export type Dimension = {
  unit: Unit, 
  dimension: number
}

export type RepeatedNumber = {
  repeatedNumber: number[];
}

export type FieldValue = number|string|boolean|BucketMessageObject|Dimension|DeviceMessageObject|FieldValue[]|OneOf;

export type DeviceMessageObject = {
  [key: string]: any;
}

export type BucketMessageObject = {
  devices: DeviceMessageObject[];
  selectedDevice: number

}

export type SavedDevice = {
  name: string,
  settings: DeviceMessageObject,
}

export type OneOf = {
  selectedIndex: number,
  oneOf: DeviceMessageObject[]
}