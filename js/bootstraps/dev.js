require(['bootstrap',
		'modules/data',
		'modules/queries',
		'modules/charts',

		'modules/control/monitor/track_user_activity',
		'modules/control/open/load_last_used',

		//'modules/save/save_locally',

		'modules/view/sync',
		'modules/view/editor_content',

		'modules/view/layout/load_all_plugins',

		'modules/view/layout/show_app',

		'modules/control/env/setup_dev'
], function (bootstrap) {
	bootstrap.init(arguments);
});