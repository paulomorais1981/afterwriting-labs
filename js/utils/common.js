define(function(require) {

    var p = require('p');

    /**
     * Common data shared between modules
     */
    var Common = p.extend({

        data: {
            value: {
                static_path: 'bundle/',
                footer: 'version: 1.2.22 (2016/02/21)'
            }
        }

    });

    return Common;
});