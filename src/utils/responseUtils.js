import { REQUEST_STATUS } from '#Config/keys'

export const sendStandardResponse = (res, { message, data, error }) => {
    let status, _message, _data, _error
    if (error) {
        status = error.cause ? error.cause : REQUEST_STATUS.SERVER_ERROR
        _error = {
            message,
            data,
        }
    } else {
        _data = data
        _error = null
    }
    if (!status) {
        status = REQUEST_STATUS.SUCCESS
    }
    if (!message) {
        _message = null
    }
    if (!data) {
        _data = null
    }
    res.status(status.statusCode).json({
        status,
        message: _message,
        data: _data,
        error: _error,
    })
}
