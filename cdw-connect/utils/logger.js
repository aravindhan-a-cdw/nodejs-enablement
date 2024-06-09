const { createLogger, transports, format, error, debug } = require('winston');
const path = require('path');

const options = {
    file: {
        level: 'error',
        filename: path.join(process.env.LOG_LOCATION, 'logs.txt'),
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        colorize: true,
    },
};


const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    ),
    transports: [
        new transports.File(options.file),
        new transports.Console(options.console),
    ]
});

const loggerMiddleware = (req, res, next) => {
    res.once('finish', () => {
        logger.log('info', `${req.method}/${req.httpVersion} ${req.url}    ${res.statusCode}`);
    });
    next();
}

module.exports = { logger, loggerMiddleware };