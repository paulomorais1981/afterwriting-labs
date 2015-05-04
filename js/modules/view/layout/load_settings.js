define(function(require){

    var layout = require('utils/layout'),
        settings = require('plugins/settings');

    var module = {};

    module.init = function() {
        layout.add_plugin(settings);
    };

    return module;

});