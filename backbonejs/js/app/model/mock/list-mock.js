window.List = Backbone.Model.extend({
  urlRoot: 'lists',
  defaults: function() {
    return {
        name: "",
        open_items: 0
      };
    },
});

window.ListCollection = Backbone.Collection.extend({
    url: 'lists',
    model: List,
    localStorage: new Backbone.LocalStorage("list"),
    initialize: function(){
      localStorage.clear();  
    }
});

window.listCollection = new ListCollection();

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

listCollection.create(list1);
listCollection.create(list2);

