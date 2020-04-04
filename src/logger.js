module.exports.dataJsonFile = require('./data.json');
const winston = require('winston');

const log = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),

    winston.format.errors({
      stack: true,

    }),
    // winston.format.splat(),
    winston.format.json(),
  ),
  defaultMeta: {
    service: 'hw1',
  },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new winston.transports.File({
      filename: './src/logs/error.log',
      level: 'error',
    }),

    new winston.transports.File({
      filename: './src/logs/combined.log',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  log.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.simple(),
    ),
  }));
}

module.exports.log = log;