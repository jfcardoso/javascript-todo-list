App.ListController = Ember.Controller.extend({
	content: ListService.query({},function(result){
		return {lists: result};
	})
});

App.NewController = Ember.Controller.extend({
	name: '',
	new: function() {
	  ListService.save({name:this.get('name')},function(list){
	  	  App.router.transitionTo('todo',{listId:list.id});	
	  })
	  this.set('name','')
    }
});