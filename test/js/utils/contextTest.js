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

        it('connect async singals', function(done){
            var source = off.async(function(value, callback){
                setTimeout(function(){
                    callback(value);
                }, 10);
            });
            var dest1 = off.async(function(value, callback){
                setTimeout(function(){
                    dest1.value = value;
                    callback(value);
                }, 15)
            });
            var dest2 = off.async(function(value, callback){
                setTimeout(function(){
                    dest2.value = value;
                    callback(value);
                }, 15)
            });

            source(5);
            setTimeout(function(){
                chai.assert.equal(dest1.value, 5);
                chai.assert.equal(dest2.value, 7);
                done();
            },100);
        });

    });

});