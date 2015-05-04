define(function(require){

    var layout = require('utils/layout'),
        fquerysandbox = require('plugins/dev/fquerysandbox');

    var module = {};

    module.init = function() {
        layout.add_plugin(fquerysandbox);
    };

    return module;

});