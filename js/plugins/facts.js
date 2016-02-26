define(function(require) {

	var Plugin = require('plugins/plugin'),
		FactsView = require('view/factsview'),
		data = require('modules/data'),
		queries = require('modules/queries'),
		editor = require('plugins/editor'),
		decorator = require('utils/decorator'),
		fhelpers = require('utils/fountain/helpers');


	var FactsPlugin = Plugin.extend({

		title: 'facts',

		name: 'facts',
		
		data: null,

		view: {
			value: FactsView.create()
		},
		
		$create: function() {
			this.data = {};
		},

		generate_data: function() {

			var basics = queries.basics.run(data.parsed_stats.lines);
			this.data.facts = basics;
			var facts = this.data.facts;

			facts.title = fhelpers.first_text('title', data.parsed.title_page, '');

			facts.characters = queries.characters.run(data.parsed_stats.tokens, basics, {
				sort_by: 'lines'
			});
			facts.locations = queries.locations.run(data.parsed_stats.tokens);
		},

		get_characters_by_level: function(level) {
			return this.data.facts.characters.filter(function(character) {
				return character.level === level;
			});
		},

		each_scene_on_new_page: function() {
			return data.config.each_scene_on_new_page;
		},

		refresh: decorator(function() {
			this.generate_data();
		}),

		activate: function() {
			editor.synced.add(this.refresh);
			this.refresh();
		},

		deactivate: function() {
			editor.synced.remove(this.refresh);
		}

	});

	return FactsPlugin.create();
});