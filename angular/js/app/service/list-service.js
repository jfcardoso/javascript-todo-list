// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('module-list', ['ngResource'])	
    .factory('ListService', function($resource) {
         var List = $resource(
            'http://localhost:8000/api/v1/lists',
            {
                '8000': ':8000'
            }
        )
         
        return Item;
    })