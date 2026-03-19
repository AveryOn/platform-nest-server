export function isObject<T>(v: T): v is T {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}
