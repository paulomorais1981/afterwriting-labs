define(function (require) {

    var base = require('views/plugins/plugin'),
        off = require('off'),
        handlebar = require('views/components/handlebar');

    /**
     *
     * @module SavePlugin
     */
    return off(function () {
        var self = base('preview', 'view');
        self.$name('PreviewPlugin');

        self.init.override(function($super){
            $super();

            var content = handlebar('plugins/preview');
            this.add(content);
        });

        return self;
    });

});