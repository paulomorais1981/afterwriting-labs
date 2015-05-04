define(function(require){

    var layout = require('utils/layout'),
        facts = require('plugins/facts');

    var module = {};

    module.init = function() {
        layout.add_plugin(facts);
    };

    return module;

});