define(function(require){

    var layout = require('utils/layout'),
        data = require('modules/data'),
        open = require('plugins/open');

    var module = {};

    module.init = function() {
        if (data.config.load_last_opened) {
            layout.init_layout.add(this.load_last_opened);
        }
    };

    module.load_last_opened = function () {
        open.open_last_used(true);
    };

    return module;

});