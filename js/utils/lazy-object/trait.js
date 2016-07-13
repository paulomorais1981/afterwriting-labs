define('utils/lazy-object/trait', function(require) {

    var Protoplast = require('protoplast');

    var autobind_method = function () {
        if (typeof(this.method) === 'function') {
            this.value = this.method.bind(this);
        }
    };

    /**
     * Trait represents a property of an object. Could be a property (setter + getter), computed property (get only),
     * or a method.
     *
     * @Trait
     */
    var Trait = Protoplast.extend({

        $meta: {
            trait: true,
            constructors: [autobind_method]
        },

        $create: function(name) {
            this.name = name;
        },

        name: '',

        define: function(dependency, definition, self) {
            Object.defineProperty(this, dependency, {
                set: function(value) {
                    self.set(definition.name, value);
                },
                get: function() {
                    return self.get(definition.name)
                }
            });

        },

        value: {
            set: function(value) {
                this._value = value;
            },
            get: function() {
                return this._value;
            }
        }
        
    });

    return Trait;

});