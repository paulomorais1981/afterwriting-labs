define(function(require) {

    var Browser = require('acceptance/helper/browser'),
        Proxy = require('acceptance/helper/proxy'),
        User = require('../helper/user'),
        Assert = require('../helper/assert'),
        Dom = require('../helper/dom'),
        FakeDropBox = require('acceptance/helper/server/fake-dropbox');

    return function() {

        this.World = function() {
            this.proxy = Proxy.create();
            this.dropbox = FakeDropBox.create();
            this.proxy.register_server(this.dropbox);

            this.browser = Browser.create();

            this.dom = Dom.create();

            this.user = User.create(this.browser, this.dom);
            this.assert = Assert.create(this.dom);
        };

        this.Before(function() {
            this.proxy.setup();
            this.browser.setup();

            this.browser.tick(5000);
        });

        this.After(function() {

            this.user.back_to_main();

            this.proxy.restore();
            this.browser.restore();
        });
    }

});