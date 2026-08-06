/** APIs may return a raw array or `{ value: T[] }` — normalize both. */
export function unwrapList<T>(payload: T[] | { value?: T[] | null } | null | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.value)) return payload.value;
  return [];
}
