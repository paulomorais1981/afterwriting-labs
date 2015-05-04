define(function(require){

    var layout = require('utils/layout'),
        save = require('plugins/save');

    var module = {};

    module.init = function() {
        layout.add_plugin(save);
    };

    return module;

});