define(function(require){

    var p = require('p'),
        logger = require('logger');

    var Plugin = p.extend({
        is_plugin: true,
        activate: function () {},
        deactivate: function () {},
        context: {},
        init: function () {},
        data: {},
        name: '',
        title: '',
        class: 'inactive',

        $create: function() {
            this.log = logger.get(this.name);
        }

    });

    return Plugin;

});