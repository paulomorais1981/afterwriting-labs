define(function(require){

    var off = require('off'),
        $ = require('jquery'),
        common = require('utils/common'),
        handlebar = require('views/components/handlebar'),
        base = require('views/plugins/plugin'),
        Component = require('utils/view/component'),
        FountainEditor = require('views/components/fountaineditor').as('main-fountain-editor'),
        InfoHeader = require('views/components/infoheader').as('top-header');

    /**
     * Editor plugin factory
     * @module EditorPlugin
     */
    return off(function(){
        var self = base('editor', 'editor', true);

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

            var header = InfoHeader();
            header.title('Fountain Editor');
            header.info('Just a basic fountain editor. Use Ctrl-Space for auto-complete. Go to fountain.io for more details about Fountain format.');
            this.add(header);

            self.content = handlebar('plugins/editor');
            self.add(self.content);

            self.fountain_editor = FountainEditor();
            self.add(self.fountain_editor);

            self.flow(self.content.init).run(self.init_content).dynamic();
        });

        /**
         * Active the plugin
         */
        self.activate.override(function($super){
            $super();
            self.update_size();
        });

        self.init_content = off(function() {
            self.init_resize_updates();
            self.create_icons_placeholder();
        });

        self.create_icons_placeholder = function() {
            self.icons_placeholder = Component();
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
            var height = $('.plugin-content[plugin="editor"]').height() - 70;
            self.fountain_editor.set_size('auto', height);
        });

        self.init_resize_updates = off(function() {
            $(window).resize(self.update_size);
        });

        return self;
    });

});
