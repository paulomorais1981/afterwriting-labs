/*global define*/
define(['logger', 'utils/decorator'], function (logger, decorator) {

	var log = logger.get('bootstrap'),
		module = {};

	module.initialized = decorator.signal();

	module.init = function (modules) {
		modules = Array.prototype.splice.call(modules, 0);

		log.info('Modules preparation.');
		modules.forEach(function (module) {
			if (module.prepare && typeof (module.prepare) === 'function') {
				module.prepare();
			}
		});

		log.info('Modules windup.');
		modules.forEach(function (module) {
			if (module.windup && typeof (module.windup) === 'function') {
				module.windup();
			}
		});

		log.info('Bootstrapping finished.');
		this.initialized();
	};

	module.init = decorator(module.init);

	return module;
});