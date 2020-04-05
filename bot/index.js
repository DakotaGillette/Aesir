/*

Client ID: 686957308286337051
Client Secret: XYxxN8lSgWTdHZho_XUxwooaRcjMp7C7
Token: Njg2OTU3MzA4Mjg2MzM3MDUx.Xn0xrg.5Kyn524JMrZLoJOERNQ3iJiUU2g

*/
const config = require('../shared/config');
config.token = process.env.TOKEN || 'Njg2OTU3MzA4Mjg2MzM3MDUx.Xn0xrg.5Kyn524JMrZLoJOERNQ3iJiUU2g';

/* imports */
const Discord = require('discord.js');
const {createLogger,wrapConsole} = require('@r3wt/log');
const GracefulShutdown = require('./services/GracefulShutdown');

/* initialization logic */
global.utils = require('./lib/utils');
//initialize our logger
const log = createLogger({log_level:config.log_level});
wrapConsole(log);// this wraps global console.log, so any messages you log with console via log, warn, error, or info will be caught and handled by the logging library.

// initialize our graceful shutdown service
global.shutdown = new GracefulShutdown;

// initialize the discord client
const client = new Discord.Client({shards:'auto'});

const prefix = '!';

client.on("ready", () => {
    console.log('AesirBot is online');
    console.log('connected to %d guilds',client.guilds.size);
});

const parser  = require('discord-command-parser');

const MusicBot = require('./services/MusicBot');

client.on('message', message => {

    if (message.author.bot) {
        return;
    }

    const guild = message.guild.id;

    const parsed = parser.parse(message, prefix);

    if (!parsed.success) return;

    if(parsed.command==='m'){
        //command for music bot
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel){
            return message.channel.send("You need to be in a voice channel to play music!");    
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send("I need the permissions to join and speak in your voice channel!");
        }

        if(!parsed.arguments.length) {
            return message.channel.send('you need to provide arguments. type `!m commands` or `!m c` for a list of commands');
        }

        switch(parsed.arguments[0]) {
            case `c`:
            case `commands`:
                return message.channel.send('not implemented');
            break;
            case `p`:
            case `play`:
                MusicBot.exec(message,guild,parsed.arguments.slice(1));
            break;
        }

    }

});

client.login(config.token);

//setup our graceful shutdown handlers
process.on('SIGINT',signal=>{
    console.log('SIGINT: BOT WILL SHUTDOWN');
    shutdown.runHooks().then(()=>{
        process.exit(0);
    }).catch(err=>{
        console.log(err);
        process.exit(1);
    })
})

process.on('uncaughtException',err=>{
    console.log('uncaughtException: '+err.message); 
        setTimeout(()=>{
            shutdown.runHooks().then(()=>{
            process.exit(1);
        });
    });
})
