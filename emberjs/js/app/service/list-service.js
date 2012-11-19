var ListResource = Ember.Resource.extend({ 
	resourceUrl:        'http://localhost:8000/api/v1/lists',
	resourceName: 'list',
  	resourceProperties: ['id', 'name','open_items'],
});
var resource = ListResource.create();

var ListService = Ember.Object.create({ 
	query: function(params,cb){	
		/*var obj = []
		var result = resource.findResource()
				.done(function(json){
					for (var i=0; i < json.length; i++){
	      				obj.push(App.List.create({id:json[i].id,name:json[i].name,open_items:json[i].open_items}));
	      			}
	      			console.log(obj)
	      			cb(obj)
				})
		console.log(obj)*/
		//	return cb(obj)

		$.ajax({
            type: "GET",
			url: "http://localhost:8000/api/v1/lists",
			success: function ( data ) {
				return cb(data);
			}
    	});
    	//return cb([])
  	},
  	get: function(params,cb){
  		$.ajax({
            type: "GET",
			url: "http://localhost:8000/api/v1/lists/"+params.id,
			success: function ( data ) {
				return cb(data);
			}
    	});
  	},
  	save: function(params,cb){
		$.ajax({
            type: "POST",
			url: "http://localhost:8000/api/v1/lists",
			data: JSON.stringify(params),
			success: function ( data ) {
				return cb(data);
			}
    	});
  	}
})




