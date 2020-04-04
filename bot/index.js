/*

Client ID: 686957308286337051
Client Secret: XYxxN8lSgWTdHZho_XUxwooaRcjMp7C7
Token: Njg2OTU3MzA4Mjg2MzM3MDUx.Xn0xrg.5Kyn524JMrZLoJOERNQ3iJiUU2g

*/
global.bot_config = {
    env: process.env.NODE_ENV || 'development',
    token: process.env.TOKEN || 'Njg2OTU3MzA4Mjg2MzM3MDUx.Xn0xrg.5Kyn524JMrZLoJOERNQ3iJiUU2g',
    log_level: process.env.LOG_LEVEL || 'debug'
};

/* imports */
const Discord = require('discord.js');
const {createLogger,wrapConsole} = require('@r3wt/log');
const GracefulShutdown = require('./services/GracefulShutdown');

/* initialization logic */

//initialize our logger
const log = createLogger({log_level:bot_config.log_level});
wrapConsole(log);// this wraps global console.log, so any messages you log with console via log, warn, error, or info will be caught and handled by the logging library.

// initialize our graceful shutdown service
global.shutdown = new GracefulShutdown;

// initialize the discord client
const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Ready to serve on ${client.guilds.size} servers, for ${client.users.size} users.`);
});

client.on('message', message => {

    if (message.author.bot) {
        return;
    }




});

client.login(bot_config.token);

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
    shutdown.runHooks().then(()=>{
        process.exit(1);
    });
})
