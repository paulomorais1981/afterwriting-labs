define(function(require) {

    var Trait = require('utils/lazy-object/trait'),
        Tokens = require('model/traits/tokens');
    
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

    return TitleToken;
});