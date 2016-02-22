define(function(require) {
	var Plugin = require('plugins/plugin'),
		data = require('modules/data'),
		layout = require('utils/layout'),
		open = require('plugins/open'),
        InfoView = require('view/settingsview');


	var SettingsPlugin = Plugin.extend({
		name: 'settings',
		title: 'setup',
		
		// TODO: create views separately
		view: {
			value: InfoView.create()
		},

		get_config: function() {
			return data.config;
		},

		save: function() {
			data.save_config();
			data.script(data.script());
		},

		get_default_config: function() {
			return data.default_config;
		},

		windup: function() {
			if (data.config.load_last_opened) {
				open.open_last_used(true);
				layout.show_main();
			}
		}

	})

	// TODO: create plugins in bootstrap
	return SettingsPlugin.create();
});