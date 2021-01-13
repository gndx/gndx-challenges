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
    },

    // The height of the header.
    height: 0,

    reportHeight(height){ 
        this.height = height 
    },

    consumeHeight() {
        let h = this.height;
        delete this.height;
        return h;
    }
};