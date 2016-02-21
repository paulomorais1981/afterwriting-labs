define(function(require) {

    var logger = require('logger'),
        templates = require('templates'),
        editor = require('plugins/editor'),
        data = require('modules/data'),
        helper = require('utils/helper'),
        decorator = require('utils/decorator'),
        $ = require('jquery'),
        gd = require('utils/googledrive'),
        db = require('utils/dropbox'),
        local = require('utils/local'),
        tree = require('utils/tree'),
        save = require('plugins/save'),
        layout = require('utils/layout'),
        Plugin = require('plugins/plugin'),
        OpenView = require('view/openview');

    var OpenPlugin = Plugin.extend({
        name: 'open',
        title: 'open',
        class: 'active',

        last_session_script: null,

        last_session_script_loaded: false,

        context: {
            value: {
                last_used: {}
            }
        },

        view: {
            value: OpenView.create()
        },

        $create: function() {
            this.open_file_dialog = decorator.signal();
        },

        set_script: function(value) {
            this.clear_last_opened();
            editor.set_sync(false);
            editor.set_auto_save(false);
            data.script(value);
            layout.show_main();
        },

        clear_last_opened: function() {
            data.format = undefined;
            data.data('db-path', '');
            data.data('gd-link', '');
            data.data('gd-fileid', '');
            data.data('gd-pdf-id', '');
            data.data('db-pdf-path', '');
            data.data('fountain-filename', '');
            data.data('pdf-filename', '');
            local.local_file(null);
        },

        open_last_used: function(startup) {
            if (this.last_session_script_loaded) {
                this.set_script(this.last_session_script || '');
            }
            return startup;
        },

        open_file: function(selected_file) {
            var finished = decorator.signal();
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function() {
                var value = this.result;
                self.set_script(value);
                local.local_file(selected_file);
                finished(data.format);
            };
            fileReader.readAsText(selected_file);
            return finished;
        },

        create_new: function() {
            this.set_script('');
        },

        open_sample: function(name) {
            var template_name = 'templates/samples/' + name + '.fountain';
            var text = templates[template_name]();
            this.set_script(text);
        },

        is_dropbox_available: function() {
            return window.location.protocol !== 'file:';
        },

        is_google_drive_available: function() {
            return window.gapi && window.location.protocol !== 'file:';
        },

        open_from_cloud: function(client, back_callback, load_callback) {
            client.list(function(root) {
                root = typeof root !== 'function' ? client.convert_to_jstree(root) : root;
                tree.show({
                    info: 'Please select file to open.',
                    data: root,
                    label: 'Open',
                    search: !data.config.cloud_lazy_loading,
                    callback: function(selected) {
                        if (selected.data.isFolder) {
                            $.prompt('Please select a file, not folder.', {
                                buttons: {
                                    'Back': true,
                                    'Cancel': false
                                },
                                submit: function(v) {
                                    if (v) {
                                        back_callback();
                                    }
                                }
                            });
                        } else {
                            load_callback(selected);
                        }
                    }
                });
            }, {
                before: function() {
                    $.prompt('Please wait...');
                },
                after: $.prompt.close,
                lazy: data.config.cloud_lazy_loading
            });
        },

        open_from_dropbox: function() {
            var finished = decorator.signal();
            this.open_from_cloud(db, this.open_from_dropbox.bind(this), function(selected) {
                db.load_file(selected.data.path, function(content) {
                    this.set_script(content);
                    data.data('db-path', selected.data.path);
                    finished(data.format);
                }.bind(this));
            }.bind(this));
            return finished;
        },

        open_from_google_drive: function() {
            var finished = decorator.signal();
            this.open_from_cloud(gd, this.open_from_google_drive.bind(this), function(selected) {
                gd.load_file(selected.data.id, function(content, link, fileid) {
                    this.set_script(content);
                    data.data('gd-link', link);
                    data.data('gd-fileid', fileid);
                    data.data('gd-parents', selected.parents.slice(0, selected.parents.length - 2).reverse());
                    finished(data.format);
                }.bind(this));
            }.bind(this));
            return finished;
        },

        init: function() {
            this.log.info("Init: script handlers");
            data.script.add(function() {
                var title = '';
                data.data('last-used-script', data.script());
                data.data('last-used-date', helper.format_date(new Date()));
                if (data.script()) {
                    var title_match;
                    var wait_for_non_empty = false;
                    data.script().split('\n').some(function(line) {
                        title_match = line.match(/title\:(.*)/i);
                        if (wait_for_non_empty) {
                            title = line.trim().replace(/\*/g, '').replace(/_/g, '');
                            wait_for_non_empty = !title;
                        }
                        if (title_match) {
                            title = title_match[1].trim();
                            wait_for_non_empty = !title;
                        }
                        return title && !wait_for_non_empty;
                    });
                }
                data.data('last-used-title', title || 'No title');
            });
            save.gd_saved.add(function(item) {
                this.clear_last_opened();
                data.data('gd-link', item.alternateLink);
                data.data('gd-fileid', item.id);
                data.data('filename', '');
                if (editor.is_active) {
                    editor.activate(); // refresj
                }
            });
            save.db_saved.add(function(path) {
                this.clear_last_opened();
                data.data('db-path', path);
                data.data('filename', '');
                if (editor.is_active) {
                    editor.activate(); // refresh
                }
            });

            this.last_session_script_loaded = false;
            if (data.data('last-used-date')) {
                data.data('filename', '');
                this.log.info('Last used exists. Loading: ', data.data('last-used-title'), data.data('last-used-date'));
                this.context.last_used.script = data.data('last-used-script');
                this.context.last_used.date = data.data('last-used-date');
                this.context.last_used.title = data.data('last-used-title');
                this.last_session_script = data.data('last-used-script');
                this.last_session_script_loaded = true;
            }
        }
    });

    return OpenPlugin.create();

});