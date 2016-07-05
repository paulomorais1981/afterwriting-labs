define(function(require) {

    var Protoplast = require('p');

    var Recipe = Protoplast.extend({

        $create: function(name, vo) {
            Object.defineProperty(this, 'value', {
                set: function(value) {
                    vo[name] = value;
                },
                get: function() {
                    return vo[name];
                }
            });

            Object.defineProperty(this, '$value', {
                set: this.setter,
                get: this.getter
            });
        }

    });

    return Recipe;

});