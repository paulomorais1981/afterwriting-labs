define(['utils/lazy-object/trait-utils', 'utils/lazy-object/trait'], function(TraitUtils, Trait) {

    describe('TraitUtils', function() {

        it('flattens traits', function() {

            var a = Trait.extend(),
                b = Trait.extend(),
                c = Trait.extend();

            var result = {};

            TraitUtils.flatten_traits(result, {
                a: a,
                nested: {
                    b: b,
                    c: c
                }
            }, []);

            chai.assert.deepEqual(result, {
                'a': a,
                'nested.b': b,
                'nested.c': c
            });
        });

        it('generates unique names', function() {
            chai.assert.notEqual(TraitUtils.next_name(), TraitUtils.next_name());
        });

        it('resolves property from the namespace', function() {
            var object = {
                my: {
                    namespace: {
                        host: {
                            property: 'value'
                        }
                    }
                }
            };

            var result = TraitUtils.resolve_property_owner(object, 'my.namespace.host.property');
            chai.assert.strictEqual(result.owner, object.my.namespace.host);
            chai.assert.strictEqual(result.name, 'property');
        });

    });

});