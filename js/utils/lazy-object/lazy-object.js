define(function(require) {

    var Protoplast = require('protoplast'),
        TraitUtils = require('utils/lazy-object/trait-utils'),
        Cache = require('utils/lazy-object/cache');

    /**
     * LazyObject is a composition of Trait (@see Trait) objects. Computed traits are loaded only if are requested
     * by get() or watched by a watcher. Computed traits are cached. Cache of the trait is cleared when
     * a value that the trait depends on changes.
     *
     * @alias LazyObject
     */
    var LazyObject = Protoplast.extend([Protoplast.Dispatcher], {

        $create: function(traits) {

            this._traits = {};
            this._cache = Cache.create();

            if (traits) {
                var flat_traits = {};
                TraitUtils.flatten_traits(flat_traits, traits, []);
                for (var name in flat_traits) {
                    this.$add(name, flat_traits[name]);
                }
            }
        },

        $trait_definition: function(type) {
            for (var name in this._traits) {
                if (this._traits[name].type === type) {
                    return this._traits[name];
                }
            }
            return null;
        },

        $add: function(name, Trait) {

            this._traits[name] = this._traits[name] || {};

            var trait_definition = this.$trait_definition(Trait);
            if (!trait_definition) {

                var trait = Trait.create(name);
                
                for (var property_name in Trait.$meta.properties.type) {
                    var type = Trait.$meta.properties.type[property_name];
                    this.$inject_type(trait, property_name, type);
                }

                this._traits[name].trait = trait;
                this._traits[name].type = Trait;
                this._traits[name].name = name;
            }
            else {
                var trait_name = trait_definition.name;
                this._traits[name] = this._traits[trait_name];
                this._traits[name].name = name;
                this._cache.rename_trigger(trait_name, name);
                delete this._traits[trait_name];
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
            var host_definition = this.$get_or_create_dependency(host_type);
            this._cache.add_trigger(host_definition.name, consumer.name);
            consumer.define(property_name, host_definition, this);
        },

        $get_or_create_dependency: function(type) {
            if (!this.$trait_definition(type)) {
                this.$add(TraitUtils.next_name(), type);
            }
            return this.$trait_definition(type);
        },

        set: function(name, value) {
            if (this._cache.has(name) && this._cache.get(name) === value) {
                return;
            }
            this._traits[name].trait.value = value;
            
            var affected_properties = this._cache.purge(name);
            affected_properties.forEach(function(property) {
                if (this._topics[property] && this._topics[property].length) {
                    this.dispatch(property, this.get(property));
                }
            }, this);

            return this._cache.set(name, this._traits[name].trait.value);
        },

        get: function(name) {
            if (this._cache.has(name)) {
                return this._cache.get(name);
            }
            return this._cache.set(name, this._traits[name].trait.value);
        },

        watch: function(name, handler, context) {
            this.on(name, handler, context);
            handler.call(context, this.get(name));
        },

        unwatch: function(name, handler, context) {
            this.off(name, handler, context);
        }

    });

    return LazyObject;
});
