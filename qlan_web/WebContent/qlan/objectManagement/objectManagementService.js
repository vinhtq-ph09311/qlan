angular.module('MetronicApp').factory(
		'objectManagementService',
		[
				'$http',
				'$q',
				'RestEndpoint',
				'Restangular',
				'$kWindow',
				function($http, $q, RestEndpoint, Restangular, $kWindow) {
					var serviceUrl = RestEndpoint.OBJECTS_URL;
					var factory = {
						createobjectManagement : createobjectManagement,
						remove : remove,
						updateobjectManagement : updateobjectManagement,
						doSearch : doSearch,
						getParent : getParent,
						lock: lock,
						unlock:unlock,
						resetPass:resetPass,
						getListRoleByUserId:getListRoleByUserId,
						insertUserRoleData:insertUserRoleData,
					};

					return factory;

					function createobjectManagement(obj) {
						return Restangular.all(serviceUrl + "/object/add").post(obj);
					}
					function remove(obj) {
						return Restangular.all(serviceUrl + "/object/remove").post(obj);
					}

					function updateobjectManagement(obj) {
						return Restangular.all(serviceUrl + "/object/update").post(obj);
					}

					function doSearch(obj) {
						return Restangular.all(serviceUrl + "/object/getListObjects").post(obj);
					}
					function getParent() {
						return Restangular.all(serviceUrl + "/object/getParent").post();
					}
					function lock(obj) {
						return Restangular.all(serviceUrl + "/object/lock").post(obj);
					}
					function unlock(obj) {
						return Restangular.all(serviceUrl + "/object/unlock").post(obj);
					}
					function resetPass(obj) {
						return Restangular.all(serviceUrl + "/users/resetPass").post(obj);
					}
					
					function getListRoleByUserId(id) {
						return Restangular.all(serviceUrl + "/users/getListRoleByUserId").post(id);
					}
					
					function insertUserRoleData(obj) {
						return Restangular.all(serviceUrl + "/users/insertUserRoleData").post(obj);
					}
				} ]);
