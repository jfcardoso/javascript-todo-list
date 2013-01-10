define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/list/list.html'
], function($, _, Backbone, template){

    var ListView = Backbone.View.extend({

        template:_.template(template),
        
        initialize:function () {
            this.model.bind("reset", this.render, this);
        },

        render:function (eventName) {
            $(this.el).html(this.template());
            return this;
        },

        populateData:function () {
            this.model.fetch();
        },

        close:function () {
            $(this.el).unbind();
            $(this.el).empty();
        }

    });

    return ListView;

});