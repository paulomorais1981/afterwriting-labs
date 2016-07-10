define(function(require) {

    var Protoplast = require('p');

    var TraitUtils = Protoplast.extend({

        _counter: 0,

        flatten_traits: function(result, current, ns) {

            for (var name  in current) {
                if (current[name].$meta && current[name].$meta.trait) {
                    result[ns.concat(name).join('.')] = current[name];
                }
                else {
                    TraitUtils.flatten_traits(result, current[name], ns.concat(name))
                }
            }

        },

        next_name: function() {
            return '__' + (this._counter++) + '__';
        },

        resolve_property_owner: function(host, name) {

            var result = {owner: host, name: name};

            var current, ns = name.split('.');
            while (ns.length > 1) {
                current = ns.shift();
                result.owner[current] = result.owner[current] || {};
                result.owner = result.owner[current];
            }
            result.name = ns[0];

            return result;
        }

    });

    return TraitUtils;

});