/*global define*/
define(['logger', 'off'], function (logger, off) {

	var log = logger.get('bootstrap'),
		module = {};

	module.initialized = off.signal();

	module.init = function (modules) {
		modules = Array.prototype.splice.call(modules, 0);

		log.info('Modules preparation.');
		modules.forEach(function (module) {
			if (module !== this && module.init && typeof (module.init) === 'function') {
				module.init();
			}
		}.bind(this));

		log.info('Bootstrapping finished.');
		this.initialized();
	};

	module.init = off(module.init);

	return module;
});