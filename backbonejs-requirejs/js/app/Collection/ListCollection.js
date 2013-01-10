define([
  'jquery',
  'underscore',
  'backbone',
  'model/ListModel'
], function($, _, Backbone, List){

    var ListCollection = Backbone.Collection.extend({
        model: List,
        url: "http://localhost:8000/api/v1/lists"
    });

    return ListCollection;
    
});