define(function(require) {

    var Protoplast = require('p');

    var TraitUtils = Protoplast.extend({

        flatten_traits: function(result, current, ns) {

            for (var name  in current) {
                if (current[name].$meta && current[name].$meta.trait) {
                    result[ns.concat(name).join('.')] = current[name];
                }
                else {
                    TraitUtils.flatten_traits(result, current[name], ns.concat(name))
                }
            }

        }

    });

    return TraitUtils;

});