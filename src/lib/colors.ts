// @ts-ignore
import convert from 'color-convert';

function luminanace(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(rgb1: number[], rgb2: number[]) {
  const lum1 = luminanace(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminanace(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

const contrastCache = new Map<string, string>();

// eslint-disable-next-line import/prefer-default-export
export function getContrastedColor(foreground = '#FFFFFF', background = '#000000'): string {
  if (contrastCache.has(foreground + background)) return contrastCache.get(foreground + background) as string;
  const foregroundRGB = convert.hex.rgb(foreground.slice(1, 7));
  const backgroundRGB = convert.hex.rgb(background.slice(1, 7));
  let ratio = contrast(foregroundRGB, backgroundRGB);
  if (ratio < 4.5) {
    // @ts-ignore
    const [h, s, l] = convert.rgb.hsl(...foregroundRGB);
    const lighterRatio = contrast(convert.hsl.rgb(h, s, l + 1), backgroundRGB);
    const darkerRatio = contrast(convert.hsl.rgb(h, s, l - 1), backgroundRGB);
    let direction = lighterRatio > darkerRatio ? 1 : -1;
    ratio = lighterRatio > darkerRatio ? lighterRatio : darkerRatio;

    let color = convert.hsl.rgb(h, s, l + direction);
    while (ratio < 4.5) {
      color = convert.hsl.rgb(h, s, l + direction);
      if (color[0] < 0 || color[1] < 0 || color[2] < 0) {
        direction = direction > 0 ? -1 : 1;
        // eslint-disable-next-line no-continue
        continue;
      }
      ratio = contrast(color, backgroundRGB);
      direction += direction;
    }
    const resultHex = `#${convert.rgb.hex(color)}`;
    contrastCache.set(foreground + background, resultHex);
    return resultHex;
  }
  contrastCache.set(foreground + background, foreground);
  return foreground;
}
