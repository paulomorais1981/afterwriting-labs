define(function(require){

    var off = require('off');

    var context = {refs:{}};

    var regexp = / ?when ?| ?then ?/;

    context.object = function(id, object) {
        if (arguments.length === 1) {
            return context.refs[id];
        }
        else {
            context.refs[id] = object;
        }
    };

    context.feature = function(description) {
        var r = description.split(regexp);
        var signals = Array.prototype.slice.call(r, 1);

        var source = signals[0];
        var steps = signals.slice(1);

        var flow = context.object(source);
        while (steps.length) {
            var signal = steps.shift();

            var step = off(function(signal, value) {
                return context.object(signal)(value);
            }.bind(null, signal));

            flow.add(step);
            flow = step;
        }

    };

    return context;
});