define(function (require) {
	var pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		decorator = require('utils/decorator');

	var plugin = pm.create_plugin('settings', 'setup');

	plugin.get_config = function () {
		return data.config;
	};

	plugin.save = function () {
		data.save_config();
		data.script(data.script());
	};

	plugin.get_default_config = function () {
		return data.default_config;
	};

	return decorator.decorate(plugin);
});