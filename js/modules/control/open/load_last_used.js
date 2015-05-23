define(function(require){

    var layout = require('utils/layout'),
        helper = require('utils/helper'),
        data = require('modules/data'),
        open = require('plugins/open');

    var module = {};

    module.init = function() {
        save_last_used();
        load_last_used();
    };

    function save_last_used() {
        data.script.add(function () {
            var title = '';
            data.data('last-used-script', data.script());
            data.data('last-used-date', helper.format_date(new Date()));
            if (data.script()) {
                var title_match;
                var wait_for_non_empty = false;
                data.script().split('\n').some(function (line) {
                    title_match = line.match(/title\:(.*)/i);
                    if (wait_for_non_empty) {
                        title = line.trim().replace(/\*/g, '').replace(/_/g, '');
                        wait_for_non_empty = !title;
                    }
                    if (title_match) {
                        title = title_match[1].trim();
                        wait_for_non_empty = !title;
                    }
                    return title && !wait_for_non_empty;
                });
            }
            data.data('last-used-title', title || 'No title');
        });
    }

    function load_last_used() {
        if (data.config.load_last_opened) {
            layout.init_layout.add(function() {
                open.open_last_used(true);
            });
        }
    }

    return module;

});