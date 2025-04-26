export const logger = (req, _, next) => {
    req.time = new Date(Date.now()).toString()
    console.log({
        hostname: req.hostname,
        path: req.path,
        params: req.params,
        time: req.time,
        method: req.method,
        body: req.body,
        file: req.file,
    })
    next()
}
