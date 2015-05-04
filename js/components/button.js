define(function (require) {
    var base = require('utils/view/component'),
        off = require('off'),
        d3 = require('d3');

    return  function() {
        var button = base();

        button.label = off.property();
        button.clicked = off.signal();

        button.init.override(function($super){
            this.span = d3.select(this.parent).append('span');
            this.span.on('click', this.clicked);
            $super();
        });
        button.render = off(function(){
            this.span.text(this.label());
        });

        button.flow(button.label).run(button.render);

        return button;
    };

});