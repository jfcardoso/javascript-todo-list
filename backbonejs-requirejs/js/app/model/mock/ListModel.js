define([
  'jquery',
  'underscore',
  'backbone',
  'model/mock/localstorage-mock'
], function($, _, Backbone, Store){

  var context = function(){};

  var List = Backbone.Model.extend({
    localStorage: new Backbone.LocalStorage("list"),
    defaults: function() {
      return {
          name: "",
          open_items: 0
        };
      }
  });

  return List;
});

