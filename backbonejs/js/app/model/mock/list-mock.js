window.List = Backbone.Model.extend({
  localStorage: new Backbone.LocalStorage("list"),
  defaults: function() {
    return {
        name: "",
        open_items: 0
      };
    },
});

window.ListCollection = Backbone.Collection.extend({
    model: List,
    localStorage: new Backbone.LocalStorage("list"),
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

