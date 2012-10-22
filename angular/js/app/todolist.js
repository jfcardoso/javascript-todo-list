angular.module('todolist', []).
	config(function($routeProvider) {
		$routeProvider.
		when('/', {controller:ListCtrl, templateUrl:'list.html'}).
		when('/lists/new', {controller:ListCtrl, templateUrl:'new.html'}).
		when('/lists/:listId', {controller:TodoCtrl, templateUrl:'todo.html'}).
		otherwise({redirectTo:'/'}
	);
});

var lists = [
		{id:1, name:'Learn AngularJS', items:[]},
		{id:2, name:'Learn Django', items:[]}];

function ListCtrl($scope,$location) {
	$scope.lists = lists;
	
	$scope.save = function() {
		var new_id = $scope.lists.length+1;
		lists.push(
			{id:new_id, name:$scope.name, items:[]}
		);
		$location.path('/lists/'+new_id);
	}

}

function TodoCtrl($scope, $location, $routeParams) {
	$scope.list = {};

	$scope.state_add_new_item = false;

	for (i=0;i<lists.length;i++){
		if (lists[i].id == $routeParams.listId){
			$scope.list = lists[i];
			if ($scope.list.items.length == 0){
				$scope.state_add_new_item = true;
			}
			break;
		}
	}
	
	$scope.state_open = function() {
		$scope.state_add_new_item = true;	
	}

	$scope.state_close = function() {
		$scope.state_add_new_item = false;
		$scope.nameItem = ''
	}

	$scope.add_item  = function() {
		var new_id = $scope.list.items.length+1;
		$scope.list.items.push(
			{id:new_id, name:$scope.nameItem, done:false}
		);

		$scope.state_add_new_item = false;
		$scope.nameItem = ''
	}

}
