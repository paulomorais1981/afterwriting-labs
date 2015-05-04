define(function (require) {
    var base = require('utils/view/component');

    return function (element) {
        var component = base();

        component.init.override(function ($super) {
            component.root = element;
            $super();
        });

        component.init();
        return component;
    }
});