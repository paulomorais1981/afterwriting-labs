define(function(require){

    var layout = require('utils/layout'),
        facts = require('plugins/facts');

    var module = {};

    module.prepare = function() {
        layout.add_plugin(facts);
    };

    return module;

});