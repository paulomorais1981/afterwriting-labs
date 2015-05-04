define(function(require){

    var layout = require('utils/layout'),
        stats = require('plugins/stats');

    var module = {};

    module.init = function() {
        layout.add_plugin(stats);
    };

    return module;

});