/*global define*/
define(['logger', 'off'], function (logger, off) {

	var log = logger.get('bootstrap'),
		module = {};

	module.initialized = off.signal();

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

	module.init = off(module.init);

	return module;
});