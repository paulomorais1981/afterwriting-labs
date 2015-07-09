define(function (require) {

    var base = require('views/plugins/plugin'),
        d3 = require('d3'),
        off = require('off'),
        save = require('plugins/save'),
        handlebar = require('views/components/handlebar');

    /**
     *
     * @module SavePlugin
     */
    return off(function () {
        var self = base('save', 'save');
        self.$name('SavePlugin');

        self.save_as_fountain = off.signal();

        self.init.override(function($super){
            $super();

            self.content = handlebar('plugins/save');
            self.flow(self.content.init).run(self.init_content).dynamic();

            this.add(self.content);
        });

        self.init_content = off(function(){
            self.assign_to_link("save-fountain", self.save_as_fountain);
        });

        /**
         * Assign a signal to the link with "action"
         * @param action
         * @param signal
         */
        self.assign_to_link = function(action, signal) {
            d3.select(self.content.get_html_node()).select('a[action="' + action + '"]').on('click', signal);
        };

        self.actions.override(function() {
            self.save_as_fountain.add(save.save_as_fountain);
        });

        return self;
    });

});

/**
 * $(document).ready(function() {
			$('a[action="save-fountain"]').click(save.save_as_fountain);
			$('a[action="save-dropbox-fountain"]').click(save.dropbox_fountain);
			$('a[action="save-gd-fountain"]').click(save.google_drive_fountain);

			$('a[action="save-pdf"]').click(save.save_as_pdf);
			$('a[action="save-dropbox-pdf"]').click(save.dropbox_pdf);
			$('a[action="save-gd-pdf"]').click(save.google_drive_pdf);

			save.activate.add(function() {
				if (!save.is_dropbox_available()) {
					$('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().hide();
				} else {
					$('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().show();
				}
				if (!save.is_google_drive_available()) {
					$('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().hide();
				} else {
					$('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().show();
				}
			});


		});
 */