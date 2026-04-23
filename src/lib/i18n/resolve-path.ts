/**
 * Read or write a value by dot path, e.g. "nav.title" on a nested object.
 */

export function getByPath(
  source: unknown,
  path: string,
): string | string[] | Record<string, unknown> | unknown[] | undefined {
  if (!path || !source || typeof source !== "object") return undefined;
  const parts = path.split(".");
  let current: unknown = source;
  for (const p of parts) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;
    if (Array.isArray(current)) {
      const index = Number(p);
      if (!Number.isInteger(index) || index < 0 || index >= current.length) {
        return undefined;
      }
      current = current[index];
    } else {
      current = (current as Record<string, unknown>)[p];
    }
  }
  return current as
    | string
    | string[]
    | Record<string, unknown>
    | unknown[]
    | undefined;
}

export function getString(
  source: unknown,
  path: string,
): string | undefined {
  const v = getByPath(source, path);
  return typeof v === "string" ? v : undefined;
}

export function getStringArray(
  source: unknown,
  path: string,
): string[] | undefined {
  const v = getByPath(source, path);
  if (Array.isArray(v) && v.every((x) => typeof x === "string")) {
    return v as string[];
  }
  return undefined;
}

/**
 * Shallow copy with {{name}} support.
 */
export function interpolate(
  template: string,
  vars?: Record<string, string | number | undefined>,
): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, k: string) => {
    const v = vars[k];
    return v != null ? String(v) : "";
  });
}
