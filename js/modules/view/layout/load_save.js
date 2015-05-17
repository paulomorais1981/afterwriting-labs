define(function(require){

    var layout = require('utils/layout'),
        SavePlugin = require('views/plugins/save');

    var module = {};

    module.init = function() {
        add_save_to_layout();
    };

    function add_save_to_layout() {
        var save = SavePlugin();
        layout.add_plugin(save);
    }

    return module;

});