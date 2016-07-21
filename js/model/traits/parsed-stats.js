define(function(require) {

    var Trait = require('utils/lazy-object/trait'),
        Fountain = require('model/traits/fountain'),
        Config = require('model/traits/config'),
        Tokens = require('model/traits/tokens'),
        parser = require('utils/fountain/parser'),
        liner = require('utils/fountain/liner');
    
    var ParsedStats = Trait.extend({

        fountain: {
            type: Fountain
        },

        config: {
            type: Config
        },

        tokens: {
            type: Tokens
        },

        value: {
            get: function() {
                if (this.config.use_print_settings_for_stats) {
                    this._value = this.tokens;
                } else {
                    var stats_config = Object.create(this.config);
                    stats_config.print_actions = true;
                    stats_config.print_headers = true;
                    stats_config.print_dialogues = true;
                    stats_config.print_sections = false;
                    stats_config.print_notes = false;
                    stats_config.print_synopsis = false;
                    this._value = parser.parse(this.fountain, stats_config);
                    this._value.lines = liner.line(this._value.tokens, stats_config);
                }
            }
        }

    });

    return ParsedStats;
});