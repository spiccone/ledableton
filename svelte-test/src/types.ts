export enum LayoutDirection {row, column};

export class Device {
  id: number;
  label: string;
  color: string;

  previewElementId: string;
  timelineElementId: string;

  constructor(id: number, label: string, color: string) {
    this.id = id;
    this.previewElementId = "preview_" + id;
    this.timelineElementId = "timeline_" + id;
    this.label = label;
    this.color = color;
  }
}