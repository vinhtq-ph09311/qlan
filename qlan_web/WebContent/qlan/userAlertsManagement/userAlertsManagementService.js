angular.module('MetronicApp').factory(
		'userAlertsManagementService',
		[
				'$http',
				'$q',
				'RestEndpoint',
				'Restangular',
				'$kWindow',
				function($http, $q, RestEndpoint, Restangular, $kWindow) {
					var serviceUrl = RestEndpoint.USERALERT_URL;
					var DeptUrl = RestEndpoint.DEPT_URL;
					var factory = {
							createUserAlertsManagement : createUserAlertsManagement,
						remove : remove,
						updateUserAlertsManagement : updateUserAlertsManagement,
						doSearch : doSearch,
						/*getParent : getParent,
						lock: lock,
						unlock:unlock,
						resetPass:resetPass,*/
						getListWarningLevel: getListWarningLevel,
						removeAll : removeAll,
						getDept: getDept,
					};

					return factory;

					function createUserAlertsManagement(obj) {
						return Restangular.all(serviceUrl + "/add").post(obj);
					}
					function remove(obj) {
						return Restangular.all(serviceUrl + "/remove").post(obj);
					}

					function updateUserAlertsManagement(obj) {
						return Restangular.all(serviceUrl + "/update").post(obj);
					}

					function doSearch(obj) {
						return Restangular.all(serviceUrl + "/doSearch").post(obj);
					}
					function getListWarningLevel() {
						return Restangular.all(serviceUrl + "/getListWLAutoSearch").post();
					}
					function removeAll(obj) {
						return Restangular.all(serviceUrl + "/removeAll").post(obj);
					}
					function getDept(obj){
						return Restangular.all(DeptUrl + "/getListDeptAutoSearch").post(obj);
					}
					
				} ]);
