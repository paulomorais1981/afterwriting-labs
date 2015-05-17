define(function (require) {

    var base = require('views/plugins/plugin'),
        off = require('off'),
        handlebar = require('views/components/handlebar');

    /**
     *
     * @module SavePlugin
     */
    return off(function () {
        var self = base('facts', 'facts');
        self.$name('FactsPlugin');

        self.init.override(function($super){
            $super();

            var content = handlebar('plugins/facts');
            this.add(content);
        });

        return self;
    });

});