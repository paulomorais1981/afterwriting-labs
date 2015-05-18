define(function(require){

    var FountainEditor = require('views/components/fountaineditor'),
        EditorPlugin = require('views/plugins/editor'),
        off = require('off'),
        data = require('modules/data');

    var module = {};

    module.editor_activated = off.signal();

    module.init = function(state) {

        EditorPlugin.add(function(editor){
            editor.activate.add(module.editor_activated);
        });

        FountainEditor.as('main-fountain-editor').add(function(editor){
            editor.changed.add(data.script);
            module.editor_activated.add(function(){
                editor.text(data.script());
            });
        });

        data.script.add(function(){
            console.log('data udoate');
        })
    };

    return module;

});