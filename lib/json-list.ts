export type Spec = { label: string; value: string };
export type Swatch = { name: string; hex: string };

function parseArray(value: string): unknown[] {
  try {
    const data = JSON.parse(value);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export const parseList = (value: string): string[] =>
  parseArray(value).filter((x): x is string => typeof x === "string");

export const parseSpecs = (value: string): Spec[] =>
  parseArray(value).flatMap((x) => {
    const o = x as Partial<Spec> | null;
    return o && typeof o.label === "string" && typeof o.value === "string"
      ? [{ label: o.label, value: o.value }]
      : [];
  });

export const parseColors = (value: string): Swatch[] =>
  parseArray(value).flatMap((x) => {
    const o = x as Partial<Swatch> | null;
    return o && typeof o.name === "string" && typeof o.hex === "string"
      ? [{ name: o.name, hex: o.hex }]
      : [];
  });