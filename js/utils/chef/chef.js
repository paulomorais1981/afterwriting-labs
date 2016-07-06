define(function(require) {

    var Protoplast = require('p'),
        Cache = require('utils/chef/cache');

    var Chef = Protoplast.extend({

        $create: function() {
            this.names = [];
            this.types = [];
            this.recipes = {};
            this.triggers = {};
            this.cache = Cache.create();
            this._rnd = 0;
        },

        next_name: function() {
            return '__' + (this._rnd++) + '___';
        },

        add: function(name, Recipe) {

            var index;

            if (index = this.types.indexOf(Recipe) === -1) {
                this.types.push(Recipe);
                this.names.push(name);

                var recipe = Recipe.create(name);

                if (typeof(recipe.method) === 'function') {
                    recipe.value = recipe.method.bind(recipe);
                }

                for (var property_name in Recipe.$meta.properties.type) {
                    var type = Recipe.$meta.properties.type[property_name];
                    this.inject_type(recipe, property_name, type);
                }
                for (var trigger_name in Recipe.$meta.properties.bind) {
                    var host_name = this.get_or_create_dependency(Recipe.$meta.properties.type[trigger_name]);
                    this.triggers[host_name] = this.triggers[host_name] || [];
                    this.triggers[host_name].push(Recipe.$meta.properties.bind[trigger_name].bind(recipe));
                }

                this.recipes[name] = recipe;
            }
            else {
                var existing_name = this.names[index];
                this.recipes[name] = this.recipes[existing_name];
            }

            Object.defineProperty(this, name, {
                set: function(value) {
                    this.set(name, value);
                },
                get: function() {
                    return this.get(name);
                }
            });

        },

        inject_type: function(consumer, property_name, host_type) {
            var host_name = this.get_or_create_dependency(host_type);
            this.cache.add_trigger(host_name, consumer.name);
            consumer.define(property_name, host_name, this);
        },

        get_or_create_dependency: function(type) {
            var index = this.types.indexOf(type);
            if (index === -1) {
                this.add(this.next_name(), type);
                index = this.types.indexOf(type);
            }
            return this.names[index];
        },

        set: function(name, value) {
            this.recipes[name].value = value;
            (this.triggers[name] || []).forEach(function(handler) {
                handler();
            });
            this.cache.purge(name);
        },

        get: function(name) {
            if (this.cache.has(name)) {
                return this.cache.get(name);
            }
            return this.cache.set(name, this.recipes[name].value);
        }

    });

    return Chef;
});
