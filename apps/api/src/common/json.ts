export const parseJsonArray = <T>(value: string | null | undefined, fallback: T[] = []) => {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
};

export const stringifyArray = (value: unknown) => JSON.stringify(Array.isArray(value) ? value : []);
