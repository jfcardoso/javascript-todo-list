App.ListController = Ember.Controller.extend({
	
});

App.NewController = Ember.Controller.extend({
	name: '',
	new: function() {
	  ListService.save({name:this.get('name')},function(list){
	  	App.router.transitionTo('todo',{listId:list.get('id')});	
	  	this.set('name','')
	  })
    }
});