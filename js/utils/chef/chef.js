define(function(require) {

    var Protoplast = require('p');
    
    var Chef = Protoplast.extend({

        $create: function() {
            this.vo = {};
            this.names = [];
            this.descriptors = [];
            this.operators = {};
            this.cache = {};
            this.cache_hierarchy = {};
            this._rnd = 0;
        },

        add: function(name, descriptor) {

            var index;
            
            if (index = this.descriptors.indexOf(descriptor) === -1) {
                this.descriptors.push(descriptor);
                this.names.push(name);

                var operator = {}, vo = this;

                Object.defineProperty(operator, 'value', {
                    set: function(value) {
                        vo[name] = value;
                    },
                    get: function() {
                        return vo[name];
                    }
                });

                Object.defineProperty(operator, 'VALUE', {
                    set: descriptor.setter,
                    get: descriptor.getter
                });

                for (var definition in descriptor) {
                    if (descriptor.hasOwnProperty(definition) && definition !== 'setter' && definition !== 'getter') {
                        (function(self){

                            var index = self.descriptors.indexOf(descriptor[definition].type);
                            if (index === -1) {
                                self.add('__' + (this._rnd++) + '___', descriptor[definition].type);
                                index = self.descriptors.indexOf(descriptor[definition].type);
                            }
                            var existing_name = self.names[index];

                            self.cache_hierarchy[existing_name] = self.cache_hierarchy[existing_name] || [];
                            self.cache_hierarchy[existing_name].push(name);

                            Object.defineProperty(operator, definition, {
                                set: function(value) {
                                    self.set(existing_name, value);
                                },
                                get: function() {
                                    return self.get(existing_name);
                                }
                            });
                        })(this);
                    }
                }

                this.operators[name] = operator;
            }
            else {
                var existing_name = this.names[index];
                this.operators[name] = this.operators[existing_name];
            }

        },

        purge: function(name) {
            var queue = this.cache_hierarchy[name] || [], new_queue;
            delete this.cache[name];
            while (queue.length) {
                new_queue = [];
                queue.forEach(function(dependency) {
                    delete this.cache[dependency];
                    new_queue = new_queue.concat(this.cache_hierarchy[dependency] || []);
                }, this);
                queue = new_queue;
            }
        },

        set: function(name, value) {
            this.operators[name].VALUE = value;
            this.purge(name);
        },

        get: function(name) {
            if (this.cache.hasOwnProperty(name)) {
                return this.cache[name];
            }
            return this.cache[name] = this.operators[name].VALUE;
        }

    });

    return Chef;
});
