define(function (require) {

    var off = require('off'),
        flow = require('utils/view/flow');

    return function () {

        var component = {
            flow: flow(),
            initialized: off.property(),
            children: []
        };

        component.init = off(function () {
            this.initialized(true);
        });
        component.destroy = off(function () {
            component.children.forEach(function (child) {
                component.remove(child);
            });
            this.initialized(false);
        });

        component.add = off(function (child) {
            component.children.push(child);
            child.parent = component.container || component.root;
            if (component.initialized()) {
                child.init();
            }
        });
        component.remove = off(function (child) {
            var index = component.children.indexOf(child);
            if (index !== -1) {
                child.destroy();
                children.splice(index, 1);
            }
        });

        component.initialized.add(function () {
            component.children.forEach(function (child) {
                child.init();
            });
        });

        return component;
    }
});