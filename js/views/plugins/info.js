define(function(require){

    var base = require('views/plugins/plugin'),
        off = require('off'),
        handlebar = require('views/components/handlebar');

    return off(function() {
        var info = base('info', 'info', true);
        info.$name("InfoPlugin");

        info.download_clicked = off.signal();

        info.init.override(function($super){
            $super();

            var content = handlebar('plugins/info');
            content.tag = null;
            this.add(content);

            content.recreate_content.add(info.recreate_interactions);
        });

        info.recreate_interactions = function(){
            $('#download-link').click(info.download_clicked);
        };

        return info;
    });

});