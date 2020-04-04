/*
this service will be responsible for retrieving and cacheing server configurations. command parsing logic will read these configurations when parsing and executing commands.
this decouples our logic from the database implementation by making it available as a service to calling code.
*/

//this function will take a string like `logging.foobar` and return an array like `["logging","foobar"]`. this can be used to "walk" down an object to retrieve a value
function parsePath(path) {
    const paths = path.split('.');
    return paths.length > 1 ? paths : [paths[0]];
}

class ServerConfiguration {

    constructor(options) {
        this.ready=false;
        this.options= options;
        this.servers = {};//will index each servers config by id
    }

    // this function will connect to database and load server configs
    loadData() {

    }

    configDidChange(server) {
        // we will expose a private api for use by our webapp to update a configuration for the server
        // when this method is called with a server id, the new config will be fetched from the db and updated
    }

    start() {

    }

    stop() {

    }

    // retrieves the value of a servers config, with optional path to a specific option
    get(server, path=false) {
        if(path==false){
            return this.servers[server];
        }else{
            const paths = parsePath(path);
            let o = this.servers[server];
            for(k in paths){
                if(o[k]===undefined){
                    console.error('attempt to read undefined property on server config at path `this.servers.%s.%s`. fix the supplied path and try again',server,path);
                    setTimeout(()=>process.exit(1));//we are terminating process because the program shouldn't continue as it would result in undefined behavior. this is a fatal error
                    return -1;
                }
                o = o[k];//traverse down the object tree
            }
            return o;//we should have arrived at the config value
        }
    }

}

module.exports = ServerConfiguration;