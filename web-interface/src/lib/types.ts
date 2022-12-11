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

export class Field {
  key: string;
  label: string;
  type: string;
  oneofs: {key: string, label: string, type: string}[];

  constructor(key: string, label: string, type: string) {
    this.key = key;
    this.label = label;
    this.type = type;
    this.oneofs = [];
  }

  addOneofList(oneoflist: {key: string, label: string, type: string}[]) {
    this.oneofs = oneoflist;
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

  constructor(key: string, label: string) {
    this.key = key;
    this.label = label;
  }
}