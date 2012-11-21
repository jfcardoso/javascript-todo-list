var App = Ember.Application.create();

App.ApplicationController = Ember.ArrayController.extend();
App.ApplicationView = Ember.View.extend({
	templateName: 'index'
});

App.Router = Ember.Router.extend({
	root: Ember.Route.extend({
		index: Ember.Route.extend({
			route: '/',
			connectOutlets: function(router) {
				var lists = {}
				ListService.query({},function(result){
					lists = {lists: result};
				})
				router.get('applicationController').connectOutlet('list',lists);
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
				//logic of controller, how get params value in controller?
				var list = {}
				var item_filter = []
				ListService.get({id:value.listId},function(result){
					list = result;
					ItemService.query({list:list.id},function(result){
						item_filter = result;
					})
	      		})
				router.get('applicationController').connectOutlet('todo', {list: list,items: item_filter});
			}
		})
	})
})

App.TextField = Ember.TextField.extend({
	attributeBindings: ['autofocus'],
    autofocus: 'autofocus',
	didInsertElement: function() {
      this.$().focus();
    }
})

Ember.Handlebars.registerHelper('raw', function (name) {
	return new Handlebars.SafeString(this.get(name) || name);
});