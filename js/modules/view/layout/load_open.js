define(function(require){

    var layout = require('utils/layout'),
        open = require('plugins/open'),
        OpenPlugin = require('views/plugins/open');

    var module = {};

    module.init = function(state) {

        OpenPlugin.add(function(open_plugin){
            open_plugin.watch('info_header_opened').add(function(value){
                console.warn('TODO: Track user event. Info header opened: ', value);
            });

            open_plugin.show_dropbox(open.is_dropbox_available());
            open_plugin.show_google_drive(open.is_google_drive_available());

            open_plugin.last_used(open.context.last_used);

            open_plugin.create_new.add(open.create_new);
            open_plugin.open_from_dropbox.add(open.open_from_dropbox);
            open_plugin.open_from_google_drive.add(open.open_from_google_drive);
            open_plugin.open_last_used.add(open.open_last_used);
            open_plugin.open_sample.add(open.open_sample);
            open_plugin.open_file.add(open.open_file);
        });

        var open_plugin = OpenPlugin();
        layout.add_plugin(open_plugin);
    };

    return module;

});