define(function(require){

    var layout = require('utils/layout'),
        editor = require('plugins/editor');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(editor);
    };

    return module;

});