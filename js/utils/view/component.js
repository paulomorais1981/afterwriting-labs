define(function (require) {

    var off = require('off'),
        flow = require('utils/view/flow');

    return function() {

        var component = {
            name: "Component",
            flow: flow(),
            initialized: off.property(),
            children: []
        };

        component.init = off(function (element) {
            if (element) {
                this.container = element;
            }
        });

        component.init.add(function() {
            this.initialized(true);
        });

        component.initialized.add(function () {
            component.children.forEach(function (child) {
                child.init();
            });
        });

        component.destroy = off(function () {
            component.children.forEach(function (child) {
                component.remove(child);
            });
        });

        component.destroy.add(function(){
            this.initialized(false);
        });

        component.add = off(function (child) {
            if (!component.container) {
                console.error("Component", component.name, "does not support adding children. Child:", child);
                throw new Error("Component does not support adding children.");
            }

            component.children.push(child);
            child.parent = component.container;
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

        return component;
    }
});