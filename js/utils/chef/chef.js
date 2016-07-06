define(function(require) {

    var Protoplast = require('p'),
        Cache = require('utils/chef/cache');

    var Chef = Protoplast.extend({

        $create: function() {
            this._names = [];
            this._types = [];
            this._recipes = {};
            this._triggers = {};
            this._cache = Cache.create();
            this._rnd = 0;
        },

        $next_name: function() {
            return '__' + (this._rnd++) + '___';
        },

        add: function(name, Recipe) {

            var index;

            if (index = this._types.indexOf(Recipe) === -1) {
                this._types.push(Recipe);
                this._names.push(name);

                var recipe = Recipe.create(name);

                if (typeof(recipe.method) === 'function') {
                    recipe.value = recipe.method.bind(recipe);
                }

                for (var property_name in Recipe.$meta.properties.type) {
                    var type = Recipe.$meta.properties.type[property_name];
                    this.$inject_type(recipe, property_name, type);
                }
                for (var trigger_name in Recipe.$meta.properties.bind) {
                    var host_name = this.$get_or_create_dependency(Recipe.$meta.properties.type[trigger_name]);
                    this._triggers[host_name] = this._triggers[host_name] || [];
                    this._triggers[host_name].push(Recipe.$meta.properties.bind[trigger_name].bind(recipe));
                }

                this._recipes[name] = recipe;
            }
            else {
                var existing_name = this._names[index];
                this._recipes[name] = this._recipes[existing_name];
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

        $inject_type: function(consumer, property_name, host_type) {
            var host_name = this.$get_or_create_dependency(host_type);
            this._cache.add_trigger(host_name, consumer.name);
            consumer.define(property_name, host_name, this);
        },

        $get_or_create_dependency: function(type) {
            var index = this._types.indexOf(type);
            if (index === -1) {
                this.add(this.$next_name(), type);
                index = this._types.indexOf(type);
            }
            return this._names[index];
        },

        set: function(name, value) {
            this._recipes[name].value = value;
            (this._triggers[name] || []).forEach(function(handler) {
                handler();
            });
            this._cache.purge(name);
        },

        get: function(name) {
            if (this._cache.has(name)) {
                return this._cache.get(name);
            }
            return this._cache.set(name, this._recipes[name].value);
        }

    });

    return Chef;
});
