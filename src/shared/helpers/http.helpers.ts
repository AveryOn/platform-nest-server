export function toWebHeaders(input: Record<string, string | string[] | undefined>): Headers {
  const headers = new Headers()

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item)
      }
      continue
    }
    headers.set(key, value)
  }
  return headers
}
