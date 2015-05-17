define(function(require){

    var layout = require('utils/layout'),
        FactsPlugin = require('views/plugins/facts');

    var module = {};

    module.init = function() {
        add_facts_to_layout();
    };

    function add_facts_to_layout() {
        var facts = FactsPlugin();
        layout.add_plugin(facts);
    }

    return module;

});