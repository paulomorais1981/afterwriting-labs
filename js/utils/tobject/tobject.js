define(function(require) {

    var Protoplast = require('p'),
        TraitUtils = require('utils/tobject/trait-utils'),
        Cache = require('utils/tobject/cache');
 
    var TObject = Protoplast.extend({

        $create: function(traits) {
            this._names = [];
            this._types = [];
            this._traits = {};
            this._triggers = {};
            this._cache = Cache.create();

            if (traits) {
                var flat_traits = {};
                TraitUtils.flatten_traits(flat_traits, traits, []);
                for (var name in flat_traits) {
                    this.$add(name, flat_traits[name]);
                }
            }
        },
        
        $add: function(name, Trait) {

            var index;

            if (index = this._types.indexOf(Trait) === -1) {
                this._types.push(Trait);
                this._names.push(name);

                var trait = Trait.create(name);

                if (typeof(trait.method) === 'function') {
                    trait.value = trait.method.bind(trait);
                }

                for (var property_name in Trait.$meta.properties.type) {
                    var type = Trait.$meta.properties.type[property_name];
                    this.$inject_type(trait, property_name, type);
                }
                for (var trigger_name in Trait.$meta.properties.bind) {
                    var host_name = this.$get_or_create_dependency(Trait.$meta.properties.type[trigger_name]);
                    this._triggers[host_name] = this._triggers[host_name] || [];
                    this._triggers[host_name].push(Trait.$meta.properties.bind[trigger_name].bind(trait));
                }

                this._traits[name] = trait;
            }
            else {
                var existing_name = this._names[index];
                this._traits[name] = this._traits[existing_name];
            }

            var self = this;
            var property_description = TraitUtils.resolve_property_owner(this, name);

            Object.defineProperty(property_description.owner, property_description.name, {
                set: function(value) {
                    self.set(name, value);
                },
                get: function() {
                    return self.get(name);
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
                this.$add(TraitUtils.next_name(), type);
                index = this._types.indexOf(type);
            }
            return this._names[index];
        },

        set: function(name, value) {
            this._traits[name].value = value;
            (this._triggers[name] || []).forEach(function(handler) {
                handler();
            });
            this._cache.purge(name);
        },

        get: function(name) {
            if (this._cache.has(name)) {
                return this._cache.get(name);
            }
            return this._cache.set(name, this._traits[name].value);
        }

    });

    return TObject;
});
