
// Router
var AppRouter = Backbone.Router.extend({
    
    routes:{
        "":"list",
        "lists/new":"newList",
        "lists/:listId/items":"todo",
    },

    list:function () {
        if(app.listView) app.listView.close();
        this.listCollection = new ListCollection();
        this.listView = new ListView({model: this.listCollection});
        $('#content').html(this.listView.render().el);
        this.listCollection.fetch();
    },

    newList:function () {
        this.newListView = new NewListView({model: new List()});
        $('#content').html(this.newListView.render().el);
    },

    todo: function(listId){
        if (this.listCollection){
            this.list = this.listCollection.get(listId);
        } else {
            this.list = new List({id: listId});
            this.list.fetch();
        }

        this.itemCollection = new ItemCollection();
        this.itemView = new ItemView({model: this.itemCollection},this.list);
        $('#content').html(this.itemView.render().el);

        this.itemCollection.fetch({data: { list: listId },processData:true});
    }
});

var app = new AppRouter();
Backbone.history.start();