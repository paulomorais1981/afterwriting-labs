define(function (require) {

    var off = require('off'),
        flow = require('utils/view/flow');

    /**
     * Base Component factory.
     * @module Component
     */
    return off(function() {

        var component = {};

        /**
         * Flow definition. Usage:
         * component.flow(signal, signal, ...).run(method, method, ...)
         * This will run each method (on next rendering frame) after one of the signals is dispatched (only
         * if component is already initialized).
         * @function flow
         */
        component.flow = flow();

        /**
         * @var {boolean} initialized - true if component has been initialized
         */
        component.initialized = off.property();

        /**
         * List of component children. Use add to add a new child/
         * @var {component[]} children
         */
        component.children = off.property([]);

        /**
         * @private
         */
        component.$bubble = off.signal();

        /**
         * Full name chain
         * @private
         */
        component.$names = off.property([]);

        /**
         * Component name
         */
        component.$name = off.property("");

        component.$name.add(function(value){
            if (value) {
                component.$names().push(value);
            }
        });

        /**
         * Checks if name exist in the current component name-chain
         * @function is
         * @param {string} name - name to check
         * @returns {boolean}
         */
        component.is = off(function(name){
            return this.$names().indexOf(name) !== -1;
        });

        component.$name("BaseComponent");

        component.init = off(function (element) {
            if (element) {
                this.container = element;
            }
            else if (arguments.length === 1) {
                throw new Error("Component initialization failed: element does not exits");
            }
        });

        component.init.add(function() {
            this.actions();
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
                throw new Error("Component " + component.$name() + " does not support adding children. Child: " + child.$name());
            }
            child.parent = component.container;
            child.$bubble.add(component.$bubble);
            child.init();
        });

        component.manage = off(function(child){
            component.children().push(child);
            child.$bubble.add(component.$bubble);
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

        component.actions = off(function(){});

        return component;
    });
});