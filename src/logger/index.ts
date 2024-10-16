import * as winston from 'winston'

const { combine, timestamp, printf, colorize } = winston.format

const excludeErrorLevel = winston.format(info => (info.level === 'error' ? false : info))

const infoLogFormat = combine(
  timestamp(),
  excludeErrorLevel(),
  printf(info => {
    if (typeof info.message === 'string') return info.message

    return `${info.timestamp} | [${info.level.toUpperCase()}] - [HTTP "${info.message.method.toUpperCase()}"]: "${info.message.url}"${Object.keys(info.message.body).length > 0 ? ' | Body: ' + JSON.stringify(info.message.body, null, 2) : ''}${Object.keys(info.message.query).length > 0 ? ' | Query: ' + JSON.stringify(info.message.query, null, 2) : ''}`
  })
)

const errorLogFormat = combine(
  timestamp(),
  printf(info => {
    return `${info.timestamp} | [${info.level.toUpperCase()}] - [HTTP "${info.method}"] - [${info.statusCode}]: "${info.url}" | "${info.error || 'Error'}" | "${info.message}"${Object.keys(info.body).length > 0 ? ' | Body: ' + JSON.stringify(info.body, null, 2) : ''}${Object.keys(info.query).length > 0 ? ' | Query: ' + JSON.stringify(info.query, null, 2) : ''}`
  })
)

const Logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'info.log',
      level: 'info',
      format: infoLogFormat,
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: errorLogFormat,
    }),
    new winston.transports.Console({
      level: 'info',
      format: infoLogFormat,
    }),
    new winston.transports.Console({
      level: 'error',
      format: errorLogFormat,
    }),
  ],
})

export default Logger
