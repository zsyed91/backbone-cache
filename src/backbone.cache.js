define(["backbone", "underscore"],
function(Backbone, _){

    var BackboneCache = Backbone.View.extend({
        initialize: function(options){
            options = options || {};

            this.eventHandler = options.eventHandler || Backbone.Events;

            if (_.isUndefined(options.storageType) || options.storageType == 'window') {
                window.cache = window.cache || {};
                this.cache = window.cache;
            }
            else {
                this.cache = {};
            }

            this.listenTo(this.eventHandler, 'cache.createCache', this.createCache);
            this.listenTo(this.eventHandler, 'cache.addToCache', this.addToCache);
            this.listenTo(this.eventHandler, 'cache.getFromCache', this.getFromCache);
            this.listenTo(this.eventHandler, 'cache.removeFromCache', this.removeFromCache);
            this.listenTo(this.eventHandler, 'cache.clearCache', this.clearCache);

        },

        createCache: function(namespace) {
            namespace = namespace || 'global';

            if (!_.isUndefined(this.cache[namespace])) {
                return false;
            }
            this.cache[namespace] = {};
            return true;

        },

        addToCache: function(key, object, namespace){
            namespace = namespace || 'global';

            if (_.isUndefined(this.cache[namespace])) {
                this.createCache(namespace);
            }

            this.cache[namespace][key] = object;
        },

        removeFromCache: function(key, namespace){
            namespace = namespace || 'global';

            if (_.isUndefined(this.cache[namespace]) || _.isUndefined(this.cache[namespace][key])) {
                return false;
            }

            // using delete is significantly slower
            this.cache[namespace][key] = undefined;
            return true;
        },

        clearCache: function(namespace) {
            namespace = namespace || 'global';

            this.cache[namespace] = {};
        },

        // Can be called directly, using .extend, wrapping it in a subclass
        //   or having a listener on 'cache.response' which returns the item
        getFromCache: function(key, namespace){
            namespace = namespace || 'global';

            if (_.isUndefined(this.cache[namespace]) || _.isUndefined(this.cache[namespace][key])) {
                this.eventHandler.trigger("cache.response");
                return undefined;
            }

            this.eventHandler.trigger("cache.response", this.cache[namespace][key]);

            return this.cache[namespace][key];
        }
    });

    return BackboneCache;

});