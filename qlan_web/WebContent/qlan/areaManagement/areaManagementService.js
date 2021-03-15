angular.module('MetronicApp').factory(
		'areaManagementService',
		[
				'$http',
				'$q',
				'RestEndpoint',
				'Restangular',
				'$kWindow',
				function($http, $q, RestEndpoint, Restangular, $kWindow) {
					var serviceUrl = RestEndpoint.AREA_URL;
					var factory = {
						createAreaManagement : createAreaManagement,
						remove : remove,
						updateAreaManagement : updateAreaManagement,
						doSearch : doSearch,
						doSearchChildren: doSearchChildren,
						getTree: getTree,
						getAreaById:getAreaById
					};

					return factory;

					function createAreaManagement(obj) { 
						return Restangular.all(serviceUrl + "/addArea").post(obj);
					}
					function remove(obj) {
						return Restangular.all(serviceUrl + "/remove").post(obj);
					}

					function updateAreaManagement(obj) {
						return Restangular.all(serviceUrl + "/updateArea").post(obj);
					}

					function doSearch(obj) {
						return Restangular.all(serviceUrl + "/doSearch").post(obj);
					}
					function doSearchChildren(obj) {
						return Restangular.all("areaServiceRest/doSearchChildren").post(obj);
					}
					function getTree() {
						return Restangular.all(serviceUrl + "/getTree").post();
					}
					
					function getAreaById(id) {
						return Restangular.all(serviceUrl + "/getAreaById").post(id);
					}
				
				} ]);
