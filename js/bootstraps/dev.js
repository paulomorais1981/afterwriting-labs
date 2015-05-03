require(['bootstrap',
		'modules/data',
		'modules/queries',
		'modules/charts',

		'modules/control/monitor/track_user_activity',
		'modules/control/open/load_last_used',

		'modules/view/layout/load_info',
		'modules/view/layout/load_open',
		'modules/view/layout/load_settings',
		'modules/view/layout/load_editor',
		'modules/view/layout/load_save',
		'modules/view/layout/load_preview',
		'modules/view/layout/load_facts',
		'modules/view/layout/load_stats',
		'modules/view/layout/show_app',

		'modules/control/env/setup_dev'
], function (bootstrap) {
	bootstrap.init(arguments);
});