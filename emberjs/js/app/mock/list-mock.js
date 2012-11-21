App.List = Ember.Object.extend({
  id: null,
  name: '',
  open_items: 0,
});

var ListService = Ember.Object.create({ 
	query: function(params,cb){
		return cb(lists);
  	},
  	get: function(params,cb){
		for (i=0;i<lists.length;i++){
			if (lists[i].id == params.id){
				return cb(lists[i]);
	    	}
	  	}
  	},
  	save: function(params,cb){
  		var list = App.List.create({
	  		id:lists.length+1, 
	  		name:params.name
	  	})
	  	lists.push(list);
	  	return cb(list);
  	}
})

var lists = [
	App.List.create({id:1, name:'Learn EmberJS', open_items: 1 }),
	App.List.create({id:2, name:'Learn Django', open_items: 1 })
];
