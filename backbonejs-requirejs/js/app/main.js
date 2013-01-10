
require.config({
  paths: {
    jquery: '../lib/jquery-1.7.2.min',
    underscore: '../lib/underscore',
    backbone: '../lib/backbone',
    text: '../lib/text',
    templates: '../../templates'
  },
  shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'text': {
            deps: ['underscore'],
            exports: 'text'
        }
    }
});

require([
  'router'
], function(Router){
  
});
