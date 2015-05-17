define(function (require) {

    var base = require('utils/view/component'),
        d3 = require('d3'),
        cm = require('libs/codemirror/lib/codemirror'),
        off = require('off');

    /**
     *
     * @module FountainEditor
     */
    return off(function () {
        var self = base();
        self.$name('FountainEditor');

        /**
         * Editor's enabled flag
         * @var {boolean} enabled
         */
        self.enabled = off.property(true);

        self.init.override(function($super){
            $super();

            self.editor_textarea = d3.select(self.parent).append('textarea');
            self.create_editor();
            self.render();
        });

        self.create_editor = off(function() {

            self.cm_editor = cm.fromTextArea(self.editor_textarea.node(), {
                mode: "fountain",
                lineNumbers: false,
                lineWrapping: true,
                styleActiveLine: true,
                extraKeys: {
                    "Ctrl-Space": "autocomplete"
                }
            });
        });

        self.set_size = off(function(width, height){
            self.cm_editor.setSize(width, height);
            self.cm_editor.refresh()
        });

        self.render = off(function() {
            $('.CodeMirror').css('opacity', this.enabled() ? 1 : 0.5);
        });

        self.flow(self.enabled).run(self.render);

        return self;
    });

});