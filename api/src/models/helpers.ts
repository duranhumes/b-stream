import { reject } from '../lib/utils'

/**
 *
 * @param {Model} model
 * @param {array} fields
 *
 * @returns An object with all model
 * properties except fields specified
 */
export function filteredModel(model: any, fields?: string[]): object {
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
