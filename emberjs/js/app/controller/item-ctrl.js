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
		var todoController = this;
		todoController.get("content.list").open_items++;
		var item = event.context;
		item.set('done',false)
		ItemService.save(item,function(result){
			ItemService.query({list:todoController.get("content.list").id},function(result){
				todoController.set("content.items",result)		
			})
		})
	},
	close_item: function(event){
		var todoController = this;
		todoController.get("content.list").open_items--;
		var item = event.context;
		item.set('done',true)
		ItemService.save(item,function(result){
			ItemService.query({list:todoController.get("content.list").id},function(result){
				todoController.set("content.items",result)		
			})
		})
	},
	add_item : function() {
		var todoController = this;
		var contentList = todoController.get('content.list');
		var contentItems = todoController.get('content.items');
		contentList.open_items++;
		var item = App.Item.create(
		{ 
	  		name: todoController.get('name'), 
	  		list: contentList
	  	});
	  	ItemService.save(item,function(result){
	  		ItemService.query({list:contentList.id},function(result){
				todoController.set("content.items",result);
	  			todoController.state_close()
			})
	  	})
	},
	filtered_open: function() {
        return this.get("content.items").filterProperty('done', false)
    }.property('content.items.@each').cacheable(),
    filtered_done: function() {
        return this.get("content.items").filterProperty('done', true)
    }.property('content.items.@each').cacheable() 
});