export function style (
  element: HTMLElement,
  attrs: { [key: string]: string }): HTMLElement {
  if (attrs !== undefined) {
    Object.keys(attrs).forEach((key: string) => {
        element.style.setProperty(key, attrs[key]);
    });
  }
  return element;
}