var get = Ember.get, set = Ember.set;

var hasAssociation = function(type, options, one) {
  options = options || {};

  var meta = { type: type, isAssociation: true, options: options, kind: 'belongsTo' };

  return Ember.computed(function(key, value) {
    
    if (arguments.length === 2) {
      return value === undefined ? null : value;
    }

    var data = get(this, 'data').belongsTo,
        store = get(this, 'store'), id;

    if (typeof type === 'string') {
      type = get(this, type, false) || get(window, type);
    }

    id = data[key];
    
    if (typeof id === 'object') {
      return id
    }

    return id ? store.find(type, id) : null;
  }).property('data').meta(meta);
};

DS.belongsTo = function(type, options) {
  Ember.assert("The type passed to DS.belongsTo must be defined", !!type);
  return hasAssociation(type, options);
};

DS.RESTSerializerFC = DS.Serializer.create({
  keyForBelongsTo: function(type, name) {
    return this.keyForAttributeName(type, name)	;
  },

  keyForAttributeName: function(type, name) {
    return Ember.String.decamelize(name);
  },

  addBelongsTo: function(hash, record, key, relationship) {
    var id = record.get(relationship.key+'.id');
    
    if (!Ember.none(id)) { hash[relationship.key] = {id:id} }
  },
});

DS.RESTAdapterFC = DS.Adapter.extend({
  bulkCommit: false,

  serializer: DS.RESTSerializerFC,

  shouldCommit: function(record) {
    if (record.isCommittingBecause('attribute') || record.isCommittingBecause('belongsTo')) {
      return true;
    }
  },

  createRecord: function(store, type, record) {
    var root = this.rootForType(type);

    var data = {};
    data = this.toJSON(record, { includeId: true });
    
    this.ajax(this.buildURL(root), "POST", {
      data: data,
      context: this,
      success: function(json) {
        this.didCreateRecord(store, type, record, json);
      }
    });
  },

  didSaveRecord: function(store, record, hash) {
    record.eachAssociation(function(name, meta) {
      if (meta.kind === 'belongsTo') {
        store.didUpdateRelationship(record, name);
      }
    });

    store.didSaveRecord(record, hash);
  },

  didSaveRecords: function(store, records, array) {
    var i = 0;

    records.forEach(function(record) {
      this.didSaveRecord(store, record, array && array[i++]);
    }, this);
  },

  didCreateRecord: function(store, type, record, json) {
    this.didSaveRecord(store, record, json);
  },

  createRecords: function(store, type, records) {
    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    var root = this.rootForType(type),
        plural = this.pluralize(root);

    var data = {};
    data[root] = [];
    records.forEach(function(record) {
      data[root].push(this.toJSON(record));
    }, this);
    this.ajax(this.buildURL(root), "POST", {
      data: data,
      context: this,
      success: function(json) {
        this.didCreateRecords(store, type, records, json);
      }
    });
  },

  didCreateRecords: function(store, type, records, json) {
    this.didSaveRecords(store, records, json);
  },

  updateRecord: function(store, type, record) {
    var id = get(record, 'id');
    var root = this.rootForType(type);

    var data = {};
    data = this.toJSON(record,{includeId:true});
    
    this.ajax(this.buildURL(root, id), "PUT", {
      data: data,
      context: this,
      success: function(json) {
        this.didUpdateRecord(store, type, record, json);
      }
    });
  },

  didUpdateRecord: function(store, type, record, json) {    
    this.didSaveRecord(store, record, json);
  },

  updateRecords: function(store, type, records) {
    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    var root = this.rootForType(type),
        plural = this.pluralize(root);

    var data = {};
    data[plural] = [];
    records.forEach(function(record) {
      data[plural].push(record.toJSON());
    }, this);

    this.ajax(this.buildURL(root, "bulk"), "PUT", {
      data: data,
      context: this,
      success: function(json) {
        this.didUpdateRecords(store, type, records, json);
      }
    });
  },

  didUpdateRecords: function(store, type, records, json) {
    this.didSaveRecords(store, records, json);
  },

  deleteRecord: function(store, type, record) {
    var id = get(record, 'id');
    var root = this.rootForType(type);

    this.ajax(this.buildURL(root, id), "DELETE", {
      context: this,
      success: function(json) {
        this.didDeleteRecord(store, type, record, json);
      }
    });
  },

  didDeleteRecord: function(store, type, record, json) {
    this.didSaveRecord(store, record);
  },

  deleteRecords: function(store, type, records) {
    if (get(this, 'bulkCommit') === false) {
      return this._super(store, type, records);
    }

    var root = this.rootForType(type),
        plural = this.pluralize(root);

    var data = {};
    data[plural] = [];
    records.forEach(function(record) {
      data[plural].push(get(record, 'id'));
    });

    this.ajax(this.buildURL(root, 'bulk'), "DELETE", {
      data: data,
      context: this,
      success: function(json) {
        this.didDeleteRecords(store, type, records, json);
      }
    });
  },

  didDeleteRecords: function(store, type, records, json) {
    this.didSaveRecords(store, records);
  },

  find: function(store, type, id) {
    var root = this.rootForType(type);
  	  
    this.ajax(this.buildURL(root, id), "GET", {
      success: function(json) {
        this.didFindRecord(store, type, json, id);
      }
    });
  },

  didFindRecord: function(store, type, json, id) {
    store.load(type, id, json);
  },

  findAll: function(store, type, since) {
    var root = this.rootForType(type);
    
    this.ajax(this.buildURL(root), "GET", {
      data: this.sinceQuery(since),
      success: function(json) {
        this.didFindAll(store, type, json);
      }
    });
  },

  didFindAll: function(store, type, json) {
    var since = this.extractSince(json);

    
    store.loadMany(type, json);

    // this registers the id with the store, so it will be passed
    // into the next call to `findAll`
    if (since) { store.sinceForType(type, since); }

    store.didUpdateAll(type);
  },

  findQuery: function(store, type, query, recordArray) {
    var root = this.rootForType(type);
    
    this.ajax(this.buildURL(root), "GET", {
      data: query,
      success: function(json) {
        this.didFindQuery(store, type, json, recordArray);
      }
    });
  },

  didFindQuery: function(store, type, json, recordArray) {
    recordArray.load(json);
  },

  findMany: function(store, type, ids) {
    var root = this.rootForType(type);
    ids = get(this, 'serializer').serializeIds(ids);
    
    this.ajax(this.buildURL(root), "GET", {
      data: {ids: ids},
      success: function(json) {
        this.didFindMany(store, type, json);
      }
    });
  },

  didFindMany: function(store, type, json) {
    store.loadMany(type, json);
  },

  // HELPERS

  plurals: {},

  // define a plurals hash in your subclass to define
  // special-case pluralization
  pluralize: function(name) {
    return this.plurals[name] || name + "s";
  },

  rootForType: function(type) {
    if (type.url) { return type.url; }

    // use the last part of the name as the URL
    var parts = type.toString().split(".");
    var name = parts[parts.length - 1];
    return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
  },

  ajax: function(url, type, hash) {
    hash.url = url;
    hash.type = type;
    hash.dataType = 'json';
    hash.contentType = 'application/json; charset=utf-8';
    hash.context = this;
    if (hash.data && type !== 'GET') {
      hash.data = JSON.stringify(hash.data);
    }
    
    jQuery.ajax(hash);
  },

  loadValue: function(store, type, value) {
    if (value instanceof Array) {
      store.loadMany(type, value);
    } else {
      store.load(type, value);
    }
  },

  url: "",

  buildURL: function(record, suffix) {
    var url = [this.url];

    Ember.assert("Namespace URL (" + this.namespace + ") must not start with slash", !this.namespace || this.namespace.toString().charAt(0) !== "/");
    Ember.assert("Record URL (" + record + ") must not start with slash", !record || record.toString().charAt(0) !== "/");
    Ember.assert("URL suffix (" + suffix + ") must not start with slash", !suffix || suffix.toString().charAt(0) !== "/");

    if (this.namespace !== undefined) {
      url.push(this.namespace);
    }

    url.push(this.pluralize(record));
    if (suffix !== undefined) {
      url.push(suffix);
    }

    return url.join("/");
  },

  meta: 'meta',
  since: 'since',

  sinceQuery: function(since) {
    var query = {};
    query[get(this, 'since')] = since;
    return since ? query : null;
  },

  extractSince: function(json) {
    var meta = this.extractMeta(json);
    return meta[get(this, 'since')] || null;
  },

  extractMeta: function(json) {
    return json[get(this, 'meta')] || {};
  }
});

App.store = DS.Store.create({
	revision: 7,
	adapter: DS.RESTAdapterFC.create({url: 'http://localhost:8000', namespace: 'api/v1'}),
});