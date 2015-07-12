define(function(require){

    var MainFountainEditor = require('views/components/fountaineditor').as('main-fountain-editor'),
        EditorPlugin = require('views/plugins/editor'),
        off = require('off'),
        data = require('modules/data');

    var module = {};

    module.editor_activated = off.signal();

    module.init = function() {
        wait_for_editor_to_be_active();
        update_content_when_editor_is_activated();
        update_script_when_editor_content_changes();
    };

    /**
     * Expose signal informing about editor plugin being activated
     */
    function wait_for_editor_to_be_active() {
        EditorPlugin.add(function(editor){
            editor.activate.add(module.editor_activated);
        });
    }

    /**
     * Updates the content when editor plugin is activated.
     * There's no need to update the content each time script changes - editor plugin
     * might be not visible, and we don't want to trigger circular updates when user
     * types in the editor.
     */
    function update_content_when_editor_is_activated() {
        MainFountainEditor.add(function(fountain_editor){
            module.editor_activated.add(function(){
                fountain_editor.text(data.script());
            });
        });
    }
    /*
    feature("main_editor -> *", function(editor){
        module
    }
     */


    /**
     * Each time user changes the content - script is updated.
     */
    function update_script_when_editor_content_changes() {
        MainFountainEditor.as('main-fountain-editor').add(function(fountain_editor){
            fountain_editor.changed.add(data.script);
        });
    }

    return module;

});