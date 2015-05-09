define(['utils/registry'], function(registry){

    describe('Registry', function(){

        var test_registry;

        beforeEach(function(){
            test_registry = registry.create();
        });

        it('saves an object to registry', function() {
            var foo = {}, bar = {};

            test_registry.add('foo', foo);
            chai.assert.strictEqual(test_registry.get('foo'), foo);
            chai.assert.isUndefined(test_registry.get('bar'));

            test_registry.add('bar', bar);
            chai.assert.strictEqual(test_registry.get('foo'), foo);
            chai.assert.strictEqual(test_registry.get('bar'), bar);
        });

    });

});