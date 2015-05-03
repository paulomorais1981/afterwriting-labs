require(['bootstrap',

	'modules/data',
	'modules/queries',

	'modules/control/monitor/track_user_activity',
	'modules/control/open/load_last_used',

	'modules/view/layout/load_open',
	'modules/view/layout/load_settings',
	'modules/view/layout/test/load_test',
	'modules/view/layout/test/load_fquerysandbox',
	'modules/view/layout/show_app',

	'modules/control/env/setup_test'

], function (bootstrap) {
	bootstrap.init(arguments);
});