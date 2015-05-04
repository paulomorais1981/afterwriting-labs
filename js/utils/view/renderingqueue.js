define(function (require) {

    var off = require('off');

    return function () {

        var rendering_queue,
            _triggered = false,
            method,
            self;

        rendering_queue = {
            context: null,
            queue: [],
            queue_cleaned: off.signal()
        };

        self = rendering_queue;

        rendering_queue.add = function (method) {
            if (self.queue.indexOf(method) === -1) {
                self.queue.push(method);
            }
            self.trigger();
        };

        rendering_queue.clean = off(function () {
            self.queue = [];
        });

        rendering_queue.trigger = function () {
            if (!_triggered) {
                _triggered = true;
                window.requestAnimationFrame(function () {
                    while (method = self.queue.pop()) {
                        method.bind(self.context)();
                    }
                    _triggered = false;
                    self.clean();
                });
            }
        };

        return rendering_queue;
    };

});