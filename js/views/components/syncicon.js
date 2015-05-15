define(function(require){


    var off = require('off'),
        $ = require('jquery'),
        common = require('utils/common'),
        base = require('utils/view/component');

    return off(function(){

        var icon = base();

        var sync_on_icon = common.data.static_path + 'gfx/icons/other/sync.svg',
            sync_off_icon = common.data.static_path + 'gfx/icons/other/no-sync.svg';

        icon.is_sync = off.property(false);
        icon.restore = off.signal();
        icon.toggle_sync = off.signal();
        icon.visible = off.property(true);

        icon.init.override(function($super){
            $super();
            this.icon = $('<a href="#" title="Load content from cloud"><img class="sync-icon icon small-icon" />');
            this.icon.appendTo(this.parent);

            this.icon.click(function(){
                if (icon.is_sync()) {
                    icon.toggle_sync();
                    $.prompt('Synchronisation turned off.', {
                        buttons: {'Keep content': true, 'Load version before sync': false},
                        submit: function(e,v) {
                            if (!v) {
                                icon.restore();
                            }
                        }
                    });
                }
                else {
                    // TODO: editor_plugin.store();
                    $.prompt("You can start writing in your editor. Content will be synchronized with 'afterwriting! PDF preview, facts and stats will be automatically upated.", {
                        buttons: {'OK': true, 'Cancel': false},
                        submit: function(e,v) {
                            if (v) {
                                icon.toggle_sync();
                            }
                        }
                    });
                }
            });
        });

        icon.update = function() {
            if (this.visible()) {
                this.icon.show()
            }
            else {
                this.icon.hide();
            }

            this.icon.find('.sync-icon')
                .attr('src', this.is_sync() ? sync_on_icon : sync_off_icon)
                .attr('title', this.is_sync() ? 'Turn synchronisation off' : 'Turn synchronisation on');
        };

        icon.flow(icon.visible, icon.is_sync).run(icon.update);

        return icon;

    });

});