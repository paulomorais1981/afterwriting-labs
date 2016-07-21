define(function(require) {

    var Trait = require('utils/lazy-object/trait'),
        Config = require('model/traits/config'),
        Tokens = require('model/traits/tokens'),
        liner = require('utils/fountain/liner');

    var Lines = Trait.extend({

        config: {
            type: Config
        },

        tokens: {
            type: Tokens
        },

        $create: function() {
            this._value = [];
        },

        value: {
            get: function() {
                return liner.line(this.tokens.tokens, this.config);
            }
        }
    });

    return Lines;
});