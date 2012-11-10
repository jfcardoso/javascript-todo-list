// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('module-item', ['ngResource'])
    .factory('ItemService', function($resource) {
        var Item = $resource(
            'http://localhost:8000/api/v1/items/',
            {
                '8000': ':8000'
            },
            {
                update: {method:'PUT'}
            }
        )
         
        return Item;
    })