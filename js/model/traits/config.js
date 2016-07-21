define(function(require) {

    var Trait = require('utils/lazy-object/trait');

    var Config = Trait.extend({
        $create: function() {
            this._value = {};
        }
    });

    return Config;
});