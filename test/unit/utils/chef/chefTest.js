define(['utils/chef/chef', 'utils/chef/recipe'], function(Chef, Recipe) {

    describe.only('chef', function() {

        var EncodedContent, Content, Words, WordsCount,
            content_getter, words_getter;

        beforeEach(function() {

            content_getter = sinon.stub();
            words_getter = sinon.stub();

            Content = Recipe.extend({
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

            EncodedContent = Recipe.extend({
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

            Words = Recipe.extend({
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

            WordsCount = Recipe.extend({
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
            var script = Chef.create();
            script.add('content', Content);

            chai.assert.equal(script.get('content'), 'default');
        });

        it('basic setter and getter', function() {
            var script = Chef.create();
            script.add('content', Content);

            script.set('content', 'test');
            chai.assert.equal(script.get('content'), 'test');
        });

        it('computed getters', function() {
            var script = Chef.create();
            script.add('content', Content);
            script.add('words', Words);

            script.set('content', 'foo bar');
            chai.assert.lengthOf(script.get('words'), 2);
        });

        it('two computed getters', function() {
            var script = Chef.create();
            script.add('content', Content);
            script.add('words', Words);
            script.add('words.count', WordsCount);

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('words.count'), 2);
        });

        it('missing dependencies', function() {
            var script = Chef.create();
            script.add('content', Content);
            script.add('words.count', WordsCount);

            script.set('content', 'foo bar');
            chai.assert.equal(script.get('words.count'), 2);
        });

        it('setters', function() {
            var script = Chef.create();
            script.add('content', Content);
            script.add('content.encoded', EncodedContent);

            script.set('content.encoded', 'FOO BAR');
            chai.assert.equal(script.get('content'), 'foo bar');
        });

        it('getters are cached', function() {
            var script = Chef.create();
            script.add('content', Content);

            script.set('content', 'test');
            script.get('content');
            script.get('content');

            sinon.assert.calledOnce(content_getter);
        });

        it('cached is clear when the value is set', function() {
            var script = Chef.create();
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
        })
    });

});