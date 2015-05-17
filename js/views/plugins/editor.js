define(function(require){

    var off = require('off'),
        $ = require('jquery'),
        cm = require('libs/codemirror/lib/codemirror'),
        common = require('utils/common'),
        handlebar = require('views/components/handlebar'),
        base = require('views/plugins/plugin'),
        component = require('utils/view/component'),
        infoheader = require('views/components/infoheader');

    /**
     * Editor plugin factory
     * @module EditorPlugin
     */
    return off(function(){
        var self = base('editor', 'editor', true);

        /**
         * Editor's enabled flag
         * @var {boolean} enabled
         */
        self.enabled = off.property(true);

        /**
         * Optional, additional components to add in top right corner
         * @var {Component[]} additional_icons
         */
        self.additional_icons = off.property([]);

        /**
         * Init
         * @function
         */
        self.init.override(function($super){
            $super();

            var header = infoheader();
            header.title('Fountain Editor');
            header.info('Just a basic fountain editor. Use Ctrl-Space for auto-complete. Go to fountain.io for more details about Fountain format.');
            this.add(header);

            self.content = handlebar('plugins/editor')
            self.add(self.content);
            self.flow(self.content.init).run(self.init_content).dynamic();
        });

        /**
         * Active the plugin
         */
        self.activate.override(function($super){
            $super();
            self.update_size();
        });

        self.create_editor = off(function() {

            var text_area = $('#editor-textarea').get(0);
            self.editor = cm.fromTextArea(text_area, {
                mode: "fountain",
                lineNumbers: false,
                lineWrapping: true,
                styleActiveLine: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete"
                }
            });
        });

        self.init_content = off(function() {
            self.create_editor();
            self.update_size();
            self.init_resize_updates();
            self.create_icons_placeholder();
            self.render();
        });

        self.create_icons_placeholder = function() {
            self.icons_placeholder = component();
            self.icons_placeholder.init($('#additional_icons').get(0));
            self.manage(this.icons_placeholder);

            if (self.additional_icons().length == 0) {
                $('#separator').hide();
            }

            self.additional_icons().forEach(function(icon){
                self.icons_placeholder.add(icon);
            });
        };

        self.update_size = off(function() {
            // TODO: if (layout.small) {
            var width = "auto",
                height = $('.plugin-content[plugin="editor"]').height() - 70;
            self.editor.setSize(width, height);
            self.editor.refresh();
        });

        self.init_resize_updates = off(function() {
            $(window).resize(self.update_size);
        });

        self.render = off(function() {
            $('.CodeMirror').css('opacity', this.enabled() ? 1 : 0.5);
        });

        self.flow(self.enabled).run(self.render);

        return self;
    });

});
