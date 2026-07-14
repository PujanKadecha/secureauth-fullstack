const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Always log server-side, regardless of environment, so real bugs are visible.
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  // Only trust the error's own message for expected/operational errors
  // (AppError). Anything unexpected (DB errors, programming bugs, etc.)
  // gets a generic message in production so internals never leak to clients.
  const isOperational = err.isOperational === true;
  const message =
    isOperational || process.env.NODE_ENV !== "production"
      ? err.message
      : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
