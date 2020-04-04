const ytdl = require('ytdl-core');
const jsonfile = require('jsonfile');
const dumpFile = './tmp/music-bot.json';
class MusicBot {

    constructor() {
        this.queue = {};
        shutdown.registerHook(()=>{
            console.log('MusicBot: shutdown');
            // save our queue data to ./tmp/music-bot.json
            return jsonfile.writeFile(dumpFile,this.queue);
        });

        // load our queue data from the ./tmp/music-bot.json file
        // we might have to do special logic to "hydrate" the data since it stores the connection object.
        // so for each stored queue we would have to retrieve a new connection object at startup
        jsonfile.readFile(dumpFile).then(queue=>{
            console.log(queue);
            this.queue = queue;
            this.hydrateConnections();//hydrate the connections for the queue
        });

    }

    hydrateConnections() {
        // should iterate the queue and hydrate all connections
    }

}

module.exports = MusicBot;