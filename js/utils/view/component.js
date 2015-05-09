define(function (require) {

    var off = require('off'),
        flow = require('utils/view/flow');

    return function() {

        var component = {
            $name: "BaseComponent",
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
                component.init_child(child);
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
            component.children.push(child);

            if (component.initialized()) {
                component.init_child(child);
            }
        });

        component.remove = off(function (child) {
            var index = component.children.indexOf(child);
            if (index !== -1) {
                child.destroy();
                children.splice(index, 1);
            }
        });

        component.init_child = function(child) {
            if (!component.container) {
                throw new Error("Component " + component.$name + " does not support adding children. Child: " + child.$name);
            }
            child.parent = component.container;
            child.init();
        };

        return component;
    }
});