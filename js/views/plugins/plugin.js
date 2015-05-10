define(function (require) {

    var base = require('utils/view/component'),
        d3 = require('d3');

    return function (name, title) {
        var plugin = base();
        plugin.$name("BasePlugin");
        plugin.name = name;
        plugin.title = title;

        plugin.init.override(function ($super) {
            $super();
            this.container = d3.select(this.parent).append('div').classed('plugin-content', true).attr('plugin', name).node();
        });

        plugin.activate = off(function(){});
        plugin.deactivate = off(function(){});

        return plugin;
    };

});