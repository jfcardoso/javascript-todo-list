function ItemCtrl($scope, $location, $routeParams,ItemService,ListService) {
	
	ListService.get({id:$routeParams.listId},function(list){
		$scope.list = list;

		$scope.state_add_new_item = false;

		ItemService.query({list:$scope.list.id},function(items){
			$scope.items = items;

			if ($scope.items.length == 0){
				$scope.state_add_new_item = true;
			}
		})
	})
	
	$scope.state_open = function() {
		$scope.state_add_new_item = true;	
	}

	$scope.state_close = function() {
		$scope.state_add_new_item = false;
		$scope.item.name = ''
	}

	$scope.close_item  = function(item) {
		item.done = true;
		
		//set list actual, necessary in mock(adjusts after)
		if (typeof ListService.mock != 'undefined' && ListService.mock == true){
			$scope.list.open_items--;
			ListService.save($scope.list,function(list){
				$scope.list = list;
			})
		}

		ItemService.save(item,function(updated_item) {
			ItemService.query({list:$scope.list.id},function(items){
				$scope.items = items;
			})
	    })
	}

	$scope.open_item  = function(item) {
		item.done = false;
		
		//set list actual, necessary in mock(adjusts after)
		if (typeof ListService.mock != 'undefined' && ListService.mock == true){
			$scope.list.open_items++;
			ListService.save($scope.list,function(list){
				$scope.list = list;
			})
		}

		ItemService.save(item,function(updated_item) {
			ItemService.query({list:$scope.list.id},function(items){
				$scope.items = items;
			})
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
		
		$scope.item.list = $scope.list;

		ItemService.save($scope.item,function(item) {
			ItemService.query({list:$scope.list.id},function(items){
				$scope.items = items;
				$scope.item.name = '';
				$scope.state_add_new_item = false;
				
			})
	    })
	}

}