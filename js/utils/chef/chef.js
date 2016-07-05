define(function(require) {

    var Protoplast = require('p');

    var Chef = Protoplast.extend({

        $create: function() {
            this.names = [];
            this.recipes = [];
            this.operators = {};
            this.cache = {};
            this.cache_hierarchy = {};
            this._rnd = 0;
        },

        next_name: function() {
            return '__' + (this._rnd++) + '___';
        },

        add: function(name, recipe) {

            var index;

            if (index = this.recipes.indexOf(recipe) === -1) {
                this.recipes.push(recipe);
                this.names.push(name);

                var operator = recipe.create();
                
                for (var dependency in recipe.$meta.properties.type) {
                    var type = recipe.$meta.properties.type[dependency];
                    (function(self) {

                        var index = self.recipes.indexOf(type);
                        if (index === -1) {
                            self.add(self.next_name(), type);
                            index = self.recipes.indexOf(type);
                        }
                        var existing_name = self.names[index];

                        self.cache_hierarchy[existing_name] = self.cache_hierarchy[existing_name] || [];
                        self.cache_hierarchy[existing_name].push(name);

                        Object.defineProperty(operator, dependency, {
                            set: function(value) {
                                self.set(existing_name, value);
                            },
                            get: function() {
                                return self.get(existing_name);
                            }
                        });
                    })(this);

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
            this.operators[name].value = value;
            this.purge(name);
        },

        get: function(name) {
            if (this.cache.hasOwnProperty(name)) {
                return this.cache[name];
            }
            return this.cache[name] = this.operators[name].value;
        }

    });

    return Chef;
});
