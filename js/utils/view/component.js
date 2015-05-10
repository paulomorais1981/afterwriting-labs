define(function (require) {

    var off = require('off'),
        flow = require('utils/view/flow');

    return function() {

        var component = {
            flow: flow(),
            $bubble: off.signal(),
            initialized: off.property(),
            children: off.property([]),
            $names: off.property([])
        };

        component.$name = off.property("", function(value, guard){
            if (value) {
                component.$names().push(value);
            }
            return guard(value);
        });

        component.is = off(function(name){
            return this.$names().indexOf(name) !== -1;
        });

        component.$name("BaseComponent");

        component.init = off(function (element) {
            if (element) {
                this.container = element;
            }
        });

        component.init.add(function() {
            this.initialized(true);
        });

        component.initialized.add(function () {
            component.children().forEach(function (child) {
                component.init_child(child);
            });
        });

        component.destroy = off(function () {
            component.children().forEach(function (child) {
                component.remove(child);
            });
        });

        component.destroy.add(function(){
            this.initialized(false);
        });

        component.add = off(function (child) {
            component.children().push(child);

            if (component.initialized()) {
                component.init_child(child);
            }
        });

        component.remove = off(function (child) {
            var index = component.children().indexOf(child);
            if (index !== -1) {
                component.destroy_child(child);
                component.children().splice(index, 1);
            }
        });

        component.init_child = off(function(child) {
            if (!component.container) {
                throw new Error("Component " + component.$name + " does not support adding children. Child: " + child.$name);
            }
            child.parent = component.container;
            child.$bubble.add(component.$bubble);
            child.init();
        });

        component.destroy_child = off(function(child) {
            child.parent = null;
            child.$bubble.remove(component.$bubble);
            child.destroy();
        });

        component.expose = function(name, off_method) {
            off_method.add(function(data){
                this.$bubble({component: component, name: name, data: data})
            }.bind(this));
            return off_method;
        };

        component.watch = function(name) {
            var observer = off.signal();
            this.$bubble.add(function(data){
                if (data.name === name) observer.call(data.component, data.data);
            });
            return observer;
        };

        return component;
    }
});