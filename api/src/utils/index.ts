import * as uuid from 'uuid/v4'
import * as escape from 'escape-html'

/**
 * Check if object is plain or has extra properties
 * like a date object.
 *
 * @param {object} obj
 *
 * @returns boolean
 */
export function isPlainObject(obj: object) {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        obj.constructor === Object &&
        Object.prototype.toString.call(obj) === '[object Object]'
    )
}

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
        return model.map(m => {
            for (const key in m) {
                if (
                    m[key] &&
                    typeof m[key] === 'object' &&
                    !(m[key] instanceof Date)
                ) {
                    Object.assign(m, {
                        [key]: filterEntity(m[key], fieldsToExclude),
                    })
                }
            }

            return reject(m, fieldsToExclude)
        })
    }

    for (const key in model) {
        if (
            model[key] &&
            typeof model[key] === 'object' &&
            !(model[key] instanceof Date)
        ) {
            Object.assign(model, {
                [key]: filterEntity(model[key], fieldsToExclude),
            })
        }
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

/**
 * Boils uuid string down to only numbers and letters
 *
 * @returns string
 */
export function formattedUUID() {
    return uuid().replace(/[^a-z0-9]/gi, '')
}

/**
 * Escapes and removed all extra spaces
 *
 * @param str string to be escaped
 *
 * @returns string
 */
export function escapeString(str: string) {
    return escape(String(str))
        .replace(/\s+/g, ' ')
        .trim()
}
