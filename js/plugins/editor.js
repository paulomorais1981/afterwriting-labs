define(function (require) {

	var Plugin = require('plugins/plugin'),
		EditorView = require('view/editorview'),
	    pm = require('utils/pluginmanager'),
		data = require('modules/data'),
		decorator = require('utils/decorator'),
		gd = require('utils/googledrive'),
		db = require('utils/dropbox'),
		save = require('utils/save'),
		local = require('utils/local'),
		converter = require('utils/converters/scriptconverter'),
		cm = require('libs/codemirror/lib/codemirror');

	// codemirror plugins
	require('libs/codemirror/addon/selection/active-line');
	require('libs/codemirror/addon/hint/show-hint');
	require('libs/codemirror/addon/hint/anyword-hint');
	require('utils/fountain/cmmode');
	
	var EditorPlugin = Plugin.extend({
		name: 'editor',
		title: 'write',
		
		active: false,
		auto_save_sync_timer: null,
		last_content: '',
		editor: null,
		
		data: null,
		
		view: {
			value: EditorView.create()
		},
		
		$create: function() {
			this.save_in_progress = decorator.property();
			this.pending_changes = decorator.property();
			this.synced = decorator.signal();
			
			this.data = {
				is_sync: false,
				is_auto_save: false
			};
		},
		
		create_editor: function (textarea) {
			this.editor = cm.fromTextArea(textarea, {
				mode: "fountain",
				lineNumbers: false,
				lineWrapping: true,
				styleActiveLine: true,
				extraKeys: {
					"Ctrl-Space": "autocomplete"
				}
			});
	
			this.editor.on('change', function () {
				data.script(this.editor.getValue());
				this.pending_changes(true);
			}.bind(this));
		},
		
		set_size: function (width, height) {
			this.editor.setSize(width, height);
			this.editor.refresh();
		},
		
		save_state: function () {
			this.data.cursor = this.editor.getCursor();
			this.data.scroll_info = this.editor.getScrollInfo();
		},
		
		goto: function (line) {
			this.data.cursor = {
				ch: 0,
				line: line,
				xRel: 0
			};
			this.data.scroll_info = null;
	
			pm.switch_to(this);
		},
		
		auto_save_available: function() {
			return (data.data('gd-fileid') || data.data('db-path')) && data.format !== 'fdx';
		},
		
		is_auto_save: function() {
			return this.data.is_auto_save;
		},
	
		toggle_auto_save: function() {
			if (!this.data.is_auto_save && this.data.is_sync) {
				this.toggle_sync();
			}
			this.set_auto_save(!this.data.is_auto_save);
		},
	
		set_auto_save: function(value) {
			this.data.is_auto_save = value;
			if (this.data.is_auto_save && !this.auto_save_sync_timer) {
				this.pending_changes(true); // trigger first save
				this.save_in_progress(false);
				this.auto_save_sync_timer = setInterval(this.save_current_script, 3000);
				this.save_current_script();
			}
			else {
				clearInterval(this.auto_save_sync_timer);
				this.auto_save_sync_timer = null;
				this.save_in_progress(false);
				this.pending_changes(false);
			}
		},
	
		save_current_script: function() {
			if (!this.save_in_progress() && this.pending_changes()) {
				this.save_in_progress(true);
				this.pending_changes(false);
				save.save_current_script(function(){
					this.save_in_progress(false);
				});
			}
		},
	
		sync_available: function () {
			return data.data('gd-fileid') || data.data('db-path') || local.sync_available();
		},
	
		is_sync: function () {
			return this.data.is_sync;
		},
	
		handle_sync: function (content) {
			content = converter.to_fountain(content).value;
			if (content === undefined) {
				this.toggle_sync();
				if (this.active) {
					this.activate();
				}
			}
			else if (this.last_content !== content) {
				this.last_content = content;
				data.script(content);
				data.parse();
				this.synced();
				if (this.active) {
					this.activate();
				}
			}
		},
	
		toggle_sync: function () {
			this.last_content = '';
			this.set_sync(!this.data.is_sync);
		},
	
		store: function () {
			data.data('editor-last-state', data.script());
		},
	
		restore: function () {
			data.script(data.data('editor-last-state'));
			data.parse();
			if (this.active) {
				this.activate();
			}
		},
	
		set_sync: function (value) {
			this.data.is_sync = value;
			if (this.editor) {
				this.editor.setOption('readOnly', this.data.is_sync);
			}
			if (this.data.is_sync) {
				this.set_auto_save(false);
				if (data.data('gd-fileid')) {
					gd.sync(data.data('gd-fileid'), 3000, this.handle_sync.bind(this));
					this.synced('google-drive');
				} else if (data.data('db-path')) {
					db.sync(data.data('db-path'), 3000, this.handle_sync.bind(this));
					this.synced('drobox');
				} else if (local.sync_available()) {
					local.sync(3000, this.handle_sync.bind(this));
					this.synced('local');
				}
	
			} else {
				gd.unsync();
				db.unsync();
				local.unsync();
			}
		},
	
		activate: function () {
			this.active = true;
			setTimeout(function () {
				if (data.script() !== this.editor.getValue()) this.editor.setValue(data.script() || "");
				this.editor.focus();
				this.editor.refresh();
	
				if (this.data.cursor) {
					this.editor.setCursor(this.data.cursor);
				}
	
				if (this.data.scroll_info) {
					this.editor.scrollTo(this.data.scroll_info.left, this.data.scroll_info.top);
				} else if (this.data.cursor) {
					var scroll_to = this.editor.getScrollInfo();
					if (scroll_to.top > 0) {
						this.editor.scrollTo(0, scroll_to.top + scroll_to.clientHeight - this.editor.defaultTextHeight() * 2);
					}
				}
	
			}.bind(this), 300);
		},
	
		deactivate: function () {
			this.active = false;
			this.save_state();
		},
	
		is_active: function () {
			return this.this.active;
		}
		
	});

	return EditorPlugin.create();
});