define(function(require){

    var layout = require('utils/layout'),
        open = require('plugins/open');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(open);
    };

    return module;

});