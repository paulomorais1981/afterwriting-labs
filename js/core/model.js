define(function(require) {

    var Protoplast = require('protoplast'),
        off = require('off');

    var Model = Protoplast.extend({

        $create: function() {

            for (var property in this.$meta.properties.property) {
                this[property] = off(this[property]);
            }

            for (var computed_property in this.$meta.properties.computed) {
                this[computed_property] = off(this[computed_property]);
                this.$meta.properties.deps[computed_property].forEach(function(dep) {
                    
                })
            }
        }

    });

    Model.Property = function() {
        return {
            property: true
        }
    };

    Model.Computed = function(deps) {
        var handler = deps.pop();
        return {
            deps: deps,
            handler: handler,
            computed: true
        }
    };

    return Model;

});