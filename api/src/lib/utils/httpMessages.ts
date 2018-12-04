export function code500(
    response = {},
    message = 'Something went wrong please try again.'
) {
    return {
        response,
        message,
    }
}

export function code422(
    response = {},
    message = 'Required fields are missing.'
) {
    return {
        response,
        message,
    }
}

export function code403(response = {}, message = 'Access Denied.') {
    return {
        response,
        message,
    }
}

export function code401(response = {}, message = 'Unauthorized.') {
    return {
        response,
        message,
    }
}

export function code404(response = {}, message = 'Resource Not Found.') {
    return {
        response,
        message,
    }
}

export function code204(response = {}, message = 'Resource Found.') {
    return {
        response,
        message,
    }
}

export function code200(response = {}, message = 'Success.') {
    return {
        response,
        message,
    }
}

export function code409(response = {}, message = 'User already exists.') {
    return {
        response,
        message,
    }
}
