
export const DATE_FACTOR = {
    'Y': 365 * 24 * 60 * 60 * 1000,      // Year 
    'y': 365 * 24 * 60 * 60 * 1000,      // Year 
    'M': 30 * 24 * 60 * 60 * 1000,       // Month 
    'D': 24 * 60 * 60 * 1000,            // Day
    'd': 24 * 60 * 60 * 1000,            // Day
    'H': 60 * 60 * 1000,                 // Hour
    'h': 60 * 60 * 1000,                 // Hour
    'm': 60 * 1000,                      // Minute
    's': 1000,                           // Second
    'S': 1000,                           // Second
} as const

type DateUnit = keyof typeof DATE_FACTOR
type Num = `${number}`

export type DATE_KEY = `${Num}${DateUnit}`

function excludeNumberOfFactor(value: DATE_KEY) {
    const chunks = value.split('')
    const word = chunks.pop()
    const num = +chunks.join('')
    const factor = DATE_FACTOR[word!]

    if(Object.is(num, Number.NaN)) return null;
    if(!factor) return null;
    return { word, num, factor }
} 

export function appendDatetime(value: DATE_KEY): number | null {
    const data = excludeNumberOfFactor(value)
    if(!data) return null

    return data.num * data.factor + Date.now();
}

export function computeAppendTime(value: DATE_KEY) {
    const data = excludeNumberOfFactor(value)
    if(!data) return null

    return data.num * data.factor
}
