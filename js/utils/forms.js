define(function(require) {

    var p = require('p'),
        $ = require('jquery');

    /**
     * Forms utils
     */
    var Forms = p.extend({

        /**
         * Create a text input popup
         * @param {String} label
         * @param {String} default_value
         * @param {Function} callback
         */
        text: function(label, default_value, callback) {

            var html = '<p>' + label + '</p><p><input name="text" class="text_input" value="' + default_value + '"style="width: 90%" autofocus /></p>';

            $.prompt(html, {
                promptspeed: 200,
                loaded: function() {
                    setTimeout(function() {
                        $(this).find('.text_input').select().focus();
                    }.bind(this), 300);
                },
                buttons: {
                    'OK': true,
                    'Cancel': false
                },
                submit: function(e, v, m, f) {
                    if (v) {
                        callback(f);
                    }
                }
            });
        }
    });

    return Forms;
});