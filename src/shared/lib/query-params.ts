export function parseListParam(value: string | undefined | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

export function serializeListParam(values: string[]): string {
  return values.join(",");
}
