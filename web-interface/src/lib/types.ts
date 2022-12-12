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

export class DeviceFieldValue {
  key: string;
  nestedRepeatedValue: number[][];
  value: number;
  unitKey: number | null;
  oneofKey: number;

  constructor(key: string, value: number, unitKey: number | null, oneofKey: number | null) {
    this.key = key;
    this.value = value;
    this.unitKey = unitKey;
    this.oneofKey = oneofKey ? oneofKey : 0;
    this.nestedRepeatedValue = [];
  }

  addToRepeatedValue(value: number[]) {
    this.nestedRepeatedValue.push(value);
  }

  removeFromRepeatedValue() {
    this.nestedRepeatedValue.pop();
  }

  addToNestedRepeatedValue(index: number, value: number) {
    this.nestedRepeatedValue[index].push(value);
  }

  removeFromNestedRepeatedValue(index: number) {
    this.nestedRepeatedValue[index].pop();
  }
}

export class DeviceType {
  key: string;
  label: string;
  fields: Field[];

  constructor(key: string, label: string, fields: Field[]) {
    this.key = key;
    this.label = label;
    this.fields = fields;
  }
}

export class SavedDevice {
  key: string;
  label: string;
  fields: DeviceFieldValue[];

  constructor(key: string, label: string, fields: DeviceFieldValue[]) {
    this.key = key;
    this.label = label;
    this.fields = fields;
  }
}