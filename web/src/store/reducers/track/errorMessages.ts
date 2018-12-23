export const badDataErrorMsg = (fields?: string[], overwrite?: any) => ({
    fields,
    error: true,
    message: 'Please check the fields in red',
    ...overwrite,
})

export const genericErrorMsg = (overwrite?: any) => ({
    fields: [],
    error: true,
    message: 'Something went wrong please try again',
    ...overwrite,
})

export const authErrorMsg = (overwrite?: any) => ({
    fields: [],
    error: true,
    message: 'You need to be logged in to upload music',
    ...overwrite,
})
