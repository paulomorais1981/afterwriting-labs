/*global define*/
define(['templates', 'logger', 'utils/layout', 'utils/decorator', 'd3', 'jquery', 'p'], function (templates, logger, layout, decorator, d3, $, p) {

	var LOG = logger.get('bootstrap');

	var Bootstrap = p.extend({

		decorate_all_properties: function (plugin) {
			d3.keys(plugin).forEach(function(property) {
				if (typeof (plugin[property]) === "function" && !(plugin[property].decorated)) {
					plugin[property] = decorator(plugin[property].bind(plugin));
				}
			});
		},

		init: function (modules) {
			modules = Array.prototype.splice.call(modules, 0);

			LOG.info('Modules preparation.');
			modules.forEach(function (module) {
				if (module.prepare && typeof (module.prepare) === 'function') {
					module.prepare();
				}
			});

			var context = {
				plugins: [],
                context: p.Context.create()
			};

			var plugins = modules.filter(function (module) {
				return module && module.is_plugin;
			});

			this.plugins = [];
			plugins.forEach(function (plugin) {
				this.plugins[plugin.name] = plugin;
				this.decorate_all_properties(plugin);
			}, this);

			LOG.info('Bootstrapping: ' + plugins.length + ' plugins found.');

			plugins.forEach(function (plugin) {
				LOG.info('Initializing plugin: ' + plugin.name);
				plugin.init();
			});

			plugins.forEach(function (plugin) {
                if (!plugin.deprecated) {
                    context.context.register(plugin.name, plugin);
                }
                else {
                    var template_name = 'templates/plugins/' + plugin.name + '.hbs';
                    if (templates.hasOwnProperty(template_name)) {
                        var template = templates[template_name];
                        var html = template(plugin.context);
                        plugin.view = html;
                    }
                }

				context.plugins.push(plugin);
			});

			LOG.info('Initializing layout');
			$('#loader').remove();
			layout.init_layout(context);

			LOG.info('Modules windup.');
			modules.forEach(function (module) {
				if (module.windup && typeof (module.windup) === 'function') {
					module.windup();
				}
			});

			LOG.info('Bootstrapping finished.');
		}

	});

	return Bootstrap;
});