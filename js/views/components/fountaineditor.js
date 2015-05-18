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
         * @var {boolean} enabled - true when editor is enabled for editing
         */
        self.enabled = off.property(true);

        /**
         * @event changed - dispatched when user changes content
         */
        self.changed = off.signal();

        self._text = off.property("");
        self.text = off.property(self._text);

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

            self.cm_editor.on('change', function () {
                self._text(self.cm_editor.getValue());
                self.changed(self._text());
            });
        });

        self.set_size = off(function(width, height){
            self.cm_editor.setSize(width, height);
            self.cm_editor.refresh()
        });

        self.render = off(function() {
            d3.select('.CodeMirror').style('opacity', this.enabled() ? 1 : 0.5);
        });

        self.update_text = off(function(){
            setTimeout(function () {
                self.cm_editor.setValue(self.text());
                self.cm_editor.focus();
                self.cm_editor.refresh();

                // TODO:
                //if (plugin.data.cursor) {
                //    self.cm_editor.setCursor(plugin.data.cursor);
                //}

                //if (plugin.data.scroll_info) {
                //    self.cm_editor.scrollTo(plugin.data.scroll_info.left, plugin.data.scroll_info.top);
                //} else if (plugin.data.cursor) {
                //    var scroll_to = self.cm_editor.getScrollInfo();
                //    if (scroll_to.top > 0) {
                //        self.cm_editor.scrollTo(0, scroll_to.top + scroll_to.clientHeight - self.cm_editor.defaultTextHeight() * 2);
                //    }
                //}

            }, 300); // TODO: Timeout 300?
        });
        
        self.flow(self.enabled).run(self.render);
        self.flow(self.text).run(self.update_text);

        return self;
    });

});