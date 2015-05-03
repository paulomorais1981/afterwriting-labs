define(function(require){
	var pm = require('utils/pluginmanager'),
		off = require('off');
	
	var plugin = pm.create_plugin('info', 'info');
	plugin.class = "active";
	
	plugin.download_clicked = off.signal();

	return off.decorate(plugin);
});