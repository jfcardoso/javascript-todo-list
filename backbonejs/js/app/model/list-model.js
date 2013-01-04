window.List = Backbone.Model.extend({
     urlRoot:"http://localhost:8000/api/v1/lists"
});

window.ListCollection = Backbone.Collection.extend({
    model: List,
    url: 'http://localhost:8000/api/v1/lists'
});

window.listCollection = new ListCollection();