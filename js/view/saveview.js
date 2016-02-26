define(function(require) {

    var $ = require('jquery'),
        TemplateView = require('view/templateview'),
        template = require('text!../../html/template/save.html');

    var SaveView = TemplateView.extend({

        save: {
            inject: 'save'
        },

        template: template,

        init: function() {
            TemplateView.init.call(this);
            $(document).ready(function() {
                var $ = this.$$.bind(this);
                $('a[action="save-fountain"]').click(this.save.save_as_fountain);
                $('a[action="save-dropbox-fountain"]').click(this.save.dropbox_fountain);
                $('a[action="save-gd-fountain"]').click(this.save.google_drive_fountain);

                $('a[action="save-pdf"]').click(this.save.save_as_pdf);
                $('a[action="save-dropbox-pdf"]').click(this.save.dropbox_pdf);
                $('a[action="save-gd-pdf"]').click(this.save.google_drive_pdf);

                this.save.activate.add(function() {
                    if (!this.save.is_dropbox_available()) {
                        $('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().hide();
                    }
                    else {
                        $('a[action="save-dropbox-pdf"], a[action="save-dropbox-fountain"]').parent().show();
                    }
                    if (!this.save.is_google_drive_available()) {
                        $('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().hide();
                    }
                    else {
                        $('a[action="save-gd-pdf"], a[action="save-gd-fountain"]').parent().show();
                    }
                }.bind(this));

            }.bind(this));
        }
    });

    return SaveView;
});