// This is a module for cloud persistance in mongolab - https://mongolab.com
angular.module('module-list', ['ngResource'])	
    .factory('ListService', function($resource) {
        var List = $resource(
            'https://api.github.com/users/jandersonfc/events'
        )

        return List;
    })