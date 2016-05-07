define(function() {

    return function() {

        this.Given(/user opens info plugin/, function(done) {
            this.user.open_plugin('info');
            done();
        });

        this.Then(/info plugin is active/, function(done) {
            this.assert.active_plugin_is('info');
            done();
        });


    };

});