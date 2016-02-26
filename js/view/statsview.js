define(function(require) {

    var $ = require('jquery'),
        layout = require('utils/layout'), 
        helper = require('utils/helper'),
        charts = require('modules/charts'),
        TemplateView = require('view/templateview'),
        template = require('text!../../html/template/stats.html');

    var StatsView = TemplateView.extend({

        stats: {
            inject: 'stats'
        },

        template: template,

        init: function() {
            TemplateView.init.call(this);
            var $ = this.$$.bind(this);
            // TODO: this.bind(this.stats.refresh, this.refresh);
            this.stats.refresh.add(this.render.bind(this));
            $('#stats-scene-length-type').on('change', this.render.bind(this));

            layout.toggle_expand.add(function() {
                if (this.stats.is_active) {
                    this.render();
                }
            }.bind(this));
        },

        render: function() {
            var $ = this.$$.bind(this);
            charts.spider_chart.render('#who-with-who', this.stats.data.who_with_who.characters, this.stats.data.who_with_who.links, {
                label: 'name'
            });

            charts.bar_chart.render('#stats-scene-length', this.stats.data.scenes, {
                tooltip: function(d) {
                    return d.header + ' (time: ' + helper.format_time(helper.lines_to_minutes(d.length)) + ')'
                },
                value: 'length',
                color: function(d) {
                    if ($('#stats-scene-length-type').val() === "int_ext") {
                        if (d.location_type === 'mixed') {
                            return '#777777';
                        }
                        else if (d.location_type === 'int') {
                            return '#ffffff';
                        }
                        else if (d.location_type === 'ext') {
                            return '#000000';
                        }
                        else if (d.location_type === 'other') {
                            return '#444444';
                        }
                    }

                    if (d.type == 'day') {
                        return '#ffffff';
                    }
                    else if (d.type == 'night') {
                        return '#222222';
                    }
                    else {
                        return '#777777';
                    }
                },
                bar_click: function(d) {
                    if (!layout.small) {
                        this.stats.goto(d.token.line);
                    }
                }.bind(this)
            });

            charts.pie_chart.render('#stats-days-and-nights', this.stats.data.days_and_nights, {
                tooltip: function(d) {
                    return d.data.label + ': ' + d.data.value + (d.data.value == 1 ? ' scene' : ' scenes')
                },
                value: 'value',
                color: function(d) {
                    if (d.data.label == 'DAY') {
                        return '#ffffff';
                    }
                    else if (d.data.label == 'NIGHT') {
                        return '#222222';
                    }
                    else if (d.data.label == 'DAWN') {
                        return '#777777';
                    }
                    else if (d.data.label == 'DUSK') {
                        return '#444444';
                    }
                    else {
                        return '#aaaaaa';
                    }
                }
            });

            var int_ext_labels = {
                int: 'INT.',
                ext: 'EXT.',
                mixed: 'INT./EXT.',
                other: 'OTHER'
            };

            charts.pie_chart.render('#stats-int-ext', this.stats.data.int_and_ext, {
                tooltip: function(d) {
                    return int_ext_labels[d.data.label] + ': ' + d.data.value + (d.data.value == 1 ? ' scene' : ' scenes')
                },
                value: 'value',
                color: function(d) {
                    if (d.data.label == 'mixed') {
                        return '#777777';
                    }
                    else if (d.data.label == 'int') {
                        return '#ffffff';
                    }
                    else if (d.data.label == 'ext') {
                        return '#000000';
                    }
                    else if (d.data.label == 'other') {
                        return '#444444';
                    }
                }
            });

            charts.page_balance_chart.render('#stats-page-balance', this.stats.data.page_balance, {
                page_click: function(d) {
                    if (!layout.small) {
                        this.stats.goto(d.first_line.token.line);
                    }
                }.bind(this)
            });

            charts.line_chart.render('#stats-tempo', this.stats.data.tempo, {
                value: 'tempo',
                tooltip: function(d, i) {
                    if (i === this.stats.data.tempo.length - 1) {
                        return '';
                    }
                    return d.scene + '<br />...' + d.line + '... ';
                }.bind(this),
                click: function(d) {
                    if (!layout.small) {
                        this.stats.goto(d.line_no);
                    }
                }.bind(this)
            });

            charts.locations_breakdown.render('#locations-breakdown', this.stats.data.locations_breakdown);

        }
    });

    return StatsView;
});