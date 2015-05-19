define(function (require) {

    var base = require('utils/view/component'),
        d3 = require('d3'),
        off = require('off');

    /**
     * Component displaying
     * @module IconButton
     */
    return off(function () {
        var self = base();
        self.$name('IconButton');

        /**
         * @var title - text displayed to the left of the icon
         */
        self.title = off.property("");

        /**
         * @var src - icon image source path
         */
        self.src = off.property();

        /**
         * @var link_title - link tooltip
         */
        self.link_title = off.property("");

        /**
         * @event clicked
         */
        self.clicked = off.signal();

        self.init.override(function($super){
            $super();
            self.root = d3.select(self.parent).append('span');
            self.title_element = self.root.append('span');
            self.link_element = self.root.append('a').attr('href','#').on('click', self.clicked);
            self.img_element = self.link_element.append('img').attr('class', 'icon small-icon');
        });

        self.render = off(function(){
            self.title_element.text(self.title());
            self.img_element.attr('src', self.src());
            self.img_element.attr('title', self.link_title());
        });

        self.flow(self.title, self.src, self.link_title).run(self.render);

        return self;
    });

});