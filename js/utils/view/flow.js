define(function(require){

    var rendering_queue = require('utils/view/renderingqueue'),
        off = require('off');

    return function() {

        var queue = rendering_queue();

        return function() {
            var self = this, trigger = off.property(), sources;

            // retrieve all sources that will trigger rendering
            sources = Array.prototype.slice.call(arguments);

            // update queue context
            queue.context = self;

            // check whether initialized property is defined
            self.initialized = self.initialized || off.property(false);
            // trigger rendering on initialization by default (can be turned off using .dynamic())
            self.initialized.add(trigger);

            // clean trigger flag after cleaning rendering queue
            queue.clean.add(function(){
                trigger(false);
            });

            // bind sources with trigger
            sources.forEach(function(source){
                source.add(function(){
                    trigger(true);
                });
            });

            var options = {
                // define rendering methods invokes when at least one
                // source has changed and component is initialized
                run: function() {
                    var destinations = Array.prototype.slice.call(arguments);

                    trigger.add(function(value){
                        if (trigger() && self.initialized()) {
                            destinations.forEach(queue.add);
                        }
                        else {
                            // clears trigger if component was not initialized
                            trigger(false);
                        }
                    });
                    return options;
                },

                dynamic: function() {
                    // remove auto-triggering for dynamic flows
                    self.initialized.remove(trigger);
                    return options;
                }
            };

            return options;
        }
    };

});