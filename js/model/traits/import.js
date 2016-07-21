define(function(require) {

    var Trait = require('utils/lazy-object/trait'),
        Config = require('model/traits/config'),
        Format = require('model/traits/format'),
        Fountain = require('model/traits/fountain'),
        converter = require('utils/converters/scriptconverter'),
        preprocessor = require('utils/fountain/preprocessor');

    var Import = Trait.extend({

        fountain: {
            type: Fountain
        },

        format: {
            type: Format
        },

        config: {
            type: Config
        },

        method: function(value) {
            var result = converter.to_fountain(value);
            result.value = preprocessor.process_snippets(result.value, this.config.snippets);

            this.format = result.format;
            this.fountain = result.value;
        }

    });

    return Import;
});