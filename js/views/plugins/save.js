define(function (require) {

    var base = require('views/plugins/plugin'),
        off = require('off'),
        handlebar = require('views/components/handlebar');

    /**
     *
     * @module SavePlugin
     */
    return off(function () {
        var self = base('save', 'save');
        self.$name('SavePlugin');

        self.init.override(function($super){
            $super();

            var content = handlebar('plugins/save');
            this.add(content);
        });

        return self;
    });

});