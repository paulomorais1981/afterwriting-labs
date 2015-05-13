define(function(require){

    var layout = require('utils/layout'),
        settings = require('plugins/settings'),
        SettingsPlugin = require('views/plugins/settings');

    var module = {};

    module.init = function() {

        SettingsPlugin.add(function(settings_plugin){
            settings_plugin.activate.add(function(){
                settings_plugin.data_to_components(settings.get_config());
            });
            settings_plugin.changed.add(function(){
                settings_plugin.components_to_data(settings.get_config());
                settings.save();
            });
        });

        var settings_plugin = SettingsPlugin();
        layout.add_plugin(settings_plugin);
    };

    return module;

});