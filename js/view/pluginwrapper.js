define(function(require){

    var p = require('p');

    var PluginWrapper = p.Component.extend({

        plugin: null,

        $create: function(plugin) {
            var wrapper = $('<div class="plugin-content" plugin="' + plugin.name + '"></div>');
            this.root = wrapper.get(0);
            this.plugin = plugin;
        },

        init: function() {
            this.add(this.plugin.view);
        }
    });

    return PluginWrapper;
});