define(function(require) {
   
    var Protoplast = require('p');
    
    var Cache = Protoplast.extend({

        values: null,

        triggers: null,
        
        $create: function() {
            this.values = {};
            this._triggers = {};
        },
        
        add_trigger: function(host, consumer) {
            this._triggers[host] = this._triggers[host] || [];
            this._triggers[host].push(consumer);
        },

        purge: function(name) {
            var queue = this._triggers[name] || [], new_queue, affected_entries = [];
            delete this.values[name];
            if (affected_entries.indexOf(name) === -1) {
                affected_entries.push(name);
            }
            while (queue.length) {
                new_queue = [];
                queue.forEach(function(dependency) {
                    delete this.values[dependency];
                    if (affected_entries.indexOf(dependency) === -1) {
                        affected_entries.push(dependency);
                    }
                    new_queue = new_queue.concat(this._triggers[dependency] || []);
                }, this);
                queue = new_queue;
            }

            return affected_entries;
        },

        rename_trigger: function(old_name, new_name) {
            if (this._triggers[old_name]) {
                this._triggers[new_name] = this._triggers[old_name];
                delete this._triggers[old_name];
            }
            for (var host in this._triggers) {
                var index = this._triggers[host].indexOf(old_name);
                if (index !== -1) {
                    this._triggers[host][index] = new_name;
                }
            }
        },
        
        has: function(name) {
            return this.values.hasOwnProperty(name);
        },
        
        get: function(name) {
            return this.values[name];
        },
        
        set: function(name, value) {
            return this.values[name] = value;
        }

    });
    
    return Cache;
    
});