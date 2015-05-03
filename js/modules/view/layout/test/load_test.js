define(function(require){

    var layout = require('utils/layout'),
        test = require('plugins/dev/test');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(test);
    };

    return module;

});