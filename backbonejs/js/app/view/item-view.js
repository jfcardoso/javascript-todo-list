window.TodoItemView = Backbone.View.extend({
    tagName: 'li',
    template:_.template($('#todo-item').html()),

    initialize:function () {
        this.model.bind("sync", this.navigateTodo, this);
    },

    events:{
        "click #update":"updateItem"
    },

    updateItem:function (eventName) {
        var list = {id: this.model.get('list').id}
        this.model.save({done: !this.model.get('done'), list: list});
    },

    navigateTodo:function (eventName) {
        
    },

    render:function (eventName) {
         $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});

window.ItemStateCloseView = Backbone.View.extend({
    template:_.template($('#new-item-close').html()),

    render:function (eventName) {
         $(this.el).html(this.template());
        return this;
    }
});

window.ItemStateOpenView = Backbone.View.extend({
    template:_.template($('#new-item-open').html()),

    render:function (eventName) {
         $(this.el).html(this.template());
        return this;
    }
});

window.ItemView = Backbone.View.extend({
    model: new ItemCollection(),

    template:_.template($('#todo').html()),
    
    initialize: function(models, list) {
        this.list = list;
        this.list.bind("change:id", this.render, this);
        this.model.bind("reset", this.onItems, this);
        this.model.bind("change", this.onItems, this);
    },

    events:{
        "submit #form-item":"createItem",
        "click .open-new-state-item":"openState",
        "click .close-new-state-item":"closeState"
    },

    createItem: function(){
        var item = new Item({
            name:$('#name').val(),
            list:{id: this.list.get('id')}
        });
        this.model.create(item);
        return false;
    },

    openState: function(){
        this.$('#content-new-item').html(new ItemStateOpenView({model:new Item()}).render().el);
    },

    closeState: function(){
        this.$('#content-new-item').html(new ItemStateCloseView().render().el);
    },

    onItems: function(){
        this.$('#items-opened').empty()
        this.$('#items-closed').empty()
        //items opened
        var itemsOpened = _.filter(this.model.models,function (item) {
            return item.get('done') == false;
        });
        _.each(itemsOpened, function (item) {
            this.$('#items-opened').append(new TodoItemView({model:item}).render().el);
        }, this);

        //state open/close new item
        if (itemsOpened.length > 0){
            this.closeState();
        } else {
            this.openState();
        }

        //items closed
        var itemsClosed = _.filter(this.model.models,function (item) {
            return item.get('done') == true;
        });
        _.each(itemsClosed, function (item) {
            this.$('#items-closed').append(new TodoItemView({model:item}).render().el);
        }, this);
    },

    render:function (eventName) {
        $(this.el).html(this.template({list: this.list.toJSON()}));
        return this;

    },

});