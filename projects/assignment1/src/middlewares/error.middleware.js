export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode ?? 500;

  const response = {
    error: {
      code: error.code ?? "INTERNAL_SERVER_ERROR",
      message:
        statusCode === 500
          ? "Internal server error."
          : error.message,
    },
  };

  if (process.env.NODE_ENV === "development") {
    response.error.stack = error.stack;
  }

  return res.status(statusCode).json(response);
}