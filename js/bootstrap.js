/*global define*/
define(['logger', 'off'], function (logger, off) {

	var log = logger.get('bootstrap'),
		bootstrap = {};

	bootstrap.initialized = off.signal();
	bootstrap.state = {};

	bootstrap.init = function (modules) {
		var args = Array.prototype.splice.call(modules, 0),
			modules = args.reduce(function(result, current){return result.concat(current)}, []);

		bootstrap.state.modules = modules;

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