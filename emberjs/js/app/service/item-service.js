App.Item = DS.Model.extend({
    name: DS.attr('string'),
    done: DS.attr('boolean',{defaultValue:false}),
    list: DS.belongsTo('App.List'),
})

var ItemService = Ember.Object.create({
    query: function(params,cb){
        return cb(App.store.findQuery(App.Item,params))
    },
    get: function(params,cb){
        return cb(App.store.find(App.Item,params.id))
    },
    save: function(params,cb){
        if (params.id){
          App.store.commit()
          params.removeObserver('done')
          params.addObserver('done', params, cb);
        }else {
          var item = App.Item.createRecord(params)
          item.addObserver('id', item, cb);
          App.store.commit()
        }
        
    }
})