/*global define*/
define(['logger', 'off'], function (logger, off) {

	var log = logger.get('bootstrap'),
		bootstrap = {};

	bootstrap.initialized = off.signal();
	bootstrap.state = {};

	bootstrap.init = function (modules) {
		modules = Array.prototype.splice.call(modules, 0);
		state.modules = modules;

		log.info('Modules preparation.');
		modules.forEach(function (module) {
			if (module !== this && module.init && typeof (module.init) === 'function') {
				module.init(bootstrap.state);
			}
		}.bind(this));

		log.info('Bootstrapping finished.');
		this.initialized();
	};

	bootstrap.init = off(bootstrap.init);

	return bootstrap;
});