angular.module('MetronicApp').factory(
		'deptManagementService',
		[
				'$http',
				'$q',
				'RestEndpoint',
				'Restangular',
				'$kWindow',
				function($http, $q, RestEndpoint, Restangular, $kWindow) {
					var serviceUrl = RestEndpoint.DEPT_URL;
					var factory = {
							createdeptManagement : createdeptManagement,
						remove : remove,
						updatedeptManagement : updatedeptManagement,
						doSearch : doSearch,
						doSearchChildren: doSearchChildren,
						getTree: getTree,
						getDeptById:getDeptById,
						getDeptByIdCheck: getDeptByIdCheck
					};

					return factory;

					function createdeptManagement(obj) { 
						return Restangular.all(serviceUrl + "/add").post(obj);
					}
					function remove(obj) {
						return Restangular.all(serviceUrl + "/remove").post(obj);
					}

					function updatedeptManagement(obj) {
						return Restangular.all(serviceUrl + "/update").post(obj);
					}

					function doSearch(obj) {
						return Restangular.all(serviceUrl + "/doSearch").post(obj);
					}
					function doSearchChildren(obj) {
						return Restangular.all(serviceUrl + "/doSearchChildren").post(obj);
					}
					function getTree() {
						return Restangular.all(serviceUrl + "/getTree").post();
					}
					
					function getDeptById(id) {
						return Restangular.all(serviceUrl + "/getDeptById").post(id);
					}
					function getDeptByIdCheck(id) {
						return Restangular.all(serviceUrl + "/getDeptByIdCheck").post(id);
					}
					
				
				} ]);
