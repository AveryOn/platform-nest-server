import { type Request } from 'express'

export function toWebHeaders(req: Request): Headers {
  const headers = new Headers()

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item)
      continue
    }

    if (value !== undefined) {
      headers.set(key, value)
    }
  }

  return headers
}
