export enum ColorLevel {light, medium, dark};

export function getColorLevel(hex: string) {
  const rgb = hexToRgb(hex);
  if (rgb) {
    const hsp = Math.sqrt(
      0.299 * (rgb.r * rgb.r) +
      0.587 * (rgb.g * rgb.g) +
      0.114 * (rgb.b * rgb.b)
    );
    if (hsp>170) {
      return ColorLevel.light;
    } else if (hsp>60) {
      return ColorLevel.medium;
    } else {
      return ColorLevel.dark;
    }
  }
  else return ColorLevel.medium;
}

export function hexToRgb (hex: string): {r:number, g:number, b:number} | null {
  let h = hex[0] == '#' ? hex.slice(1) : hex;
  h[4]||(h=h.replace(/./g,'$&$&'));
  const aRgbHex = h.match(/.{1,2}/g); 
  if (aRgbHex) {
    return {
      r : parseInt(aRgbHex[0], 16),
      g : parseInt(aRgbHex[1], 16),
      b : parseInt(aRgbHex[2], 16)
    };
  }
  return null;
}
