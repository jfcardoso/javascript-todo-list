function TodoCtrl($scope, $location, $routeParams,ItemService,ListService) {
	$scope.list = ListService.get($routeParams.listId);
	
	$scope.state_add_new_item = false;
	
	$scope.items = ItemService.list($scope.list.id)
	
	if ($scope.items.length == 0){
		$scope.state_add_new_item = true;
	}
	
	$scope.state_open = function() {
		$scope.state_add_new_item = true;	
	}

	$scope.state_close = function() {
		$scope.state_add_new_item = false;
		$scope.nameItem = ''
	}

	$scope.close_item  = function(item) {
		item.done = true;
		//set list actual, necessary in mock, adjusts after
		if (typeof ListService.mock != 'undefined' && ListService.mock == true){
			$scope.list.open_items--;
			ListService.save($scope.list,function(list){
				$scope.list = list;
			})
		}
		ItemService.save(item,function(item) {
			$scope.items = ItemService.list($scope.list.id)
	    })
	}

	$scope.open_item  = function(item) {
		item.done = false;
		//set list actual, necessary in mock, adjusts after
		if (typeof ListService.mock != 'undefined' && ListService.mock == true){
			$scope.list.open_items++;
			ListService.save($scope.list,function(list){
				$scope.list = list;
			})
		}
		ItemService.save(item,function(item) {
			$scope.items = ItemService.list($scope.list.id)
	    })
	}

	$scope.add_item  = function() {
		//set list actual, necessary in mock, adjusts after
		if (typeof ListService.mock != 'undefined' && ListService.mock == true){
			$scope.list.open_items++;
			ListService.save($scope.list,function(list){
				$scope.list = list;
			})
		}
		
		$scope.item.list = $scope.list

		ItemService.save($scope.item,function(item) {
			$scope.state_add_new_item = false;
			$scope.nameItem = ''
			$scope.items = ItemService.list($scope.list.id)
	    })
	}

}