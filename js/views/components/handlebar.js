define(function(require){

    var base = require('utils/view/component'),
        d3 = require('d3'),
        templates = require('templates');

    /**
     * Creates a handlebar component from precompiled template saved in templates/* folder
     */
    return function(template_name) {
        var component = base();
        component.$name("HandleBarComponent");

        component.template_name = template_name;
        component.context = off.property();
        
        component.tag = 'div';

        component.init.override(function($super){
            $super();
            this.template = templates['templates/' + component.template_name + '.hbs'];
            this.root = d3.select(this.parent);
            if (this.tag) {
                this.root = this.root.append(this.tag);
            }
        });

        component.get_html_node = function() {
            return component.root.node();
        };

        component.recreate_content = off(function(){
            this.root.html(this.template(component.context()));
        });

        component.flow(component.context).run(component.recreate_content);

        return component;
    };

});