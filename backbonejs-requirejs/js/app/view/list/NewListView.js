define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/list/new.html'
], function($, _, Backbone, template){

    var NewListView = Backbone.View.extend({
        template:_.template(template),

        initialize:function () {
            this.model.bind("change:id", this.navigateHome ,this);
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
            this.model.save();
            return false;
        },

        navigateHome: function (list){
            Backbone.history.navigate('/',true);
        }

    });

    return NewListView;

});