define(function(require) {

    var Protoplast = require('p'),
        TraitUtils = require('utils/lazy-object/trait-utils'),
        Cache = require('utils/lazy-object/cache');
 
    var LazyObject = Protoplast.extend({

        $create: function(traits) {
            this._traits = {};
            this._observers = {};
            this._cache = Cache.create();

            if (traits) {
                var flat_traits = {};
                TraitUtils.flatten_traits(flat_traits, traits, []);
                for (var name in flat_traits) {
                    this.$add(name, flat_traits[name]);
                }
            }
        },

        $trait_name: function(type) {
            for (var name in this._traits) {
                if (this._traits[name].type === type) {
                    return name;
                }
            }
            return null;
        },

        $add: function(name, Trait) {

            this._traits[name] = this._traits[name] || {};

            if (!this.$trait_name(Trait)) {

                var trait = Trait.create(name);
                
                for (var property_name in Trait.$meta.properties.type) {
                    var type = Trait.$meta.properties.type[property_name];
                    this.$inject_type(trait, property_name, type);
                }

                this._traits[name].trait = trait;
                this._traits[name].type = Trait;
            }
            else {
                this._traits[name].trait = this._traits[this.$trait_name(Trait)].trait;
                this._traits[name].type = Trait;
            }

            this.$define_nested_property(name);
        },

        $define_nested_property: function(name) {

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
            if (!this.$trait_name(type)) {
                this.$add(TraitUtils.next_name(), type);
            }
            return this.$trait_name(type);
        },

        set: function(name, value) {
            this._traits[name].trait.value = value;
            var purged = this._cache.purge(name);
            purged.forEach(function(name) {
                (this._observers[name] || []).forEach(function(handler) {
                    handler();
                });
            }, this);
        },

        get: function(name) {
            if (this._cache.has(name)) {
                return this._cache.get(name);
            }
            return this._cache.set(name, this._traits[name].trait.value);
        },
        
        observe: function(name, handler) {
            this._observers[name] = this._observers[name] || [];
            this._observers[name].push(handler);
        }

    });

    return LazyObject;
});
