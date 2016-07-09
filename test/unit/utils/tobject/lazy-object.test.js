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

        it('cached is clear when the value is set', function() {
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

        it('observse changes in the values without calculating them straight away', function() {

            var trait_formula = sinon.stub();

            var SimpleTrait = Trait.extend({
                
                content: {
                    type: Content
                },

                value: {
                    get: trait_formula
                }
            });

            var data = LazyObject.create({
                content: Content,
                trait: SimpleTrait
            });

            var observe_trait = sinon.stub();

            data.observe('trait', observe_trait);

            sinon.assert.notCalled(observe_trait);
            data.content = "foo bar";
            sinon.assert.called(observe_trait);

            sinon.assert.notCalled(trait_formula);
            data.trait;
            sinon.assert.calledOnce(trait_formula);
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
            script.observe('fountain', function() {
                script.tokens = script.fountain.split('\n');
            });

            script.set('fountain', 'line 1\n\nline 2\nline 3');
            script.set('config.print', {lines_per_page: 3});

            chai.assert(script.get('stats.pages'), 1);
        });

    });
});