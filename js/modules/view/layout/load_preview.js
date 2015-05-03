define(function(require){

    var layout = require('utils/layout'),
        preview = require('plugins/preview');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(preview);
    };

    return module;

});