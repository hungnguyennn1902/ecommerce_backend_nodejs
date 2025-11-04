'use strict'
const discordLogger = require('../logger/discord.logv2');
const logDiscordMiddleware = (req, res, next) => {
    try{
        discordLogger.sendToFormatCode({
            title: `Method: ${req.method}`,
            message: `${req.get('host')}${req.originalUrl}`,
            code: req.method === 'GET' ? req.query : req.body
        })
        next();
    }catch(err){
        next(err);
    }
}
module.exports = logDiscordMiddleware;