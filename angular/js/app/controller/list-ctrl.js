function ListCtrl($scope,$location,ListService) {
	
	$scope.lists = ListService.list();
	
	$scope.new = function() {
		console.log($scope.list)
		ListService.save($scope.list,function(list) {
			$location.path('/lists/'+list.id+'/items');
	    })
	}
}