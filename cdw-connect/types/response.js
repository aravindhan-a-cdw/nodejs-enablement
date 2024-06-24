const {logger} = require('../config/logger');


class HTTPError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function formatResponse(req, res, next) {
  const responseData = res.locals.responseData;

  if (!responseData) {
    return next();
  }
  res.status(responseData.statusCode || 200).json({
    success: true,
    statusCode: responseData.statusCode || 200,
    data: responseData.data || null,
    message: responseData.message || null,
  });
}

function errorHandler(err, req, res, next) {
  if (err instanceof HTTPError) {
    res.status(err.statusCode || 500).json({
      success: false,
      statusCode: err.statusCode || 500,
      message: err.message || "Unexpected error!",
    });
  } else {
    logger.error(err.stack);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: err.message || "Unexpected error",
    });
  }
}

module.exports = { formatResponse, HTTPError, errorHandler };
