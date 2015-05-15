define(function(require){

    var off = require('off'),
        $ = require('jquery'),
        cm = require('libs/codemirror/lib/codemirror'),
        common = require('utils/common'),
        handlebar = require('views/components/handlebar'),
        base = require('views/plugins/plugin'),
        component = require('utils/view/component'),
        infoheader = require('views/components/infoheader');

    return off(function(){
        var editor_plugin = base('editor', 'editor', true);
        var content, editor;

        editor_plugin.enabled = off.property(true);
        editor_plugin.additional_icons = off.property([]);

        editor_plugin.init.override(function($super){
            $super();

            var header = infoheader();
            header.title('Fountain Editor');
            header.info('Just a basic fountain editor. Use Ctrl-Space for auto-complete. Go to fountain.io for more details about Fountain format.');
            this.add(header);

            content = handlebar('plugins/editor')
            this.add(content);
            editor_plugin.flow(content.init).run(editor_plugin.init_content).dynamic();
        });

        editor_plugin.activate.override(function($super){
            $super();
            editor_plugin.update_size();
        });

        editor_plugin.init_content = off(function() {

            var text_area = $('#editor-textarea').get(0);
            editor = cm.fromTextArea(text_area, {
                mode: "fountain",
                lineNumbers: false,
                lineWrapping: true,
                styleActiveLine: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete"
                }
            });

            editor_plugin.update_size();
            editor_plugin.init_resize_updates();
            editor_plugin.create_icons_placeholder();
            editor_plugin.render();
        });

        editor_plugin.create_icons_placeholder = function() {
            this.icons_placeholder = component();
            this.icons_placeholder.init($('#additional_icons').get(0));
            this.manage(this.icons_placeholder);

            if (this.additional_icons().length == 0) {
                $('#separator').hide();
            }

            this.additional_icons().forEach(function(icon){
                this.icons_placeholder.add(icon);
            }, this);
        };

        editor_plugin.update_size = function() {
            // TODO: if (layout.small) {
            var width = "auto",
                height = $('.plugin-content[plugin="editor"]').height() - 70;
            editor.setSize(width, height);
            editor.refresh();
        };

        editor_plugin.init_resize_updates = function() {
            $(window).resize(this.update_size);
        };

        editor_plugin.render = function() {
            $('.CodeMirror').css('opacity', this.enabled() ? 1 : 0.5);
        };

        editor_plugin.flow(editor_plugin.enabled).run(editor_plugin.render);

        return editor_plugin;
    });

});
