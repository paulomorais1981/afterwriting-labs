define(function(require){

    var p = require('p'),
        $ = require('jquery'),
        Common = require('utils/common'),
        _ = require('lodash');

    var TemplateView = p.Component.extend({

        data: null,

        compiled_template: null,

        $create: function() {
            this.compiled_template = _.template(this.template);
            this.data = Object.create(this);
            this.data.common = Common;
        },

        init: function() {
            this.root.innerHTML = this.compiled_template(this.data);
        },

        $$: function(selector) {
            return $(this.root).find(selector);
        }

    });

    return TemplateView;
});