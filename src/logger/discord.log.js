require('dotenv').config();
const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
})


client.on('clientReady', () => {
    console.log(`Discord 1 Logger is online as ${client.user.tag}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on('messageCreate', (message) => {
   if (message.author.bot) return;
   if(message.content === 'ping'){
       message.reply('pong');
   }
});