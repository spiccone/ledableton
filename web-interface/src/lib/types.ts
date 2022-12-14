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

/* The repated values are listed separately and not null so we can bind to them. */
export class DeviceFieldValue {
  key: string;
  type: string;
  value: number | number[] | number[][] = 0;
  unitKey: number | null;
  oneofKey: number = 0;
  oneOfKeys: string[] = [];

  repeated: boolean = false;
  nestedRepeated: boolean = true;

  constructor(key: string, type: string, unitKey?: number|null) {
    this.key = key;
    this.type = type;
    this.unitKey = unitKey ? unitKey : null;
  }

  getKey() {
    if (this.oneOfKeys.length > 0) {
      return this.oneOfKeys[this.oneofKey];
    }
    return this.key;
  }

  getValue() {
    if (this.unitKey !== null && !Array.isArray(this.value)) {
      return {unit: this.unitKey, dimension: this.value};
    }
    return this.value;
  }

  addToValue(value: number | number[]) {}
  addToNestedValue(index: number, value: number) {}
  removeFromValue() {}
  removeFromNestedValue(index: number) {}
}

export class RepeatedDeviceFieldValue extends DeviceFieldValue {
  value: number[] = [];

  addToValue(value: number) {
    this.value.push(value);
  }
  removeFromValue() {
    this.value.pop();
  }
}

export class NestedRepeatedDeviceFieldValue extends DeviceFieldValue {
  value: number[][] = [];

  addToValue(value: number[]) {
    this.value.push(value);
  }
  addToNestedValue(index: number, value: number) {
    if (index < this.value.length) {
      this.value[index].push(value);
    }
  }
  removeFromValue() {
    this.value.pop();
  }
  removeFromNestedValue(index: number) {
    if (index < this.value.length) {
      this.value[index].pop();
    }
  }
}

export type Dimension = {
  unit:number, dimension:number
}

export type DeviceMessageObject = {
  [key: string]: number|number[]|number[][]|DeviceMessageObject;
}

export class DeviceType {
  key: string = "";
  type: string = "";
  label: string = "";
  fields: Field[] = [];
}

export class SavedDevice {
  key: string;
  label: string;
  type: DeviceType | null = null;
  fields: DeviceFieldValue[] | null = null;
  bucketType: DeviceType | null = null;
  bucketFields: DeviceFieldValue[] | null = null;

  constructor(key: string, label: string) {
    this.key = key;
    this.label = label;
  }
}