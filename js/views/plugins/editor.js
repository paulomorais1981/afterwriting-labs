define(function(require){

    var off = require('off'),
        $ = require('jquery'),
        common = require('utils/common'),
        handlebar = require('views/components/handlebar'),
        base = require('views/plugins/plugin'),
        Component = require('utils/view/component'),
        FountainEditor = require('views/components/fountaineditor').as('main-fountain-editor'),
        IconButton = require('views/components/iconbutton').as('editor-save-icon'),
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
         * @event save_as_fountain - dispatched when user clicks on save as fountain icon
         */
        self.save_as_fountain = off.signal();

        /**
         * @event
         */
        self.save_to_dropbox = off.signal();

        /**
         * @event
         */
        self.save_to_googledrive = off.signal();

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
            self.create_left_icons_placeholder();
        });

        self.create_left_icons_placeholder = function() {
            self.left_icons_placeholder = Component();
            self.left_icons_placeholder.init($('#left-icons').get(0));
            self.manage(this.left_icons_placeholder);

            if (self.additional_icons().length == 0) {
                $('#separator').hide();
            }

            self.additional_icons().forEach(function(icon){
                self.left_icons_placeholder.add(icon);
            });

            self.create_base_icons();
        };

        /**
         * Create save icons
         */
        self.create_base_icons = off(function(){
            self.right_icons_placeholder = Component();
            self.right_icons_placeholder.init($('#right-icons').get(0));
            self.manage(this.right_icons_placeholder);

            var save_fountain = IconButton();
            save_fountain.title('save .fountain: ');
            save_fountain.src(common.data.static_path + 'gfx/icons/other/download.svg');
            save_fountain.link_title('Download Fountain file');
            save_fountain.clicked.add(self.save_as_fountain);
            self.right_icons_placeholder.add(save_fountain);

            var save_dropbox = IconButton();
            save_dropbox.src(common.data.static_path + 'gfx/icons/other/dropbox.svg');
            save_dropbox.link_title('Upload Fountain file to Dropbox');
            save_dropbox.clicked.add(self.save_to_dropbox);
            self.right_icons_placeholder.add(save_dropbox);

            var save_googledrive = IconButton();
            save_googledrive.src(common.data.static_path + 'gfx/icons/other/gd.svg');
            save_googledrive.link_title('Upload Fountain file to Google Drive');
            save_googledrive.clicked(self.save_to_googledrive);
            self.right_icons_placeholder.add(save_googledrive);
        });

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
