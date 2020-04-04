//allows various bot components to register a hook to run before shutdown (eg, saving data or whatever)
class GracefulShutdown {
    constructor(){
        this.hooks=[];
    }
    registerHook(hook){
        this.hooks.push(hook);
    }
    runHooks(){
        console.log('running shutdown hooks');
        return Promise.all(this.hooks.map(hook=>hook())).then(()=>{
            console.log('shutdown hooks are finished. process can be exited');
            return true;
        });
    }
}

module.exports = GracefulShutdown;
