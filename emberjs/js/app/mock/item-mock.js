var ItemService = Ember.Object.create({
	query: function(params,cb){
		itemsByList = [];
		for (i=0;i<items.length;i++){
			if (items[i].list.id == params.list){
			  itemsByList.push(items[i]);
			}
		}
		return cb(itemsByList);
	},
	save: function(params,cb){
		if (params.id){
			for (i=0;i<items.length;i++){
				if (items[i].id == params.id){
					items[i] = params;
					return cb(params);
				}
			}	
		} else {
			var item = App.Item.create({
		  		id:items.length+1, 
		  		name:params.name,
		  		list:params.list 
		  	})
		  	items.push(item);
		  	return cb(item);	
		}
	}
});

var items = [
	App.Item.create({id:1, name:'Todo Item 1 of EmberJS', done: false,list:lists[0]}),
    App.Item.create({id:2, name:'Todo Item 2 of EmberJS', done: true,list:lists[0]}),    
    App.Item.create({id:3, name:'Todo Item 1 of Django', done: false,list:lists[1]}),
    App.Item.create({id:4, name:'Todo Item 2 of Django', done: true,list:lists[1]})
];