define(function(require){

    var layout = require('utils/layout'),
        InfoPlugin = require('views/plugins/info');

    var module = {};

    module.init = function(state) {
        var info_plugin = InfoPlugin();
        state.view_registry.add('info', info_plugin);
        layout.add_plugin(info_plugin);
    };

    return module;

});