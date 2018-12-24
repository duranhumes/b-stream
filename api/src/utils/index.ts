import * as uuid from 'uuid/v4'

/**
 *
 * @param {object} obj
 *
 * Check if object is empty
 *
 * @returns boolean
 */
export function isEmpty(obj: object) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false
        }
    }

    return true
}

/**
 *
 * @param {object} obj
 * @param {array} keys
 *
 * Returns new object with only keys
 * specified in keys param
 */
export function pick(obj: object, keys: string[]) {
    return Object.assign(
        {},
        ...keys.map(k => (k in obj ? { [k]: obj[k] } : {}))
    )
}

/**
 *
 * @param {promise} promise
 *
 * Returns the value from a promise and an error if it exists.
 *
 * @returns {array} [value, error]
 */
interface CustomError extends Error {
    code: string | number
}
export async function promisify<E = CustomError>(
    promise: Promise<any>
): Promise<[any | undefined, undefined | E]> {
    try {
        return [await promise, undefined]
    } catch (e) {
        return [undefined, e]
    }
}

/**
 *
 * @param {object} obj
 * @param {array} keys
 *
 * Returns new object without keys
 * specified in keys param
 */
export function reject(obj: object, keys: string[]) {
    return Object.assign(
        {},
        ...Object.keys(obj)
            .filter(k => !keys.includes(k))
            .map(k => ({ [k]: obj[k] }))
    )
}

/**
 *
 * @param {Model} model
 * @param {array} fields
 *
 * @returns An object with all model
 * properties except fields specified
 */
export function filterEntity(model: any, fields?: string[]): object {
    let fieldsToExclude = ['password']
    if (fields) {
        fieldsToExclude = [...fieldsToExclude, ...fields]
    }

    /**
     * If model param is an array of models loop through
     * and return the new array.
     */
    if (Array.isArray(model)) {
        return model.map(m => reject(m, fieldsToExclude))
    }

    return reject(model, fieldsToExclude)
}

/**
 * Converts a long string of bytes into a readable format e.g KB, MB, GB, TB, YB
 *
 * @param {number} bytes The number of bytes.
 *
 * @returns string with formatted size
 */
export function readableBytes(bytes: number): string {
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const convertedBytes = Number((bytes / Math.pow(1024, i)).toFixed(2)) * 1

    return `${convertedBytes}${sizes[i]}`
}

export function formattedUUID() {
    return uuid().replace(/[^a-z0-9]/gi, '')
}
