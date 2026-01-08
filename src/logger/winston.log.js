'use strict'
const winston = require('winston')
const { combine, timestamp, printf } = winston.format;
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(
        timestamp(
            { format: 'YYYY-MM-DD HH:mm:ss' }
        ),
        printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), 
        new winston.transports.File({dirname:'logs', filename: 'app.log' })
    ]
})
module.exports = logger