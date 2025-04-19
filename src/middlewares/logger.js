export const logger = (req, _, next) => {
    req.time = new Date(Date.now()).toString()
    console.log({
        hostname: req.hostname,
        path: req.path,
        time: req.time,
        method: req.method,
        body: req.body,
        params: req.params,
    })
    next()
}
