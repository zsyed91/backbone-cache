define(["backbone", "underscore", "backbone.cache"],
function(Backbone, _, Cache){

    describe("BackboneCache", function(){

        var cache;
        var options;

        beforeEach(function(){
            this.options = {};

            window.cache = undefined;
        });


        describe("#initialize", function(){

            afterEach(function(){
                this.cache.remove();
            });

            it("should create cache on window.cache if no storageType set", function(){
                this.cache = new Cache();
                expect(window.cache).toBeDefined();
                expect(this.cache.cache).toEqual(window.cache);
            });

            it("should create cache on window.cache if storageType = window", function() {
                this.options.storageType = "window";
                this.cache = new Cache(this.options);

                expect(window.cache).toBeDefined();
                expect(this.cache.cache).toEqual(window.cache);
            });

            it("should create an internal cache if storageType = internal", function(){
                this.options.storageType = 'internal';
                this.cache = new Cache(this.options);

                expect(window.cache).not.toBeDefined();
                expect(this.cache.cache).not.toEqual(window.cache);
            });

            it("should use the backbone events object if no eventHandler is passed in", function(){
                this.cache = new Cache();

                expect(this.cache.eventHandler).toEqual(Backbone.Events);
            });

            it("should use the eventHandler passed in", function(){
                this.options.eventHandler = Backbone.Events;
                this.cache = new Cache(this.options);
                expect(this.cache.eventHandler).toEqual(Backbone.Events);

                this.cache.remove();


                var App = {
                    events: _.extend({}, Backbone.Events)
                };

                this.options.eventHandler = App.events;
                this.cache = new Cache(this.options);
                expect(this.cache.eventHandler).toEqual(App.events);

            });
        });

        describe("#createCache", function(){

                beforeEach(function(){
                    this.cache = new Cache();
                });

                afterEach(function(){
                    this.cache.remove();
                });

                it("should exist", function(){
                    expect(this.cache.createCache).toBeDefined();
                });

                it("should create a namespaced cache", function(){
                    this.cache.createCache("namespace");
                    expect(this.cache.cache.namespace).toEqual({});
                });

                it("should use 'global' if an empty namespace is passed in", function(){
                    this.cache.createCache();
                    expect(this.cache.cache.global).toEqual({});
                });

                it("should not recreate an existing namespace", function(){
                    this.cache.createCache("namespace");
                    var cacheItem = {test: "123"};

                    expect(this.cache.cache.namespace).toEqual({});
                    this.cache.cache.namespace = cacheItem;

                    this.cache.createCache("namespace");
                    expect(this.cache.cache.namespace).toEqual(cacheItem);
                });
        });

        describe("#addToCache", function(){

            var object, namespace;

            beforeEach(function(){
                window.cache = undefined;
                this.cache = new Cache();
                this.object = {};
                this.namespace = "namespace";
                this.cache.createCache(this.namespace);
            });

            afterEach(function(){
                this.cache.remove();
                window.cache = undefined;
                
            });

            it("should exist", function(){
                expect(this.cache.addToCache).toBeDefined();
            });

            it("should add an object to cache under the correct namespace", function(){
                this.cache.addToCache("key", this.object, this.namespace);
                expect(this.cache.cache[this.namespace].key).toEqual(this.object);

            });

            it("should autopopulate cache if namespace does not exist in cache yet", function(){
                window.cache = undefined;
                this.cache = new Cache();
                this.cache.addToCache("key", this.object, this.namespace);

                expect(this.cache.cache[this.namespace].key).toBeDefined();

                this.cache.remove();
            });

            it("should use the global namespace if no namespace is passed in", function(){
                this.cache.addToCache("key", this.object);

                expect(this.cache.cache.global.key).toEqual(this.object)
            });
        });

        describe("#removeFromCache", function(){

            var namespace, object;


            beforeEach(function(){
                this.cache = new Cache();
                this.object = [
                    {some: "Data"},
                    {some: "More data"}
                ];

                this.namespace = "namespace";
            });

            it("should exist", function(){
                expect(this.cache.removeFromCache).toBeDefined();
            });

            it("should remove the item at the namespace from the cache", function(){
                this.cache.addToCache("key", this.object, this.namespace);
                this.cache.removeFromCache("key", this.namespace);

                expect(this.cache.cache[this.namespace].key).not.toBeDefined();
            });

            it("should remove the item at the global namespace if no namespace is passed in", function(){
                this.cache.addToCache("key", this.object);
                
                this.cache.removeFromCache("key");

                expect(this.cache.cache.global.key).not.toBeDefined();
            });

            it("should not fail if key does not exist for namespace", function(){
                var result = this.cache.removeFromCache("no_key_exists");
            
                expect(result).toBeFalsy();
            });
        });


        describe("#clearCache", function(){

            var namespace;

            beforeEach(function(){
                this.cache = new Cache();
                this.namespace = "namespace";

                this.cache.createCache(this.namespace);
                this.cache.addToCache("key", "3", this.namespace);
            });

            afterEach(function(){
                this.cache.remove();
            });

            it("should exist", function(){
                expect(this.cache.clearCache).toBeDefined();
            });

            it("should clear an existing cache at namespace", function(){
                this.cache.clearCache(this.namespace);


                expect(this.cache.cache[this.namespace]).toEqual({});
            });

            it("should clear the global namespace if no namespace is passed in", function(){
                this.cache.createCache();
                this.cache.addToCache("key", "a sentence");

                this.cache.clearCache();

                expect(this.cache.cache.global).toEqual({});
            });

            it("should clear a namespace if it doesn't exist - equal to #createCache", function(){
                this.cache.clearCache("namespace_doesnt_exist");

                expect(this.cache.cache.namespace_doesnt_exist).toEqual({});
            });
        });


        describe("#getFromCache", function(){

            var namespace, object;

            beforeEach(function(){
                this.cache = new Cache();

                this.object = {
                    test: "message",
                    error: false,
                    count: 3
                };

                this.namespace = "test";

                this.cache.createCache(this.namespace);
                this.cache.addToCache("status", this.object, this.namespace);
            });

            afterEach(function(){
                this.cache.remove();
            });


            it("should exist", function(){
                expect(this.cache.getFromCache).toBeDefined();
            });

            it("should get the object at key for namespace", function(){
                var object = this.cache.getFromCache("status", this.namespace);

                expect(object).toEqual(this.object);
            });

            it("should get the object at key for global namespace", function(){
                this.cache.addToCache("status_1", this.object);

                var object = this.cache.getFromCache("status_1");

                expect(object).toEqual(this.object);
            });

            it("should return undefined if key does not exist", function(){
                var object = this.cache.getFromCache("not_there", this.namespace);

                expect(object).not.toBeDefined();

                this.cache.createCache();
                object = this.cache.getFromCache("global_not_there");
                expect(object).not.toBeDefined();
            });

            it("should return undefined if namespace does not exist", function(){
                
                var object = this.cache.getFromCache("not_there", "no_namespace");
                expect(object).not.toBeDefined();


                var globalObject = this.cache.getFromCache("global_not_there");
                expect(globalObject).not.toBeDefined();
            });

        });

    });

});