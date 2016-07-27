define(['core/model'], function(Model) {

    describe.only('model', function() {

        beforeEach(function() {

        });

        it('creates observable property', function() {

            var Test = Model.extend({

                data: Model.Property()

            });

            var test = Test.create();
            var observer = sinon.stub();

            test.data.add(observer);
            test.data('value');

            sinon.assert.calledOnce(observer);
        });

        it('creates computed property', function() {

            var Test = Model.extend({

                list: Model.Property(),

                length: Model.Computed('list', function() {
                    return this.list.length;
                })

            });

            var test = Test.create();
            test.list([1,2]);

            chai.assert.equal(test.length() , 2);
        })
    });

});