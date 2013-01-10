define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

    var Item = Backbone.Model.extend({
        urlRoot: "http://localhost:8000/api/v1/items"
    });

    return Item;

});
