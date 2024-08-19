const appErr = (message,statusCode)=>{ 
    let error = new Error(message)
    error.statusCode = statusCode? statusCode : 500
    // eslint-disable-next-line no-self-assign
    error.stack = error.stack
    return error
}
export default appErr