const FORBIDDEN_KEYS = new Set([
  'accessToken',
  'refreshToken',
  'password',
  'otp',
  'cookie',
  'cookies',
  'authorization',
  'headers',
])

export function sanitizeContext(input?: Record<string, any>): Record<string, any> | undefined {
  if (!input) return undefined

  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(input)) {
    if (FORBIDDEN_KEYS.has(k)) continue

    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = sanitizeContext(v as Record<string, any>)
      continue
    }
    out[k] = v
  }
  return out
}
