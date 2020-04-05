const ytdl = require('ytdl-core');
const jsonfile = require('jsonfile');
const dumpFile = './tmp/music-bot.json';
const isYoutubeVideo = require('is-youtube-video');

class MusicBot {

    constructor() {
        this.queue = {};
        // shutdown.registerHook(()=>{
        //     console.log('MusicBot: shutdown');
        //     // save our queue data to ./tmp/music-bot.json
        //     return jsonfile.writeFile(dumpFile,this.queue);
        // });

        // // load our queue data from the ./tmp/music-bot.json file
        // // we might have to do special logic to "hydrate" the data since it stores the connection object.
        // // so for each stored queue we would have to retrieve a new connection object at startup
        // jsonfile.readFile(dumpFile).then(queue=>{
        //     console.log('MusicBot: loaded cache file',queue);
        //     this.queue = queue;
        //     this.hydrateConnections();//hydrate the connections for the queue
        // })
        // .catch(err=>{
        //     console.log('MusicBot: unable to read queue file (maybe not exists)');
        // });

    }

    hydrateConnections() {
        // should iterate the queue and hydrate all connections
    }

    async exec( message, guild, args ) {
        console.log('MusicBot.exec()',guild,args);

        let videoURL = args[0];

        if(!isYoutubeVideo(videoURL)){
            return message.channel.send('Youtube search not implemented yet. please supply a video url');
            // todo do youtube video search and grab the url of first result.
        }

        const songInfo = await ytdl.getInfo(videoURL);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url,
        };
        if(!utils.has(this.queue,guild)){
            this.queue[guild] = {
                textChannel: message.channel,
                voiceChannel: message.member.voice.channel,
                connection: null,
                songs: [],
                volume: 5,
                playing: null,
            };
        }
        const i = this.queue[guild].songs.length+1;
        this.queue[guild].songs.push(song);

        if(this.queue[guild].playing===null){
            try {
                // Here we try to join the voicechat and save our connection into our object.
                var connection = await message.member.voice.channel.join();
                this.queue[guild].connection = connection;
                // Calling the play function to start a song
                this.play(guild, this.queue[guild].songs[0]);
            } catch (err) {
                // Printing the error message if the bot fails to join the voicechat
                console.log(err);
                delete this.queue[guild];
                return message.channel.send(err);
            }    
        }else{
            return message.channel.send(`Song **${song.title}** added to queue in position **#${i}**`);
        }
        

    }

    play(guild,song) {
        if (!song) {
            console.log('MusicBot: no song passed to play(); aborting ');
            this.queue[guild].voiceChannel.leave();
            delete this.queue[guild];
            return;
        }
        this.queue[guild].playing=song;
        const dispatcher = this.queue[guild].connection
        .play(ytdl(song.url))
        .on("finish", () => {
            this.queue[guild].songs.shift();
            this.play(guild, this.queue.guild.songs[0]);
        })
        .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(this.queue[guild].volume / 5);
        this.queue[guild].textChannel.send(`Start playing: **${song.title}**`);
    }

}

module.exports = new MusicBot;