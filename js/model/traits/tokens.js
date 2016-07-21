define(function(require) {

    var Trait = require('utils/lazy-object/trait'),
        Fountain = require('model/traits/fountain'),
        Config = require('model/traits/config'),
        parser = require('utils/fountain/parser');

    var Tokens = Trait.extend({

        fountain: {
            type: Fountain
        },

        config: {
            type: Config
        },

        $create: function() {
            this._value = [];
        },

        value: {
            get: function() {
                return parser.parse(this.fountain, this.config);
            }
        }
    });

    return Tokens;
});