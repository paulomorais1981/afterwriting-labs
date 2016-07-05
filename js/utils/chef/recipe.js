define(function(require) {

    var Protoplast = require('p');

    var Recipe = Protoplast.extend({

        define: function(dependency, existing_name, self) {
            Object.defineProperty(this, dependency, {
                set: function(value) {
                    self.set(existing_name, value);
                },
                get: function() {
                    return self.get(existing_name);
                }
            });

        }
        
    });

    return Recipe;

});