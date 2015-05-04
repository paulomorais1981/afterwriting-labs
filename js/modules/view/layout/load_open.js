define(function(require){

    var layout = require('utils/layout'),
        open = require('plugins/open');

    var module = {};

    module.init = function() {
        layout.add_plugin(open);
    };

    return module;

});