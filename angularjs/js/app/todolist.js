angular.module('todolist', ['module-list','module-item'])
	.config(function($routeProvider) {
		$routeProvider.
		when('/', {controller:ListCtrl, templateUrl:'list.html'}).
		when('/lists/new', {controller:ListNewCtrl, templateUrl:'new.html'}).
		when('/lists/:listId/items', {controller:ItemCtrl, templateUrl:'todo.html'}).
		otherwise({redirectTo:'/'}
	);
});
