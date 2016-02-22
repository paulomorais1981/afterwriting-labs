define(function(require) {

    var $ = require('jquery'),
        TemplateView = require('view/templateview'),
        template = require('text!../../html/template/open.html');

    var OpenView = TemplateView.extend({

        open: {inject: 'open'},

        last_used: {
            get: function() {
                return this.open.context.last_used;
            }
        },

        template: template,

        init: function() {
            TemplateView.init.call(this);

            var self = this;

            this.$$('a[open-action="open"]').click(this.open.open_file_dialog);
            this.$$('a[open-action="new"]').click(this.open.create_new);

            this.$$('a[open-action="sample"]').click(function() {
                var name = self.$$(this).attr('value');
                self.open.open_sample(name);
            });
            this.$$('a[open-action="last"]').click(this.open.open_last_used);

            this.open.open_file_dialog.add(function() {
                this.$$("#open-file").click();
            }.bind(this));

            this.$$('a[open-action="googledrive"]').click(this.open.open_from_google_drive);
            this.$$('a[open-action="dropbox"]').click(this.open.open_from_dropbox);

            this.open.activate.add(function(){
                if (this.open.is_dropbox_available()) {
                    this.$$('a[open-action="dropbox"]').parent().show();
                } else {
                    this.$$('a[open-action="dropbox"]').parent().hide();
                }

                if (this.open.is_google_drive_available()) {
                    this.$$('a[open-action="googledrive"]').parent().show();
                } else {
                    this.$$('a[open-action="googledrive"]').parent().hide();
                }
            }.bind(this));

            this.reset_file_input();
        },

        reset_file_input: function() {
            this.$$('#open-file-wrapper').empty();
            this.$$('#open-file-wrapper').html('<input id="open-file" type="file" style="display:none" />');

            var self = this;
            this.$$("#open-file").change(function() {
                var selected_file = self.$$('#open-file').get(0).files[0];
                self.open.open_file(selected_file);
                self.reset_file_input();
            });
        }

    });

    return OpenView;
});