define(function(require){

    var layout = require('utils/layout'),
        SyncIcon = require('views/components/syncicon').as('main-sync'),
        EditorPlugin = require('views/plugins/editor'),
        FountainEditor = require('views/components/fountaineditor');

    var module = {
        sync_available: off.property(true),
        sync_enabled: off.property(false)
    };

    module.init = function() {

        EditorPlugin.add(function(editor){
            var sync_icon = add_sync_icon_to_the_editor(editor);
            handle_sync();
            restore_content(sync_icon);
            switch_sync(sync_icon);
            hide_icon_when_sync_is_not_available(sync_icon);
        });

        FountainEditor.as('main-fountain-editor').add(function(fountain_editor){
            disable_editor_when_sync(fountain_editor);
        });
    };

    /*
     feature("editor -> *", function(editor) {
         editor.additional_icons().push(SyncIcon);
     });
     feature("model.sync_enabled -> log");
     feature("model.sync_enabled -> sync_icon.is_sync");
     feature("model.sync_enabled -> $not -> fountain_editor.enabled")
     feature("sync_icon.toggle_sync -> module.toggle_sync");
     feature("module.sync_available -> sync_icon.visible");
     */

    function add_sync_icon_to_the_editor(editor) {
        var sync_icon = SyncIcon();
        editor.additional_icons().push(sync_icon);
        return sync_icon;
    }

    function handle_sync() {
        module.sync_enabled.bind(function(value){
            console.log("Sync:",value);
        });
    }


    function switch_sync(sync_icon) {
        module.sync_enabled.bind(sync_icon.is_sync);
        sync_icon.toggle_sync.add(function(){
            module.sync_enabled(!module.sync_enabled());
        });
    }

    function disable_editor_when_sync(fountain_editor) {
        module.sync_enabled.bind(function(is_sync){
            fountain_editor.enabled(!is_sync);
        });
    }

    function restore_content(sync_icon) {
        sync_icon.restore.add(function(){
            console.log("restore");
        });
    }

    function hide_icon_when_sync_is_not_available(sync_icon) {
        module.sync_available.bind(sync_icon.visible);
    }

    return module;

});