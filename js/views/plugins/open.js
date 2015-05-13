define(function(require){

    var base = require('views/plugins/plugin'),
        off = require('off'),
        handlebar = require('views/components/handlebar'),
        infoheader = require('views/components/infoheader');

    return off(function() {
        var open = base('open', 'open', true);
        open.$name("OpenPlugin");

        open.create_new = off.signal();
        open.open_from_dropbox = off.signal();
        open.open_from_google_drive = off.signal();
        open.open_last_used = off.signal();
        open.open_sample = off.signal();
        open.open_file = off.signal();

        open.show_google_drive = off.property(false);
        open.show_dropbox = off.property(false);

        open.last_used = off.property(); // {title, date}

        open.init.override(function($super){
            $super();

            var header = infoheader();
            header.title('Open');
            header.info('You can open a .fountain or .fdx file (it will be converted to Fountain), or use one of the samples below.');
            this.add(header);

            var content = handlebar('plugins/open');
            content.context({
                last_used: open.last_used()
            });
            this.add(content);
        });

        open.open_file_dialog = off(function(){
            $("#open-file").click();
        });

        open.init_content = function() {
            $('a[open-action="open"]').click(open.open_file_dialog);

            $('a[open-action="new"]').click(open.create_new);
            $('a[open-action="sample"]').click(function() {
                var name = $(this).attr('value');
                open.open_sample(name);
            });
            $('a[open-action="last"]').click(open.open_last_used);

            $('a[open-action="googledrive"]').click(open.open_from_google_drive);
            $('a[open-action="dropbox"]').click(open.open_from_dropbox);

            open.activate.override(function(){
                if (open.show_dropbox()) {
                    $('a[open-action="dropbox"]').parent().show();
                } else {
                    $('a[open-action="dropbox"]').parent().hide();
                }

                if (open.show_google_drive()) {
                    $('a[open-action="googledrive"]').parent().show();
                } else {
                    $('a[open-action="googledrive"]').parent().hide();
                }
            });

            this.reset_file_input();
        };

        open.reset_file_input = function() {
            $('#open-file-wrapper').empty();
            $('#open-file-wrapper').html('<input id="open-file" type="file" style="display:none" />');
            $("#open-file").change(function() {
                var selected_file = $('#open-file').get(0).files[0];
                open.open_file(selected_file);
                reset_file_input();
            });
        };

        open.flow(open.init).run(open.init_content);

        return open;
    });

});