window.ListView = Backbone.View.extend({

    template:_.template($('#list').html()),
    
    initialize:function () {
        this.model.bind("reset", this.render, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

});

window.NewListView = Backbone.View.extend({

    template:_.template($('#new-list').html()),

    initialize:function () {
        this.model.bind("sync", this.navigateHome ,this);
    },

    render:function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events:{
        "submit #form-list":"createList"
    },

    createList:function () {
        this.model.set({
            name:$('#name').val()
        });
        listCollection.create(this.model);
        return false;
    },

    navigateHome: function (list){
        app.navigate('/',true);
    }

});