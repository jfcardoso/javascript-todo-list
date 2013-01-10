define([
  'jquery',
  'underscore',
  'backbone',
  'model/mock/localstorage-mock'
], function($, _, Backbone, Store){

    var Item = Backbone.Model.extend({
        localStorage: new Backbone.LocalStorage("item"),
        defaults: function() {
          return {
              name: "",
              done: false
            };
          }
    });

    return Item;
});
