define(function(require) {

    var Protoplast = require('p');

    var autobind_method = function () {
        if (typeof(this.method) === 'function') {
            this.value = this.method.bind(this);
        }
    };

    var Trait = Protoplast.extend({

        $meta: {
            trait: true,
            constructors: [autobind_method]
        },

        $create: function(name) {
            this.name = name;
        },

        name: '',

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

    return Trait;

});