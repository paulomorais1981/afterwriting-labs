define(function(require){

    var SavePlugin = require('views/plugins/save'),
        save = require('plugins/save');

    var feature = {};

    feature.init = function() {
        save_as_fountain();
    };

    function save_as_fountain() {
        SavePlugin.add(function(save_plugin){
            save_plugin.actions.override(function(){
                save_plugin.save_as_fountain.add(function(){
                    alert('overridden');
                })
            });

        });
    }

    return feature;
});