# backbone-cache
A cache component for use with Backbone. You can include it in your base app and wrap it. You can also call the methods directly, if you wanted to use it directly in a single view or app for example.


## Build Status
[![Build Status](https://travis-ci.org/zsyed91/backbone-cache.svg)](https://travis-ci.org/zsyed91/backbone-cache)


## Purpose

- Sharing data between multiple views
- Caching api calls to reduce server load


## How to use

By default the cache uses `window.cache` store the items. 

### Options

#### storageType - optional

This option determines if the class should use `window.cache` or internally view `this.cache`.
The valid options are `['window', 'internal']`. Defaults to `window`.

```js
var options = {
    storageType: 'window'
}

```

#### eventHandler - optional

This is for listening for event triggers. If you use a custom event object by extending `Backbone.Events` you can pass in a reference to it here. Otherwise it will default to using `Backbone.Events` as the event handler.

```js
var App: {
    events: _.extend({}, Backbone.Events)
};

var options = {
    eventHandler: App.events
}
```


### Namespace for cache methods

If no namespace is provided to any of the cache methods and events, it will default to using `'global'` as the namespace

### Create Cache

Create a cache at a specified namespace. If no namespace is passed in, it defaults to using `'global'` as the namespace.

```js
var Cache = require("backbone.cache");

App.cache = new Cache();

// Approach 1
App.cache.createCache("namespace");
// window.cache["namespace"] will exist


// Approach 2
var view = new ToDoView();

//  In the constructor
initalize: function(options) {
    App.events.trigger('cache.createCache', 'ToDoCache');
    // window.cache['ToDoCache'] will now exist
}
```


### Add to cache

Add an item to the cache at the provided key and namespace. If namespace does not exist, `createCache` will automatically be called.

```js
var Cache = require("backbone.cache");
App.cache = new Cache();

// Approach 1
App.cache.addToCache("key", "value", "namespace");


// Approach 2
var view = new ToDoView();

    // Inside initialize for ToDoView
    initialize: function(options){
        // Load items and save it to cache (ofc, check cache first but this is an example)
        $.ajax({
            url: 'api/path',
            type: 'GET',
            success: function(response) {
                App.events.trigger('cache.addToCache', response);
            }
        });
    }
```


### Remove from cache

Remove an item from the cache at the provided key and namespace.

```js
var Cache = require("backbone.cache");
App.cache = new Cache();

// Approach 1
App.cache.removeFromCache("key", "namespace");


// Approach 2
// (method in a view, model, collection, etc)
noMoreItems: function(){
    App.events.trigger("cache.removeFromCache", "key", "namespace")
}

```

### Clear cache

Removes everything in the cache for the namespace.

```js
var Cache = require("backbone.cache");
App.cache = new Cache();

App.cache.createCache("some-namespace");

// Approach 1
App.cache.clearCache("some-namespace");


// Approach 2
//   Some point where namespaced cache is no longer needed
close: function(){
    App.events.trigger("cache.clearCache", "namespace");
}

```

### Get from cache

Get something from the cache. While an event is thrown with the object returned, its easier to write a quick wrapper method in your base app, or base view to retrieve the item.

```js
// App wrapper
var Cache = require("backbone.cache");
App.cache = new Cache();

App.getFromCache = function(key, namespace){
    return this.cache.getFromCache(key, namespace);
}


// Calling it in your view
var view = new ToDoView({
                models: App.getFromCache("existingToDoItems", "ToDoNamespace");
           });
```
