define(function(require){

    var SavePlugin = require('views/plugins/save'),
        save = require('plugins/save');

    var feature = {};

    feature.init = function() {
        save_as_fountain();
    };

    function save_as_fountain() {
        SavePlugin.add(function(save_plugin){
            save_plugin.save_as_fountain.add(save.save_as_fountain);
        });
    }

    return feature;
});