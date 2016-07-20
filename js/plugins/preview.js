define(function(require) {

    var Plugin = require('core/plugin'),
        template = require('text!templates/plugins/preview.hbs'),
        off = require('off'),
        pdfjsviewer = require('utils/pdfjsviewer');
        
    var Preview = Plugin.extend({

        name: 'preview',

        title: 'view',

        template: template,

        editor: {
            inject: 'editor'
        },

        data: {
            inject: 'data'
        },

        $create: function() {
            this.refresh = off.signal();
        },

        get_pdf: function(callback) {
            this.data.script.pdf.then(callback);
        },

        activate: function() {
            this.editor.synced.add(this.refresh);
            this.refresh();
        },

        deactivate: function() {
            this.editor.synced.remove(this.refresh);
        }
    });

    return Preview.create();
});