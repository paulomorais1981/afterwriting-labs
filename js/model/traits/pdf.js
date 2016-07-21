define(function(require) {

    var Trait = require('utils/lazy-object/trait'),
        Config = require('model/traits/config'),
        Lines = require('model/traits/lines'),
        TitleToken = require('model/traits/title-token'),
        pdfmaker = require('utils/pdfmaker'),
        browser = require('utils/browser');

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

    return Pdf;
});