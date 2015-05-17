define(function (require) {

    var base = require('views/plugins/plugin'),
        off = require('off'),
        handlebar = require('views/components/handlebar');

    /**
     *
     * @module SavePlugin
     */
    return off(function () {
        var self = base('stats', 'stats');
        self.$name('StatsPlugin');

        self.init.override(function($super){
            $super();

            var content = handlebar('plugins/stats');
            this.add(content);
        });

        return self;
    });

});