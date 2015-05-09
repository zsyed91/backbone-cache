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

                var App = {
                    events: _.extend({}, Backbone.Events)
                };

                this.options.eventHandler = App.events;
                this.cache = new Cache(this.options);
                expect(this.cache.eventHandler).toEqual(App.events);

            });

            describe("eventHandler should listenTo", function(){

                beforeEach(function(){
                    this.cache = new Cache();
                    spyOn(this.cache, 'listenTo');

                    // Manually call constructor so spyOn can check listenTo
                    this.cache.initialize();
                });

                it("cache.createCache", function(){
                    expect(this.cache.listenTo).toHaveBeenCalledWith(this.cache.eventHandler, 'cache.createCache', 'createCache');
                });

            });


        });


    });

});