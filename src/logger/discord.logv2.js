'use strict'
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages
            ]
        })
        this.channelId = process.env.LOG_CHANNEL_ID_DISCORD;
        this.client.once('clientReady', () => {
            console.log(`Discord Logger is online as ${this.client.user.tag}`);
        });
        this.client.login(process.env.DISCORD_BOT_TOKEN);
    }
    sendToFormatCode(logData) {
        const { code, message = 'message', title = 'title' } = logData;
        const codeMessage = {
            content: message,
            embeds: [{
                color: parseInt('0xFF0000', 16),
                title,
                description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
            }]
        };
        this.sendToMessage(codeMessage);
    }
    sendToMessage(message = 'message') {
        console.log(`Channel ID:`, this.channelId);
        const channel = this.client.channels.cache.get(this.channelId);
        if (!channel) {
            console.error('Log channel not found');
            return;
        }
        channel.send(message).catch(err => console.error('Error sending log message:', err));
    }

}
module.exports = new LoggerService();