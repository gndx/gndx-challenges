module.exports = {
    callbacks: {},
    
    suscribe(id, callback) {
        this.callbacks[id] = callback;
    },

    unsuscribe(id) {
        delete this.callbacks[id];
    },

    notify(data = null) {
        if(this.callbacks)
            Object.keys(this.callbacks).forEach(id => this.callbacks[id](data))
    }
};