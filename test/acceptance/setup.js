define(['../../test/acceptance/tests'], function (tests) {

    var module = {};

    var enabled = window.location.search.indexOf('ACCEPTANCE') !== -1 || navigator.userAgent.indexOf('PhantomJS') !== -1;

    module.prepare = function () {
        if (enabled) {
            // XXX: fake timer created to skip the animation at the beginning
            window.clock = sinon.useFakeTimers();
        }
    };

    module.windup = function () {
        var enabled = window.location.search.indexOf('ACCEPTANCE') !== -1 || navigator.userAgent.indexOf('PhantomJS') !== -1;
        if (enabled) {
            window.clock.tick(5000);
            window.clock.restore();
            //mocha.run();

            var cucumber = Cucumber(tests.features, tests.supportCode);

            var listener = Cucumber.Listener();

            listener.handleStepResultEvent = function handleStepResult(event, callback) {
                var stepResult = event.getPayloadItem('stepResult');
                var status = stepResult.getStatus();
                var step = stepResult.getStep();
                console.log(step.getScenario().getName() + ': ' + step.getName(), status);
                callback();
            };

            listener.handleFeaturesResultEvent = function handleFeaturesResultEvent(event, callback) {
                var featuresResult = event.getPayloadItem('featuresResult');
                console.log(featuresResult.isSuccessful() ? 'SUCCESS' : 'FAILED');
                callback();
            };

            cucumber.attachListener(listener);

            cucumber.start(function() {});
        }
    };

    return module;
});
