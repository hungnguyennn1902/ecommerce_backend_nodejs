'use strict'
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');

class MyLogger {
    constructor() {
        const formatPrint = printf(({ level, message, context, requestId, timestamp, data }) => {
            return `${timestamp}::${level}::${context}::${requestId}::${message}::${data ? JSON.stringify(data) : ''}`;
        });
        this.logger = winston.createLogger({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                formatPrint
            ),
            transports: [
                new winston.transports.Console(),
                new DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'app-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    maxSize: '1m',
                    maxFiles: '14d',
                    zippedArchive: true,
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'app-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    maxSize: '1m',
                    maxFiles: '14d',
                    zippedArchive: true,
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'error'
                })
            ]
        })
    }
    commonParams(params){
        let context, requestId, data;
        if(!Array.isArray(params)){
            return params;
        }
        else{
            [context, requestId, data] = params;
            return {
                context: context || 'N/A',
                requestId: requestId || 'N/A',
                data: data || {}
            }
        }

    }
    log(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign({
            message
        }, paramLog);
        this.logger.info(logObject);
    }
    error(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign({
            message
        }, paramLog);
        this.logger.error(logObject);
    }
}
module.exports = new MyLogger();