App.List = DS.Model.extend({
    name: DS.attr('string'),
    open_items: DS.attr('number',{defaultValue:0}),
    items: DS.hasMany('App.Item'),
})

var ListService = Ember.Object.create({ 
	query: function(params,cb){
		return cb(App.store.findQuery(App.List))
  	},
  	get: function(params,cb){
  		return cb(App.store.find(App.List,params.id))
  	},
  	save: function(params,cb){
  		var list = App.List.createRecord(params)  		
		list.addObserver('id', list, cb);
  		App.store.commit()
  	}
})




