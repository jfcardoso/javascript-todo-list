define([
  'jquery',
  'underscore',
  'backbone',
  'model/ItemModel'
], function($, _, Backbone, Item){

    var ItemCollection = Backbone.Collection.extend({
        model: Item,
        url: "http://localhost:8000/api/v1/items"
    });

    return ItemCollection;
    
});