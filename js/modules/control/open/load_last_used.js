define(function(require){

    var bootstrap = require('bootstrap'),
        layout = require('utils/layout'),
        data = require('modules/data'),
        open = require('plugins/open');

    var module = {};

    module.prepare = function() {
        if (data.config.load_last_opened) {
            bootstrap.initialized.add(this.load_last_opened);
        }
    };

    module.load_last_opened = function () {
        open.open_last_used(true);
    };

    return module;

});