define(function(){

    var module = {};

    module.create = function() {

        var registry = {objects: {}};

        registry.add = function(id, object) {
            registry.objects[id] = object;
        };

        registry.get = function(id) {
            return registry.objects[id];
        };

        return registry;

    };

    return module;

});
