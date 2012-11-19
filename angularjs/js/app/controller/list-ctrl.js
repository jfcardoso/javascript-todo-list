function ListCtrl($scope,$location,ListService) {
	
	ListService.query({}, function(lists) {
		$scope.lists = lists;
	})
	
}

function ListNewCtrl($scope,$location,ListService) {

	$scope.new = function() {
		ListService.save($scope.list,function(list) {
			$location.path('/lists/'+list.id+'/items');
	    })
	}

}