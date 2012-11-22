angular.module('module-list',[])
  .factory('ListProvider',function(){
    var lists = [
      {
        id:1,
        name:'Learn AngularJS',
        open_items: 1
      },
      {
        id:2,
        name:'Learn Django',
        open_items: 1
      }
    ];

    var listProvider=function(){};
    
    listProvider.prototype.mock = true;

    listProvider.prototype.get = function(params, cb) {
      for (i=0;i<lists.length;i++){
        if (lists[i].id == params.id){
          return cb(lists[i]);
        }
      }

    };

    listProvider.prototype.query = function(params,cb) {
      return cb(lists);
    };

    listProvider.prototype.save = function(list,cb) {
      if (list.id){
        this.get({id:list.id},function(oldList){
          oldList.name = list.name;
          oldList.open_items = list.open_items;
          return cb(oldList);
        });
      }else{
        var new_id = lists.length+1;
        var new_list = {
          id: new_id,
          name: list.name,
          open_items: 0
        };
        lists.push(new_list);
        return cb(new_list);
      }
    };

    listProvider.prototype.remove = function(id,cb) {
      for (i=0;i<lists.length;i++){
        if (lists[i].id == id){
          lists.splice(i,1);
          return cb();
        }
      }
    };

    var service = {
        getInstance:function(){ return new listProvider(); }
    };

    return service;
  })
  .service('ListService', ['ListProvider',function(ListProvider){
      return ListProvider.getInstance();
  }]);