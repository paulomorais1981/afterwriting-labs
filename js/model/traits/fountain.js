define(function(require) {

    var Trait = require('utils/lazy-object/trait');

    var Fountain = Trait.extend({
        $create: function() {
            this._value = '';
        }
    });

    return Fountain;
});