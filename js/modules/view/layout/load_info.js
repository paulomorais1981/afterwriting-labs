define(function(require){

    var layout = require('utils/layout'),
        info = require('plugins/info');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(info);
    };

    return module;

});