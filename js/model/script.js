define(function(require) {

    var LazyObject = require('utils/lazy-object/lazy-object'),
        Trait = require('utils/lazy-object/trait'),
        browser = require('utils/browser'),
        liner = require('utils/fountain/liner'),
        converter = require('utils/converters/scriptconverter'),
        preprocessor = require('utils/fountain/preprocessor'),
        pdfmaker = require('utils/pdfmaker'),
        parser = require('utils/fountain/parser');
    
    var Fountain = Trait.extend({
        $create: function() {
            this._value = '';
        }
    });

    var Config = Trait.extend({
        $create: function() {
            this._value = {};
        }
    });

    var Tokens = Trait.extend({

        fountain: {
            type: Fountain
        },

        config: {
            type: Config
        },

        $create: function() {
            this._value = [];
        },

        value: {
            get: function() {
                return parser.parse(this.fountain, this.config);
            }
        }
    });


    var TitleToken = Trait.extend({

        tokens: {
            type: Tokens
        },

        method: function(type) {
            var result = null;
            if (this.tokens && this.tokens.title_page) {
                this.tokens.title_page.forEach(function(token) {
                    if (token.is(type)) {
                        result = token;
                    }
                });
            }
            return result;
        }

    });
    
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
    
    var Format = Trait.extend({});
    
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

    var Pdf = Trait.extend({

        _pdf: null,

        config: {
            type: Config
        },

        lines: {
            type: Lines
        },

        title_token: {
            type: TitleToken
        },

        value: {
            get: function() {
                return new Promise(function(resolve) {
                    pdfmaker.get_pdf(this.lines, this.config, this.title_token.bind(this), !!browser.url_params().fontFix, resolve);
                }.bind(this));
            }
        }

    });
    
    var Script = LazyObject.create({
        config: Config,
        tokens: Tokens,
        lines: Lines,
        fountain: Fountain,
        import_script: Import,
        format: Format,
        title_token: TitleToken,
        pdf: Pdf
    });

    return Script;

});