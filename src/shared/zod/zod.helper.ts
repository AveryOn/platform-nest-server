import z from 'zod'

/** accepts 'true' & 'false' string values  */
export const zBool = () =>
  z
    .enum(['true', 'false'])
    .default('true')
    .transform((v) => v === 'true')

/**
 * Creates a Zod schema that accepts a string in JSON format
 * and transforms it into a JavaScript value via JSON.parse.
 *
 * If parsing fails, the transformation returns undefined.
 *
 * @returns Zod schema that transforms a JSON string into a JS object or primitive.
 */
export const zJson = () =>
  z.string().transform((v) => {
    try {
      return JSON.parse(v)
    } catch (err) {}
  })

export const zNumberSoft = () => z.coerce.number()