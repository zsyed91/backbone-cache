require.config({
  baseUrl: 'src',

  paths: {
    'jasmine': '../lib/jasmine/jasmine',
    'jasmine-html': '../lib/jasmine/jasmine-html',
    'jasmine-boot': '../lib/jasmine/boot',
    'backbone': '../lib/backbone/backbone.min',
    'underscore': '../lib/underscore/underscore.min',
    'jquery': '../lib/jquery/jquery.min'
  },

  shim: {
    'jasmine-html': {
      deps: ['jasmine']
    },
    'jasmine-boot': {
      deps: ['jasmine', 'jasmine-html']
    }
  }
});