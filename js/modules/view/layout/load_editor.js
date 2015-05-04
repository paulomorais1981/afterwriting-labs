define(function(require){

    var layout = require('utils/layout'),
        editor = require('plugins/editor');

    var module = {};

    module.init = function() {
        layout.add_plugin(editor);
    };

    return module;

});