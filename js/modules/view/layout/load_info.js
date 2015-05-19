define(function(require){

    var layout = require('utils/layout'),
        InfoPlugin = require('views/plugins/info');

    var module = {};

    module.init = function() {
        var info_plugin = InfoPlugin();
        layout.add_plugin(info_plugin);
    };

    return module;

});