/**
 * Backbone localStorage Adapter
 * https://github.com/jeromegn/Backbone.localStorage
 *
 * and modified by @jandersonfc to my custom mock
 */

(function() {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Hold reference to Underscore.js and Backbone.js in the closure in order
// to make things work even if they are removed from the global namespace
var _ = this._;
var Backbone = this.Backbone;

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.LocalStorage instead
Backbone.LocalStorage = window.Store = function(name) {
  this.name = name;
  var store = this.localStorage().getItem(this.name);
  this.records = (store && store.split(",")) || [];
};

_.extend(Backbone.LocalStorage.prototype, {

  // Save the current state of the **Store** to *localStorage*.
  save: function() {
    console.log(this.records)
    this.localStorage().setItem(this.name, this.records.join(","));
  },

  //@jandersonfc update open_items in list (functionally the backend, mock it here)
  updateList: function(model){
    var list = JSON.parse(this.localStorage().getItem("list-"+model.get('list').id));
    if (model.get('done') == false){
      list.open_items = list.open_items+1;
    } else {
      list.open_items = list.open_items-1;
    }
    this.localStorage().setItem("list-"+list.id, JSON.stringify(list));
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    var new_model;
    if (!model.id) {
      new_model = model.clone();
      new_model.id = guid();
      new_model.set(new_model.idAttribute, new_model.id);
    } else {
       new_model = model;
    }

    //@jandersonfc
    if (this.name == 'list'){
      new_model.open_items = 0;
    }

    this.localStorage().setItem(this.name+"-"+new_model.id, JSON.stringify(new_model));
    this.records.push(new_model.id.toString());
    this.save();

    //@jandersonfc simulate change id after invoke create
    if (!model.id) {
      model.id = new_model.id
      model.set(model.idAttribute, new_model.id);
    }
    
    //@jandersonfc
    if (this.name == 'item'){
      this.updateList(model);
    }

    //@jandersonfc dispatch sync in case of success
    model.trigger('sync', model)
    //

    return model.toJSON();
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    //@jandersonfc
    if (this.name == 'item'){
      this.updateList(model);
    }

    //@jandersonfc refesh in records
    var store = this.localStorage().getItem(this.name);
    this.records = (store && store.split(",")) || [];

    this.localStorage().setItem(this.name+"-"+model.id, JSON.stringify(model));
    if (!_.include(this.records, model.id.toString())) this.records.push(model.id.toString()); this.save();
    
    //@jandersonfc dispatch sync in case of success
    model.trigger('sync', model)
    //

    return model.toJSON();
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return JSON.parse(this.localStorage().getItem(this.name+"-"+model.id));
  },

  // Return the array of all models currently in storage.
  findAll: function(options) {

    //@jandersonfc refesh in records to catch new registers in localstorage
    var store = this.localStorage().getItem(this.name);
    this.records = (store && store.split(",")) || [];


    return _(this.records).chain()
        .map(function(id){ 
          var result = JSON.parse(this.localStorage().getItem(this.name+"-"+id));

          //@jandersonfc implement custom filter, simulate filter here.
          if ((this.name == 'item') && (options.data.list)){
            if (result.list.id == options.data.list){
              return result;
            }
          }else {
            return result;  
          }
        }, this)
        .compact()
        .value();
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    this.localStorage().removeItem(this.name+"-"+model.id);
    this.records = _.reject(this.records, function(record_id){return record_id == model.id.toString();});
    this.save();
    
    //@jandersonfc dispatch sync in case of success
    model.trigger('sync', model)
    //

    return model;
  },

  localStorage: function() {
      return localStorage;
  },

  clearAllDatas: function() {
      this.records = [];
      this.localStorage().clear();
      console.log(this.records)
  }

});

// localSync delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprectated, use Backbone.LocalStorage.sync instead
Backbone.LocalStorage.sync = window.Store.sync = Backbone.localSync = function(method, model, options, error) {
  var store = model.localStorage || model.collection.localStorage;

  // Backwards compatibility with Backbone <= 0.3.3
  if (typeof options == 'function') {
    options = {
      success: options,
      error: error
    };
  }

  var resp;

  switch (method) {
    case "read":
        resp = model.id != undefined ? store.find(model) : store.findAll(options);
        if(resp && resp.length >= 1 && (model instanceof Backbone.Model) ){
            resp = resp[0];
        }
        break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};

Backbone.ajaxSync = Backbone.sync;

Backbone.getSyncMethod = function(model) {
    if(model.localStorage || (model.collection && model.collection.localStorage))
    {
        return Backbone.localSync;
    }

    return Backbone.ajaxSync;
};

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.sync = function(method, model, options, error) {
    return Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
};

})();