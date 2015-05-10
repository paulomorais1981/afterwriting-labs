define(function(require){

    var base = require('views/plugins/plugin'),
        handlebar = require('views/components/handlebar'),
        infoheader = require('views/components/infoheader');

    return function() {
        var open = base('open', 'open');
        open.$name("InfoPlugin");

        open.download_clicked = off.signal();

        open.init.override(function($super){
            $super();

            var header = infoheader();
            header.title('Open');
            header.info('You can open a .fountain or .fdx file (it will be converted to Fountain), or use one of the samples below.');
            this.add(header);

            window.h = header;

            var content = handlebar('plugins/open');
            this.add(content);

        });

        return open;
    };

});