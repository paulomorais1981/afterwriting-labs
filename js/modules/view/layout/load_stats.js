define(function(require){

    var layout = require('utils/layout'),
        stats = require('plugins/stats');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(stats);
    };

    return module;

});