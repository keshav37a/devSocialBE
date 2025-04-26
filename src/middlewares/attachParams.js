/* eslint-disable security/detect-object-injection */
export const attachParams = (params = []) => {
    return (req, _, next) => {
        params.forEach(({ key, value }) => (req[key] = value))
        next()
    }
}
