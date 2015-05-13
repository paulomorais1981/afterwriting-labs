define(function(require){

    var base = require('views/plugins/plugin'),
        handlebar = require('views/components/handlebar'),
        infoheader = require('views/components/infoheader'),
        off = require('off');

    return off(function(){

        var settings = base('settings', 'settings');

        settings.changed = off.signal();

        settings.init.override(function($super){
            $super();

            var header = infoheader();
            header.title('Settings');
            header.info('You can change configuration here. Some settings (e.g. page size, double space between scenes) may affect statistics which are based on assumption that 1 page = 1 minute of a movie.');
            this.add(header);

            var content = handlebar('plugins/settings');
            this.add(content);

            $('.plugin-content[plugin="settings"]').select('input, option').on('change keyup', settings.changed);
        });

        settings.data_to_components = off(function(c) {
            $('*[setting="show_background_image"]').prop('checked', c.show_background_image);
            $('*[setting="print_title_page"]').prop('checked', c.print_title_page);
            $('*[setting="embolden_scene_headers"]').prop('checked', c.embolden_scene_headers);
            $('*[setting="load_last_opened"]').prop('checked', c.load_last_opened);
            $('*[setting="double_space_between_scenes"]').prop('checked', c.double_space_between_scenes);
            $('*[setting="each_scene_on_new_page"]').prop('checked', c.each_scene_on_new_page);
            $('*[setting="split_dialogue"]').prop('checked', c.split_dialogue);
            $('*[setting="print_sections"]').prop('checked', c.print_sections);
            $('*[setting="print_synopsis"]').prop('checked', c.print_synopsis);
            $('*[setting="print_notes"]').prop('checked', c.print_notes);
            $('*[setting="print_headers"]').prop('checked', c.print_headers);
            $('*[setting="print_actions"]').prop('checked', c.print_actions);
            $('*[setting="print_dialogues"]').prop('checked', c.print_dialogues);
            $('*[setting="number_sections"]').prop('checked', c.number_sections);
            $('*[setting="use_dual_dialogue"]').prop('checked', c.use_dual_dialogue);
            $('*[setting="stats_keep_last_scene_time"]').prop('checked', c.stats_keep_last_scene_time);
            $('*[setting="scene_continuation_top"]').prop('checked', c.scene_continuation_top);
            $('*[setting="scene_continuation_bottom"]').prop('checked', c.scene_continuation_bottom);
            $('*[setting="print_profile"]').val(c.print_profile);
            $('*[setting="stats_who_with_who_max"]').val(c.stats_who_with_who_max);
            $('*[setting="print_header"]').val(c.print_header);
            $('*[setting="print_footer"]').val(c.print_footer);
            $('*[setting="print_watermark"]').val(c.print_watermark);
            $('*[setting="scenes_numbers"]').val(c.scenes_numbers);
        });

        settings.components_to_data = off(function(c) {
            c.show_background_image = $('*[setting="show_background_image"]').is(':checked');
            c.print_title_page = $('*[setting="print_title_page"]').is(':checked');
            c.embolden_scene_headers = $('*[setting="embolden_scene_headers"]').is(':checked');
            c.load_last_opened = $('*[setting="load_last_opened"]').is(':checked');
            c.double_space_between_scenes = $('*[setting="double_space_between_scenes"]').is(':checked');
            c.each_scene_on_new_page = $('*[setting="each_scene_on_new_page"]').is(':checked');
            c.split_dialogue = $('*[setting="split_dialogue"]').is(':checked');
            c.print_sections = $('*[setting="print_sections"]').is(':checked');
            c.print_synopsis = $('*[setting="print_synopsis"]').is(':checked');
            c.print_notes = $('*[setting="print_notes"]').is(':checked');
            c.print_headers = $('*[setting="print_headers"]').is(':checked');
            c.print_actions = $('*[setting="print_actions"]').is(':checked');
            c.print_dialogues = $('*[setting="print_dialogues"]').is(':checked');
            c.number_sections = $('*[setting="number_sections"]').is(':checked');
            c.use_dual_dialogue = $('*[setting="use_dual_dialogue"]').is(':checked');
            c.stats_keep_last_scene_time = $('*[setting="stats_keep_last_scene_time"]').is(':checked');
            c.scene_continuation_top = $('*[setting="scene_continuation_top"]').is(':checked');
            c.scene_continuation_bottom = $('*[setting="scene_continuation_bottom"]').is(':checked');
            c.stats_who_with_who_max = parseInt($('*[setting="stats_who_with_who_max"]').val());
            c.print_header = $('*[setting="print_header"]').val();
            c.print_footer = $('*[setting="print_footer"]').val();
            c.print_watermark = $('*[setting="print_watermark"]').val();
            c.print_profile = $('*[setting="print_profile"]').val();
            c.scenes_numbers = $('*[setting="scenes_numbers"]').val();
        });

        return settings;

    });

});