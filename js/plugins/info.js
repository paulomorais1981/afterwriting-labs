define(function(require) {
    var Plugin = require('plugins/plugin'),
        decorator = require('utils/decorator'),
        InfoView = require('view/infoview');

    var InfoPlugin = Plugin.extend({
        name: 'info',
        title: 'info',
        class: 'active',
        view: {
            value: InfoView.create()
        },

        $create: function() {
            this.download_clicked = decorator.signal();
        }

    });

    return InfoPlugin.create();
});