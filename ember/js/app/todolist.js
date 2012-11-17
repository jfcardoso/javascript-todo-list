var App = Ember.Application.create();

App.ApplicationController = Ember.Controller.extend();
App.ApplicationView = Ember.View.extend({
  templateName: 'index'
});

App.List = Ember.Object.extend({
  id: null,
  name: '',
  open_items: 0
});

App.Item = Ember.Object.extend({
  id: null,
  name: '',
  done: false
});

var lists = [
	App.List.create({id:1, name:'Learn EmberJS', open_items: 1 }),
	App.List.create({id:2, name:'Learn Django', open_items: 1 })
];

var items = [
	App.Item.create({id:1, name:'Todo Item 1 of EmberJS', done: false,list:lists[0]}),
    App.Item.create({id:2, name:'Todo Item 2 of EmberJS', done: true,list:lists[0]}),    
    App.Item.create({id:3, name:'Todo Item 1 of Django', done: false,list:lists[1]}),
    App.Item.create({id:4, name:'Todo Item 2 of Django', done: true,list:lists[1]})
];

function item_query(params){
	itemsByList = [];
	for (i=0;i<items.length;i++){
		if (items[i].list.id == params.list){
		  itemsByList.push(items[i]);
		}
	}
	return itemsByList;
}

item_update = function(item) {
	for (i=0;i<items.length;i++){
		if (items[i].id == item.id){
			items[i] = item;
			return item
		}
	}
}

function list_get(params){
	for (i=0;i<lists.length;i++){
		if (lists[i].id == params.id){
			return lists[i];
    	}
  	}
}

App.ListController = Ember.Controller.extend({

});

App.ListView = Ember.View.extend({
  templateName: 'list'
});

App.NewController = Ember.Controller.extend({
	name: '',
	new: function() {
	  var list = App.List.create({
	  	id:lists.length+1, 
	  	name:this.get('name'), open_items: 0 }
	  );
	  lists.push(list)
	  App.router.transitionTo('todo',{listId:list.id});
    }
});
App.NewView = Ember.View.extend({
  templateName: 'new',
  state_add_new_item: false,
});

App.TodoController = Ember.Controller.extend({
	name: '',
	view_close: true,
	view_open: false,

	state_open : function() {
		this.set('view_close',false);
		this.set('view_open',true);
	},
	state_close : function() {
		this.set('view_close',true);
		this.set('view_open',false);
		this.set('name','');
	},
	open_item: function(event){
		this.get("content.list").open_items++;
		var item = event.context;
		item.set('done',false)
		item_update(item)
		this.set("content.items",item_query({list:this.get("content.list").id}))
	},
	close_item: function(event){
		this.get("content.list").open_items--;
		var item = event.context;
		item.set('done',true)
		item_update(item)
		this.set("content.items",item_query({list:this.get("content.list").id}))
	},
	add_item : function() {
		this.get("content.list").open_items++;
		var item = App.Item.create(
		{
			id:items.length+1, 
	  		name:this.get('name'), 
	  		done: false,
	  		list: this.get("content.list")
	  	});
	  	items.push(item)
	  	this.set("content.items",item_query({list:this.get("content.list").id}))
	  	this.state_close()
	},
	filtered_open: function() {
        return this.get("content.items").filterProperty('done', false)
    }.property('content.items.@each').cacheable(),
    filtered_done: function() {
        return this.get("content.items").filterProperty('done', true)
    }.property('content.items.@each').cacheable() 
});

App.TodoView = Ember.View.extend({
	templateName: 'todo',
});


App.Router = Ember.Router.extend({
  root: Ember.Route.extend({
    index: Ember.Route.extend({
      route: '/',
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet('list',{lists:lists});
      }
    }),
    newList: Ember.Route.extend({
      route: '/lists/new',
      connectOutlets: function(router) {
        router.get('applicationController').connectOutlet('new');
      }
    }),
    todo: Ember.Route.extend({
      route: '/lists/:listId/items',
      connectOutlets: function(router,value) {
      	var list = list_get({id:value.listId})
      	var item_filter = item_query({list:value.listId})
        router.get('applicationController').connectOutlet('todo', {list: list,items: item_filter});
      }
    })
  })
})

Ember.Handlebars.registerHelper('raw', function (name) {
    return new Handlebars.SafeString(this.get(name) || name);
});

App.initialize();