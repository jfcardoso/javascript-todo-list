App.List = Ember.Object.extend({
  id: null,
  name: '',
  open_items: 0,
});

App.Item = Ember.Object.extend({
  id: null,
  name: '',
  done: false,
  list: null
});