define(function(require){

    var registry = require('utils/registry');

    var module = {};

    module.init = function(state) {
        state.view_registry = registry.create();
    };

    return module;
});