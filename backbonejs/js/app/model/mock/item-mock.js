window.Item = Backbone.Model.extend({
  localStorage: new Backbone.LocalStorage("item"),
  defaults: function() {
    return {
        name: "",
        done: false
      };
    },
});

window.ItemCollection = Backbone.Collection.extend({
    model: Item,
    localStorage: new Backbone.LocalStorage("item")
});

var items = new ItemCollection();

var item1 = new Item(
  {
    id:1,
    name:'Todo Item 1 of BackboneJS',
    done: false,
    list:{
            id:1,
            name:'Learn BackboneJS'
          }
  }
);

var item2 = new Item(
  {
    id:2,
    name:'Todo Item 2 of BackboneJS',
    done: true,
    list:{
            id:1,
            name:'Learn BackboneJS'
          }
  }
);

var item3 = new Item(
  {
    id: 3,
    name:'Todo Item 1 of Django',
    done: false,
    list:{
            id:2,
            name:'Learn Django'
          }
  }
);

var item4 = new Item(
  {
    id: 4,
    name:'Todo Item 2 of Django',
    done: true,
    list:{
            id:2,
            name:'Learn Django'
          }
  }
);

items.create(item1);
items.create(item2);
items.create(item3);
items.create(item4);

