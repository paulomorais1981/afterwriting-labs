define(function(require) {

    var TemplateView = require('view/templateview'),
        Common = require('utils/common'),
        jQuery = require('jquery'),
        // TODO: how to inject layout? to the view? to the plugin? layout as a plugin? main view?
        Layout = require('utils/layout'),
        template = require('text!../../html/template/editor.html');

    var EditorView = TemplateView.extend({

        editor: {
            inject: 'editor'
        },

        template: template,

        // TODO: shall common be injected or static?
        sync_on_icon: Common.data.static_path + 'gfx/icons/other/sync.svg',
        sync_off_icon: Common.data.static_path + 'gfx/icons/other/no-sync.svg',

        init: function() {
            jQuery(window).resize(this.resize.bind(this));
            var $ = this.$$.bind(this);
            TemplateView.init.call(this);
            this.editor.create_editor($('#editor-textarea').get(0));

            $('a[action="sync-fountain"]').click(function() {
                if (this.editor.is_sync()) {
                    this.editor.toggle_sync();
                    $.prompt('Synchronization turned off.', {
                        buttons: {
                            'Keep content': true,
                            'Load version before sync': false
                        },
                        submit: function(e, v) {
                            if (!v) {
                                this.editor.restore();
                            }
                        }.bind(this)
                    });
                }
                else {
                    this.editor.store();
                    $.prompt("You can start writing in your editor. Content will be synchronized with ’afterwriting! PDF preview, facts and stats will be automatically updated.", {
                        buttons: {
                            'OK': true,
                            'Cancel': false
                        },
                        submit: function(e, v) {
                            if (v) {
                                this.editor.toggle_sync();
                            }
                        }.bind(this)
                    });
                }
            });

            $('a[action="auto-save"]').click(function() {
                if (this.editor.is_sync()) {
                    $.prompt('This will turn auto-reload off. Do you wish to continue?', {
                        buttons: {
                            'Yes': true,
                            'No': 'false'
                        },
                        submit: function(e, v) {
                            if (v) {
                                this.editor.toggle_auto_save();
                            }
                        }.bind(this)
                    });
                }
                else {
                    this.editor.toggle_auto_save();
                }
            }.bind(this));

            this.editor.activate.add(function() {
                if (this.editor.sync_available()) {
                    $('a[action="sync-fountain"]').parent().show();
                }
                else {
                    $('a[action="sync-fountain"]').parent().hide();
                }

                if (this.editor.auto_save_available()) {
                    $('a[action="auto-save"]').parent().show();
                }
                else {
                    $('a[action="auto-save"]').parent().hide();
                }
                this.update_sync_layout();
                this.resize();
            }.bind(this));

            this.editor.toggle_sync.add(function() {
                this.update_sync_layout();
            }.bind(this));

            this.editor.toggle_auto_save.add(function() {
                this.update_sync_layout();
            }.bind(this));

            this.editor.save_in_progress.add(this.update_auto_save_icon.bind(this));
            this.editor.pending_changes.add(this.update_auto_save_icon.bind(this));

        },

        resize: function() {
            var plugin_content = jQuery(this.root.parentNode);
            if (Layout.small) {
                this.editor.set_size("auto", plugin_content.height() - 70);
            }
            else {
                this.editor.set_size("auto", plugin_content.height() - 100);
            }
        },

        update_sync_layout: function() {
            var $ = this.$$.bind(this);
            $('.auto-reload-icon')
                .attr('src', this.editor.is_sync() ? this.sync_on_icon : this.sync_off_icon)
                .attr('title', this.editor.is_sync() ? 'Turn auto-reload off' : 'Turn auto-reload on');
            $('.auto-save-icon')
                .attr('src', this.editor.is_auto_save() ? this.sync_on_icon : this.sync_off_icon)
                .attr('title', this.editor.is_auto_save() ? 'Turn auto-save off' : 'Turn auto-save on');
            $('.CodeMirror').css('opacity', this.editor.is_sync() ? 0.5 : 1);
        },

        update_auto_save_icon: function() {
            var $ = this.$$.bind(this);
            if (this.editor.is_auto_save()) {
                if (this.editor.pending_changes() || this.editor.save_in_progress()) {
                    $('.auto-save-icon').addClass('in-progress');
                }
                else {
                    $('.auto-save-icon').removeClass('in-progress');
                }

                if (this.editor.save_in_progress()) {
                    $('.auto-save-icon').addClass('rotate');
                }
                else {
                    $('.auto-save-icon').removeClass('rotate');
                }
            }
            else {
                $('.auto-save-icon').removeClass('rotate');
                $('.auto-save-icon').removeClass('in-progress');
            }
        }
    });

    return EditorView;
});