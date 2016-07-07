define(['utils/tobject/tobject', 'utils/tobject/trait'], function(TObject, Trait) {

    describe('TObject', function() {

        var EncodedContent, Content, Words, WordsCount,
            content_getter, words_getter;

        beforeEach(function() {

            content_getter = sinon.stub();
            words_getter = sinon.stub();

            Content = Trait.extend({
                $create: function() {
                    this.value = 'default';
                },
                value: {
                    set: function(value) {
                        this.content = value;
                    },
                    get: function() {
                        content_getter();
                        return this.content;
                    }
                }
            });

            EncodedContent = Trait.extend({
                content: {
                    type: Content
                },
                value: {
                    set: function(value) {
                        this.encoded = value;
                        this.content = value.toLowerCase();
                    },
                    get: function() {
                        return this.encoded;
                    }
                }
            });

            Words = Trait.extend({
                content: {
                    type: Content
                },
                value: {
                    get: function() {
                        words_getter();
                        return this.content.split(' ');
                    }
                }
            });

            WordsCount = Trait.extend({
                words: {
                    type: Words
                },
                value: {
                    get: function() {
                        return this.words.length;
                    }
                }
            });
        });

        it('default values', function() {
            var script = TObject.create();
            script.add('content', Content);

            chai.assert.equal(script.get('content'), 'default');
        });

        it('basic setter and getter', function() {
            var script = TObject.create();
            script.add('content', Content);

            script.set('content', 'test');
            chai.assert.equal(script.get('content'), 'test');
        });

        it('computed getters', function() {
            var script = TObject.create();
            script.add('content', Content);
            script.add('words', Words);

            script.set('content', 'foo bar');
            chai.assert.lengthOf(script.get('words'), 2);
        });

        it('two computed getters', function() {
            var script = TObject.create();
            script.add('content', Content);
            script.add('words', Words);
            script.add('words.count', WordsCount);

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('words.count'), 2);
        });

        it('missing dependencies', function() {
            var script = TObject.create();
            script.add('content', Content);
            script.add('words.count', WordsCount);

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('words.count'), 2);
        });

        it('setters', function() {
            var script = TObject.create();
            script.add('content.value', Content);
            script.add('content.encoded', EncodedContent);

            script.set('content.encoded', 'FOO BAR');
            chai.assert.equal(script.get('content.value'), 'foo bar');
        });

        it('getters are cached', function() {
            var script = TObject.create();
            script.add('content', Content);

            script.set('content', 'test');
            script.get('content');
            script.get('content');

            sinon.assert.calledOnce(content_getter);
        });

        it('cached is clear when the value is set', function() {
            var script = TObject.create();
            script.add('content', Content);
            script.add('words', Words);

            script.set('content', 'foo bar');
            sinon.assert.notCalled(words_getter);

            script.get('words');
            script.get('words');

            sinon.assert.calledOnce(words_getter);

            script.set('content', 'foo foo bar');
            sinon.assert.calledOnce(words_getter);

            script.get('words');
            script.get('words');

            chai.assert.lengthOf(script.get('words'), 3);
            sinon.assert.calledTwice(words_getter);
        });

        it('binding', function() {

            var trigger = sinon.stub();

            var Trigger = Trait.extend({

                content: {
                    type: Content,
                    bind: function() {
                        trigger(this.content);
                    }
                }

            });

            var script = TObject.create();
            script.add('main.content', Content);
            script.add('trigger', Trigger);

            sinon.assert.notCalled(trigger);
            script.set('main.content', 'test');

            sinon.assert.called(trigger);
            sinon.assert.calledWith(trigger, 'test');
        });

        it('direct access', function() {

            var data = TObject.create();
            data.add('content', Content);

            data.set('content', 'test');

            chai.assert(data.content, 'test');

            data.content = 'test2';

            chai.assert(data.get('content'), 'test2');
        });

        it('nested properties', function() {

            var data = TObject.create();
            data.add('my.namespace.content', Content);

            data.my.namespace.content = 'value';
            chai.assert(data.get('my.namespace.content'), 'value');

        });

        it('functions', function() {

            var UpperCase = Trait.extend({

                content: {
                    type: Content
                },

                method: function() {
                    return this.content.toUpperCase();
                }
            });

            var data = TObject.create();
            data.add('content', Content);
            data.add('toUpperCase', UpperCase);

            data.set('content', 'foo');
            chai.assert.equal(data.get('content'), 'foo');
            chai.assert.equal(data.get('toUpperCase')(), 'FOO');
            chai.assert.equal(data.toUpperCase(), 'FOO');
        });

        it('use case', function() {

            var Fountain = Trait.extend({

                value: {
                    set: function(value) {
                        this.fountain = value;
                    },
                    get: function() {
                        return this.fountain;
                    }
                }

            });

            var Tokens = Trait.extend({

                value: {
                    set: function(value) {
                        this.tokens = value;
                    },
                    get: function() {
                        return this.tokens;
                    }
                }

            });

            var Lines = Trait.extend({

                tokens: {
                    type: Tokens
                },

                value: {
                    get: function() {
                        return this.tokens.filter(function(token) {
                            return token;
                        })
                    }
                }

            });

            var PrintConfig = Trait.extend({

                $create: function() {
                    this.lines_per_page = 5
                },

                value: {
                    set: function(value) {
                        this.config = value;
                    },
                    get: function() {
                        return this.config;
                    }
                }

            });

            var PagesStats = Trait.extend({

                lines: {
                    type: Lines
                },

                config: {
                    type: PrintConfig
                },

                value: {
                    get: function() {
                        return this.lines.length / this.config.lines_per_page;
                    }
                }

            });

            var FountainParser = Trait.extend({

                tokens: {
                    type: Tokens
                },

                fountain: {
                    type: Fountain,
                    bind: function() {
                        this.tokens = this.fountain.split('\n');
                    }
                }

            });

            var script = TObject.create();
            script.add('config.print', PrintConfig);
            script.add('fountain', Fountain);
            script.add('tokens', Tokens);
            script.add('lines', Lines);
            script.add('stats.pages', PagesStats);
            script.add('parser.fountain', FountainParser);

            script.set('fountain', 'line 1\n\nline 2\nline 3');
            script.set('config.print', {lines_per_page: 3});

            chai.assert(script.get('stats.pages'), 1);
        });

    });
});