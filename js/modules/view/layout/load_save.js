define(function(require){

    var layout = require('utils/layout'),
        save = require('plugins/save');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(save);
    };

    return module;

});