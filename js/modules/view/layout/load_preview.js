define(function(require){

    var layout = require('utils/layout'),
        preview = require('plugins/preview');

    var module = {};

    module.init = function() {
        layout.add_plugin(preview);
    };

    return module;

});