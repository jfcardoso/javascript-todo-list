
window.listView = new ListView({model:listCollection});

// Router
var AppRouter = Backbone.Router.extend({
 
    routes:{
        "":"list",
        "lists/new":"newList"
    },
 
    list:function () {
        listCollection.fetch();
        $('#content').html(listView.render().el);
    },

    newList:function () {
        this.newListView = new NewListView({model: new List()});
        $('#content').html(this.newListView.render().el);
    },
});
 
var app = new AppRouter();
Backbone.history.start();