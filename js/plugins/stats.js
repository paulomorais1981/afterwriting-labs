define(function (require) {

	var Plugin = require('plugins/plugin'),
	    StatsView = require('view/statsview'),
	    pm = require('utils/pluginmanager'),
		editor = require('plugins/editor'),
		data = require('modules/data'),
		decorator = require('utils/decorator'),
		queries = require('modules/queries');
	
	var StatsPlugin = Plugin.extend({
		
		name: 'stats',
		
		title: 'stats',
		
		view: {
			value: StatsView.create()
		},
		
		goto: function (line) {
			editor.goto(line);
		},
	
		refresh: decorator(function () {
			this.is_active = true;
			this.data.days_and_nights = queries.days_and_nights.run(data.parsed_stats.tokens);
			this.data.int_and_ext = queries.int_and_ext.run(data.parsed_stats.tokens);
			this.data.scenes = queries.scene_length.run(data.parsed_stats.tokens);
			var basics = queries.basics.run(data.parsed_stats.lines);
			this.data.who_with_who = queries.dialogue_breakdown.run(data.parsed_stats.tokens, basics, data.config.stats_who_with_who_max);
			this.data.page_balance = queries.page_balance.run(data.parsed_stats.lines);
			this.data.tempo = queries.tempo.run(data.parsed_stats.tokens);
			this.data.locations_breakdown = queries.locations_breakdown.run(data.parsed_stats.tokens);
		}),
		
		activate: function() {
			editor.synced.add(this.refresh);
			this.refresh();
		},
		
		deactivate: function () {
			this.is_active = false;
			editor.synced.remove(this.refresh);
		}
	});
	
	return StatsPlugin.create();
});