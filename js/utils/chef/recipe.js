define(function(require) {

    var Protoplast = require('p');

    var Recipe = Protoplast.extend({

        $create: function() {
            
            Object.defineProperty(this, '$value', {
                set: this.setter,
                get: this.getter
            });
        }

    });

    return Recipe;

});