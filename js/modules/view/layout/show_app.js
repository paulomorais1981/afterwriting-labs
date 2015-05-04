define(function(require){

    var bootstrap = require('bootstrap'),
        layout = require('utils/layout'),
        $ = require('jquery');

    var module = {};

    module.init = function() {
        bootstrap.initialized.add(this.init_layout);
    };

    module.init_layout =  function() {
        $('#loader').remove();
        layout.init_layout();
    };

    return module;
});