define(function(require){

    var layout = require('utils/layout'),
        OpenPlugin = require('views/plugins/open');

    var module = {};

    module.init = function(state) {
        var open_plugin = OpenPlugin();
        state.view_registry.add('open', open_plugin);

        open_plugin.watch('info_header_opened').add(function(value){
            console.warn('TODO: Track user event. Info header opened: ', value);
        });

        layout.add_plugin(open_plugin);


    };

    return module;

});