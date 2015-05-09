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

            this.listenTo(this.eventHandler, 'cache.createCache', "createCache");
        }
    });

    return BackboneCache;

});