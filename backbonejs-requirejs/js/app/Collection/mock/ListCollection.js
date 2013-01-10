define([
  'jquery',
  'underscore',
  'backbone',
  'model/mock/ListModel',
  'model/mock/localstorage-mock'
], function($, _, Backbone, List, Store){

  var ListCollection = Backbone.Collection.extend({
      model: List,
      localStorage: new Backbone.LocalStorage("list")
  });

  var lists = new ListCollection();

  //clear all datas
  localStorage.clear();

  var list1 = new List(
    {
      id:1,
      name:'Learn BackboneJS',
      open_items: 1
    }
  );

  var list2 = new List(
    {
      id:2,
      name:'Learn Django',
      open_items: 1
    }
  );

  lists.create(list1);
  lists.create(list2);

  return ListCollection;

});

