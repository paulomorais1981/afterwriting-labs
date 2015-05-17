define(function(require){

    var layout = require('utils/layout'),
        StatsPlugin = require('views/plugins/stats');

    var module = {};

    module.init = function() {
        add_stats_to_layout();
    };

    function add_stats_to_layout() {
        var stats = StatsPlugin();
        layout.add_plugin(stats);
    }

    return module;

});