// Centralized error handler
function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const payload = {
    error: err.message || "Internal Server Error",
    requestId: req.id,
  };
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }
  // Basic logging
  console.error(`[ERROR ${req.id}]`, err);
  res.status(status).json(payload);
}

module.exports = { errorHandler };
