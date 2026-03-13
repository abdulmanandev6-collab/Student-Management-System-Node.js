export function ok(res, data, statusCode = 200) {
    return res.status(statusCode).json({ success: true, data });
}
export function created(res, data) {
    return ok(res, data, 201);
}
export function fail(res, message, statusCode = 400, code, details) {
    return res.status(statusCode).json({
        success: false,
        error: { message, code, details }
    });
}
export function getUserIdFromRequest(req) {
    const anyReq = req;
    return anyReq.user?.sub ?? null;
}
