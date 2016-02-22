define(function(require){

    var $ = require('jquery'),
        TemplateView = require('view/templateview'),
        template = require('text!../../html/template/info.html');

    var InfoView = TemplateView.extend({

        info: {inject: 'info'},

        template: template,

        init: function() {
            TemplateView.init.call(this);
            $(this.root).find('#download-link').click(this.info.download_clicked);
        }
    });

    return InfoView;
});