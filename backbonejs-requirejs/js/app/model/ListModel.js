define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){

    var List = Backbone.Model.extend({
        urlRoot: "http://localhost:8000/api/v1/lists"
    });

    return List;

});
