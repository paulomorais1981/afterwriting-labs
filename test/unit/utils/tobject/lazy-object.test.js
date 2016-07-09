define(['utils/lazy-object/lazy-object', 'utils/lazy-object/trait'], function(LazyObject, Trait) {

    describe('LazyObject', function() {

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
            var script = LazyObject.create({
                content: Content
            });

            chai.assert.equal(script.get('content'), 'default');
        });

        it('basic setter and getter', function() {
            var script = LazyObject.create({
                content: Content
            });

            script.set('content', 'test');
            chai.assert.equal(script.get('content'), 'test');
        });

        it('computed getters', function() {
            var script = LazyObject.create({
                content: Content,
                words: Words
            });

            script.set('content', 'foo bar');
            chai.assert.lengthOf(script.get('words'), 2);
        });

        it('two computed getters', function() {
            var script = LazyObject.create({
                content: Content,
                words: {
                    list: Words,
                    count: WordsCount
                }
            });

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('words.count'), 2);
        });

        it('missing dependencies', function() {
            var script = LazyObject.create({
                content: Content,
                'words.count': WordsCount
            });

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('words.count'), 2);
        });

        it('aliases', function() {
            var script = LazyObject.create({
                content: Content,
                count: WordsCount,
                length: WordsCount
            });

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('count'), 2);
            chai.assert.equal(script.get('length'), 2);
        });

        it('aliases for missing dependencies', function() {
            var script = LazyObject.create({
                content: Content,
                'words.count': WordsCount
            });
            script.$add('words', Words);

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('words.count'), 2);
            chai.assert.deepEqual(script.get('words'), ['foo', 'bar']);

        });

        it('setters', function() {
            var script = LazyObject.create({
                content: {
                    value: Content,
                    encoded: EncodedContent
                }
            });

            script.set('content.encoded', 'FOO BAR');
            chai.assert.equal(script.get('content.value'), 'foo bar');
        });

        it('getters are cached', function() {
            var script = LazyObject.create({
                content: Content
            });

            script.set('content', 'test');
            script.get('content');
            script.get('content');

            sinon.assert.calledOnce(content_getter);
        });

        it('cached is cleared when the value is set', function() {
            var script = LazyObject.create({
                content: Content,
                words: Words
            });

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

        it('direct access', function() {

            var data = LazyObject.create({
                content: Content
            });

            data.set('content', 'test');

            chai.assert(data.content, 'test');

            data.content = 'test2';

            chai.assert(data.get('content'), 'test2');
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

            var data = LazyObject.create({
                content: Content,
                toUpperCase: UpperCase
            });

            data.set('content', 'foo');
            chai.assert.equal(data.get('content'), 'foo');
            chai.assert.equal(data.get('toUpperCase')(), 'FOO');
            chai.assert.equal(data.toUpperCase(), 'FOO');
        });

        it('use case', function() {

            var Fountain = Trait.extend({

                $create: function() {
                    this.fountain = '';
                },

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
                    this.config = {lines_per_page: 5}
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

            var script = LazyObject.create({
                config: {
                    print: PrintConfig
                },
                fountain: Fountain,
                tokens: Tokens,
                lines: Lines,
                stats: {
                    pages: PagesStats
                }
            });

            // fountain parser
            script.watch('fountain', function() {
                script.tokens = script.fountain.split('\n');
            }, null);

            script.set('config.print', {lines_per_page: 3});
            script.set('fountain', 'line 1\n\nline 2\nline 3');

            chai.assert(script.get('stats.pages'), 1);
        });

        describe('watchers', function() {

            var trait_formula, SimpleTrait, data, watcher;

            beforeEach(function() {
                trait_formula = sinon.stub();

                SimpleTrait = Trait.extend({

                    content: {
                        type: Content
                    },

                    value: {
                        get: trait_formula
                    }
                });

                data = LazyObject.create({
                    content: Content,
                    trait: SimpleTrait
                });

                watcher = sinon.stub();
            });

            it('runs the watcher handler straight away', function() {

                data.watch('trait', watcher, null);

                sinon.assert.calledOnce(watcher);
            });

            it('triggers watcher if value changes', function() {

                data.watch('trait', watcher, null);

                watcher.reset();
                data.content = "foo bar";

                sinon.assert.calledOnce(watcher);

                data.content = "foo bar bar";
                sinon.assert.calledTwice(watcher);
            });

            it('does not trigger the watcher if value does not change', function() {

                data.watch('trait', watcher, null);

                watcher.reset();

                data.content = "foo bar";
                sinon.assert.calledOnce(watcher);

                data.content = "foo bar";
                sinon.assert.calledOnce(watcher);
            });

            it('removing watchers', function() {
                data.watch('trait', watcher, null);
                data.unwatch('trait', watcher, null);
                watcher.reset();

                data.content = "foo bar";
                sinon.assert.notCalled(watcher);
            });

            it('removing specific watchers', function() {
                var watcher2 = sinon.stub(), context = {};

                data.watch('trait', watcher, context);
                data.watch('trait', watcher2, context);
                data.unwatch('trait', watcher, context);

                watcher.reset();
                watcher2.reset();
                data.content = "foo bar";

                sinon.assert.called(watcher2);
                sinon.assert.notCalled(watcher);
            });

            it('removing all watchers for a context', function() {
                var watcher_same_context = sinon.stub(),
                    watcher_other_context = sinon.stub(),
                    a = {}, b = {};

                data.watch('trait', watcher, a);
                data.watch('trait', watcher_same_context, a);
                data.watch('trait', watcher_other_context, b);
                data.unwatch('trait', null, a);

                watcher.reset();
                watcher_same_context.reset();
                watcher_other_context.reset();
                data.content = "foo bar";

                sinon.assert.called(watcher_other_context);
                sinon.assert.notCalled(watcher);
                sinon.assert.notCalled(watcher_same_context);

            });

        });

    });
});