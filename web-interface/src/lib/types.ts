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
  value: number | (number | number[])[];
  unitKey: number | null;
  oneofKey: number;
  boolean = false;

  constructor(key: string, unitKey: number | null) {
    this.key = key;
    this.value = 0;
    this.unitKey = unitKey;
    this.oneofKey = 0;
  } 

  getValueLength(index?: number) {
    if(Array.isArray(this.value)) {
      if (index === undefined) {
        return this.value.length;
      } else if (index < this.value.length) {
        const nested = this.value[index];
        if (Array.isArray(nested)) {
          return nested.length;
        }
      }
    }
    return -1;
  }

  getValue(i?: number, j?: number) {
    if (i === undefined) {
      return this.value;
    }
    if (Array.isArray(this.value)) {
      if (i >= this.value.length) {
        return null;
      }
      if (j === undefined) {
        return this.value[i];
      }
      const nested = this.value[i];
      if (Array.isArray(nested) && j < nested.length) {
        return j;
      }
    }
    return null;
  }

  getValueAsArray(i?: number) {
    if (!Array.isArray(this.value)) {
      return [this.value]
    }
    if (i === undefined) {
      return this.value;
    }
    if (i < this.value.length) {
      const nested = this.value[i];
      if (Array.isArray(nested)) {
        return nested;
      }
      return [nested];
    }
    return [];
  }

  addToValue(value: number|number[], index?: number) {
    if (!Array.isArray(this.value)) {
      return false;
    }
    if (index === undefined) {
      this.value.push(value);
      return true;
    }
    if (!Array.isArray(value) && 
      index < this.value.length) {
        const nested = this.value[index];
        if (Array.isArray(nested)) {
          nested.push(value);
          return true;
        }
    }
    return false;
  }

  popFromValue(index?: number) {
    if (!Array.isArray(this.value)) {
      return null;
    }
    if (index === undefined) {
      return this.value.pop();
    }
    if (index < this.value.length) {
      const nested = this.value[index];
        if (Array.isArray(nested)) {
          return nested.pop();
        }
    }
    return null;
  }

  updateValue(value: number|number[], i?: number, j?: number) {
    if (i === undefined) {
      this.value = value;
      return true;
    }
    if (Array.isArray(this.value)) {
      if (i >= this.value.length) {
        return false;
      }
      if (j === undefined) {
        this.value[i] = value;
        return true;
      }
      if (Array.isArray(value)) {
        return false;
      }
      const nested = this.value[i];
      if (Array.isArray(nested) && j < nested.length) {
       nested[j] = value;
       return true;
      }
    }
    return false;
  }
}


  // addToRepeatedValue(value: number[] | number) {
  //   if (typeof value === "number") {
  //     this.repeatedValue.push(value);
  //   } else {
  //     this.nestedRepeatedValue.push(value);
  //   }
  // }

  // removeFromRepeatedValue() {
  //   this.repeatedValue.pop();
  //   this.nestedRepeatedValue.pop();
  // }

  // addToNestedRepeatedValue(index: number, value: number) {
  //   if (index < this.nestedRepeatedValue.length) {
  //     this.nestedRepeatedValue[index].push(value);
  //   }
  // }
  // removeFromNestedRepeatedValue(index: number) {
  //   if (index < this.nestedRepeatedValue.length) {
  //     this.nestedRepeatedValue[index].pop();
  //   }
  // }
// }

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
  type: DeviceType | null = null;
  fields: DeviceFieldValue[] | null = null;
  bucket: SavedDevice | null = null;
  bucketType: DeviceType | null = null;
  bucketFields: DeviceFieldValue[] | null = null;

  constructor(key: string, label: string) {
    this.key = key;
    this.label = label;
  }
}