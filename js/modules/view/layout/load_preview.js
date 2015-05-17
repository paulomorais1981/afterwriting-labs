define(function(require){

    var layout = require('utils/layout'),
        PreviewPlugin = require('views/plugins/preview');

    var module = {};

    module.init = function() {
        add_preview_to_layout();
    };

    function add_preview_to_layout() {
        var preview = PreviewPlugin();
        layout.add_plugin(preview);
    }

    return module;

});