define(['utils/context', 'off'], function(context, off){

    describe('context', function(){

        it('saves references', function(){
            var foo = {}, bar = {};
            context.object('foo', foo);
            context.object('bar', bar);

            chai.assert.equal(context.object('foo', foo));
            chai.assert.equal(context.object('bar', bar));
        });

        it('connects signals', function() {
            var source = off.signal(), dest = off.property();

            context.object('source', source);
            context.object('dest', dest);
            context.feature('when source then dest');

            source(5);
            chai.assert.equal(dest(), 5);
        });

        it('connects multiple signals', function() {
            var source = off.signal(),
                dest1 = off.property(),
                dest2 = off.property();

            context.object('source', source);
            context.object('dest1', dest1);
            context.object('dest2', dest2);
            context.feature('when source then dest1 then dest2');

            source(10);
            chai.assert.equal(dest1(), 10, 'dest1 should be 10');
            chai.assert.equal(dest2(), 10, 'dest2 should be 10');
        });

        it('connects multiple signals in a non-breakable flow', function(){
            var source = off.signal(),
                dest1 = off.property(),
                dest2 = off.property();

            context.object('source', source);
            context.object('dest1', dest1);
            context.object('dest2', dest2);
            context.feature('when source then dest1 then dest2');

            source(10);
            dest1(5); // break the flow
            chai.assert.equal(dest1(), 5, 'dest1 should be 10');
            chai.assert.equal(dest2(), 10, 'dest2 should be 10');
        });

        it('connect async signals', function(done){
            var source = off.async2(function(value, callback){
                setTimeout(function(){
                    callback(value);
                }, 10);
            });
            var dest1 = off.async2(function(value, callback){
                setTimeout(function(){
                    dest1.value = value;
                    callback(value);
                }, 15)
            });
            var dest2 = off.async2(function(value, callback){
                setTimeout(function(){
                    dest2.value = value;
                    callback(value);
                }, 15)
            });

            context.object('source', source);
            context.object('dest1', dest1);
            context.object('dest2', dest2);
            context.feature('when source then dest1 then dest2');

            source(5);

            setTimeout(function(){
                chai.assert.equal(dest1.value, 5);
                chai.assert.equal(dest2.value, 5);
                done();
            },100);
        });

        it('allows to connect factories with signals', function(){
            var prop = off.property();
            var factory = off(function(){
                return {
                    signal: off.signal()
                }
            });

            context.object('prop', prop);
            context.object('factory', factory);

            context.feature('when factory.signal then prop');

            var instance1 = factory();
            chai.assert.equal(prop(), undefined);

            instance1.signal(10);
            chai.assert.equal(prop(), 10);

            var instance2 = factory();
            instance2.signal(5);
            chai.assert.equal(prop(), 5);

            instance1.signal(1);
            chai.assert.equal(prop(), 1);
        });

    });

});