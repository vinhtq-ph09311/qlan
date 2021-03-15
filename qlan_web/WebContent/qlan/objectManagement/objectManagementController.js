(function() {
	'use strict';
	var controllerId = 'objectManagementController';
	
	angular.module('MetronicApp').controller(controllerId, objectManagementController);
	
	function objectManagementController($scope, $rootScope, $timeout, gettextCatalog, 
			kendoConfig, $kWindow,objectManagementService,
			CommonService, PopupConst, Restangular, RestEndpoint,Constant) {
		var vm = this;
		vm.showSearch = true;
		vm.isCreateNew = false;
        vm.showDetail = false;
        vm.options =[0];
		vm.removeItem=removeItem;
        vm.objectManagementSearch={
      		status: null,
// // objectTypeId: 2,
      		objectId:null
        };
        vm.objectManagementCreate={
        		status: 2,
        		objectTypeId: 2
        };
		vm.objectManagement={};
		vm.validatorOptions = kendoConfig.get('validatorOptions');
		var data = [];
		
		objectManagementService.getParent().then(function(result){
				for(var i= 0; i< result.length; i++){
					data.push({
							parentId: result[i].parentId,
							parentName: result[i].parentName
						});
					
				
				}
				console.log(data)
		vm.parent = data;
		vm.parentSelectOptions = {
                dataSource: vm.parent,
                dataTextField: "parentName",
                dataValueField: "parentId",
                optionLabel: "---Chọn---",
                valuePrimitive: true
            }

			});
		initFormData();
		function initFormData() {
			fillDataTable([]);
		}
		
		$scope.$watch('vm.objectManagementCreate.checkIp', function() {
			if(vm.objectManagementCreate.checkIp==1){
				$("#create_ip_lb").addClass("req");
				$("#create_ip").attr("required",true);
			} else {
				$("#create_ip_lb").removeClass("req");
				$("#create_ip").removeAttr("required");
			}
  	       
  	    });
		 vm.commonSearch={name: '', code: ''};
            
            vm.headerTemplate='<div class="dropdown-header row text-center k-widget k-header">' +
'<p class="col-md-6 text-header-auto border-right-ccc">Mã</p>' +
'<p class="col-md-6 text-header-auto border-right-ccc">Tên</p>' +
	'</div>';
            vm.template='<div class="row"><div class="col-xs-5" style="padding: 0px 32px 0 0,float:left">#: data.deptCode #</div>' +
'<div style="padding-left: 10px,width:auto;overflow:hidden;text-align: right;">#: data.deptName #</div></div>';
		vm.status = [
	                {id:0,name:'Không hoạt động'},
	                {id:1,name:'Hoạt động'}
	            ];
		vm.statusSelectOptions = {
                dataSource: vm.status,
                dataTextField: "name",
                dataValueField: "id",
                optionLabel: "---Chọn---",
                valuePrimitive: true
            }

		vm.objectType= [
			{id: 0, name: 'Module'},
			{id: 1, name: 'Component'}
		]
		
		vm.objectTypeSelectOptions = {
			dataSource: vm.objectType,
			dataTextField: "name",
			dataValueField: "id",
			optionLabel: "---Chọn---",
            valuePrimitive: true
		}


		
		vm.genderData = [
	                {id:0,name:'Nam'},
	                {id:1,name:'Nữ'},
					{id:3,name:'Khác'},
	            ];
		vm.genderSelectOptions = {
                dataSource: vm.genderData,
                dataTextField: "name",
                dataValueField: "id",
                optionLabel: "---Chọn---",
                valuePrimitive: true
            }
		vm.checkIpData = [
	                {id:0,name:'Không'},
	                {id:1,name:'Có'},
					
	            ];
		vm.checkIpSelectOptions = {
                dataSource: vm.checkIpData,
                dataTextField: "name",
                dataValueField: "id",
                optionLabel: "---Chọn---",
                valuePrimitive: true
            }
		 vm.optDept={
         		dataTextField: "deptName",
         		dataValueField: "deptId",
                  valuePrimitive: true,
                  optionLabel: "---Chọn---",
                  dataSource:{
				        serverFiltering: true,
				        transport: {
				            read: {
								type: "POST",
								url: RestEndpoint.BASE_SERVICE_URL + "commonServiceRest/getDept",
								contentType: "application/json; charset=utf-8",
								dataType: "json"
				            },
							parameterMap: function(options, operation) {
								return JSON.stringify({});
							}
				        }
				    },	
         }
		 
		 vm.optDeptCreate={
         		dataTextField: "deptName",
         		dataValueField: "deptId",
                  valuePrimitive: true,
                  optionLabel: "---Chọn---",
                  dataSource:{
				        serverFiltering: true,
				        transport: {
				            read: {
								type: "POST",
								url: RestEndpoint.BASE_SERVICE_URL + "commonServiceRest/getDept",
								contentType: "application/json; charset=utf-8",
								dataType: "json"
				            },
							parameterMap: function(options, operation) {
								return JSON.stringify({});
							}
				        }
				    },	
         }
		
		vm.doSearch= doSearch;
		function doSearch(){
			  vm.showDetail = false;
			var grid =vm.objectManagementGrid;	
			if(grid){
				grid.dataSource.query({
					page: 1,
					pageSize: 10
				});
			}
		}
		
		
		function refreshGrid(d) {
			var grid = vm.objectManagementFileGrid;
			if(grid){
				grid.dataSource.data(d);
				grid.refresh();
			}
		}
		
		function fillDataTable(data) {
			vm.gridOptions = kendoConfig.getGridOptions({
				autoBind: true,
				sortable: false,
				resizable: true,
				columnMenu: false,
				toolbar: [
                    {
                    	name: "actions",
                        template: '<div class=" pull-left ">'+
                        '<a class="btn btn-qlk padding-search-right addQLK"'+
    					'ng-click="vm.add()" uib-tooltip="Thêm mới" translate><p class="action-button add" aria-hidden="true">Tạo mới</p></a>'+
    					'</div>'	
        				+'<div class=" pull-left ">'+
                        '<a class="btn btn-qlk padding-search-right lockQLAN"'+
    					'ng-click="vm.lock()" uib-tooltip="Khóa" translate><p class="action-button lock" aria-hidden="true">Khóa</p></a>'+
    					'</div>'	
        				+'<div class=" pull-left ">'+
                        '<a class="btn btn-qlk padding-search-right unlockQLAN"'+
    					'ng-click="vm.unlock()" uib-tooltip="Mở khóa" translate><p class="action-button unlock" aria-hidden="true">Mở khóa</p></a>'+
    					'</div>'	
        				+
                      	  '<div class="btn-group pull-right margin_top_button margin_right10">'+
                    '<i data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog" aria-hidden="true"></i></i>'+
                    '<div class="dropdown-menu hold-on-click dropdown-checkboxes" role="menu">'+
                    '<label ng-repeat="column in vm.objectManagementGrid.columns| filter: vm.gridColumnShowHideFilter">'+
                    '<input type="checkbox" checked="column.hidden" ng-click="vm.showHideColumn(column)"> {{column.title}}'+
                    '</label>'+
                    '</div></div>'
                    
                    }
                    ],
				dataBound: function (e) {
				},
				dataSource:{
					serverPaging: true,
					 schema: {
						 total: function (response) {
							 	vm.count = response.total;
								return response.total;
							},
							data: function (response) {
								return response.data;
							},
		                },
					transport: {
						read: {
		                        // Thuc hien viec goi service
							 url: Constant.BASE_SERVICE_URL + "objectsService/object/getListObjects",
							 contentType: "application/json; charset=utf-8",
							 type: "POST"
						},					
						parameterMap: function (options, type) {
								  vm.objectManagementSearch.page = options.page
								  vm.objectManagementSearch.pageSize = options.pageSize
								  return JSON.stringify(vm.objectManagementSearch)
						}
					},					 
					pageSize: 10
				},
				noRecords: true,
				messages: {
					noRecords : gettextCatalog.getString("Không có kết quả hiển thị")
				},
				pageable: {
					refresh: false,
					 pageSizes: [10, 15, 20, 25],
					messages: {
		                display: "{0}-{1} của {2} kết quả",
		                itemsPerPage: "kết quả/trang",
		                empty: "Không có kết quả hiển thị"
		            }
				},
				
				columns: [
					{   
				    	title: "<input type='checkbox' name='gridchkselectall' ng-click='vm.chkSelectAll($event);' ng-model='vm.chkAll' /> &nbsp; <strong>All</strong>",
				        template: "<input type='checkbox' name='gridcheckbox' ng-click='vm.onCheck($event)' />",
				        width: 35
				   }, {
					title: gettextCatalog.getString("STT"),
					field:"stt",
			        template: dataItem =>vm.objectManagementGrid.dataSource.indexOf(dataItem) + 1+
                    (vm.objectManagementGrid.dataSource._page -1 ) *vm.objectManagementGrid.dataSource._pageSize ,
			        width: 40,
			        headerAttributes: {
						style: "text-align:center; font-weight:Bold;",
					},
					attributes: {
						style: "text-align:center;"
					},
				}
				, {
					title: "Mã chức năng",
					field: 'objectCode',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: "Tên chức năng",
					field: 'objectName',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},{
					title: "Chức năng cha",
					field: 'parentName',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: "Đường dẫn",
					field: 'objectUrl',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: "Loại chức năng",
					field: 'objectTypeId',
			        width: 120,
 					template :  
			        "# if(objectTypeId == 1){ #" + "#= 'Component' #" + "# } " +
			        "else if (objectTypeId 	 == 0) { # " + "#= 'Module' #"+ "#} " +
			        "#",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: gettextCatalog.getString("Thứ tự"),
					field:'ord',
			        width: 40,
			        headerAttributes: {
						style: "text-align:center; font-weight:Bold;",
					},
					attributes: {
						style: "text-align:center;"
					},
				},
					{
					title: "Mô tả",
					field: 'description',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				
				
				{
					title: "Trạng thái",
			        field: 'status',
			        width: 90,
			        template :  
			        "# if(status == 1){ #" + "#= 'Hoạt động' #" + "# } " +
			        "else if (status == 0) { # " + "#= 'Không hoạt động' #"+ "#} " +
			        "#",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
					
				},
				{
					
					title: "Thao tác",
			        template:dataItem =>
			        	'	<div class="text-center #=objectManagementId#"">'+
			        	'		<a  type="button" class="#=objectManagementId# icon_table" uib-tooltip="Cập nhật chức năng" translate> '+
			        	'			<i class="fa fa-pencil" ng-click=vm.edit(dataItem) aria-hidden="true"></i>'+
			        	'		</a> '+
			        	'			<a type="button" class="#=objectManagementId# icon_table" uib-tooltip="Khóa" translate >'+
			        	'			<i class="fa fa-lock" ng-click=vm.lock(dataItem) aria-hidden="true" style="color:orange;"></i>'+
			        	'		</a>'+
						'<a type="button" class="#=objectManagementId# icon_table" uib-tooltip="Mở khóa" translate >'+
			        	'			<i class="fa fa-unlock" ng-click=vm.unlock(dataItem) aria-hidden="true" style="color:black;"></i>'+
			        	'		</a>'+
						'<a type="button" class="#=objectManagementId# icon_table" uib-tooltip="Xóa" translate >'+
			        	'			<i class="fa fa-trash" ng-click=vm.remove(dataItem) aria-hidden="true" style="color:red;"></i>'+
			        	'		</a>'+
			        	'	</div>',
			        width: 120,
			        field:"actionss",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
				}]
			});
		}

		vm.add = function add(){
			
			vm.isCreateNew = true;
			vm.objectManagementCreate = {objectId:null};
			 var teamplateUrl="qlan/objectManagement/objectManagementPopup.html";
			 var title="Thêm mới chức năng";
			 var windowId="objectManagement";
			 
			 CommonService.populatePopupCreate(teamplateUrl,title,{},vm,windowId,true,'80%','60%'); 
			 
		 }
		
		vm.edit = function edit(dataItem){
				
				vm.isCreateNew = false;
				vm.objectManagementCreate =dataItem;
				
				var teamplateUrl="qlan/objectManagement/objectManagementPopup.html";
				var title="Cập nhật chức năng: "+vm.objectManagementCreate.objectName;
				var windowId="objectManagement"
				CommonService.populatePopupCreate(teamplateUrl,title,vm.objectManagementCreate,vm,windowId,false,'80%','60%');
		}
		
		
		
		vm.save= function save(isCreateNew){
			startLoading();
			console.log("12345678",vm.objectManagementCreate);
				if(vm.objectManagementCreate.objectId == null) {
					debugger
	            	objectManagementService.createobjectManagement(vm.objectManagementCreate).then(function(result){
	            		stopLoading();
	            			if(result.error){
	            				toastr.error(result.error);
	            				return;
	            			}
	            			toastr.success("Thêm mới thành công!");
	                        doSearch();
	                        CommonService.dismissPopup();
	            		}, function(errResponse){
	            			stopLoading();
			                if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
			                	toastr.error(gettextCatalog.getString("Lỗi xuất hiện khi tạo mới chức năng!2"));
			                }
	    		        });
	            	} else {
		
						console.log("12345678",vm.objectManagementCreate);
	            		objectManagementService.updateobjectManagement(vm.objectManagementCreate).then(function(result){
	            			stopLoading();
	            			if(result.error){
	            				toastr.error(result.error);
	            				return;
	            			}
	            			toastr.success("Cập nhật thành công!");
	            			doSearch();
	            			CommonService.dismissPopup();
	            		}, function(errResponse){
	            			stopLoading();
	            			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
			                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi cập nhật"));
			                }
	    		        });
	            	}
			
		}
	
		vm.remove = function remove(data)
		{
			vm.objectManagementCreate =data;
			confirm('Xác nhận xóa',function (d){
				startLoading();
			objectManagementService.remove(vm.objectManagementCreate).then(function(result){
				stopLoading();
				if(result.error){
					toastr.error(result.error)
					return ;
				}
    			toastr.success("Xóa chức năng thành công!");
    			var currentPage = vm.objectManagementGrid.dataSource.page();
    			var dataSize = vm.objectManagementGrid.dataSource.data().length;
    			if (currentPage > 1&&dataSize==1) {
    	        	vm.objectManagementGrid.dataSource.page(currentPage - 1);
				} else {
					vm.objectManagementGrid.dataSource.page(currentPage);
				}
    			
    		}, function(errResponse){
    			stopLoading();
    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi cập nhật trạng thái"));
                }
	        });
				});
		}
		/*vm.lock= function (data){
		var selectedRow = [];
		var grid = vm.objectManagementGrid;
		grid.table.find("tr").each(function(idx, item) {
		var row = $(item);
		var checkbox = $('[name="gridcheckbox"]', row);
			if (checkbox.is(':checked')){
				var dataItem = grid.dataItem(item);
				selectedRow.push(dataItem);
			}
		});*/
		vm.lock= function (){
			var selectedRow = [];
			var grid = vm.objectManagementGrid;
			grid.table.find("tr").each(function(idx, item) {
			var row = $(item);
			var checkbox = $('[name="gridcheckbox"]', row);
				if (checkbox.is(':checked')){
					var dataItem = grid.dataItem(item);
					selectedRow.push(dataItem);
				}
			});
		 if(selectedRow.length == 0 )
		{
		    toastr.warning("Bạn chưa chọn bản ghi !");
		} else{
			
			confirm('Xác nhận khóa',function (d){
				startLoading();
				objectManagementService.lock(selectedRow).then(function(result){
				stopLoading();
    			toastr.success("khóa chức năng thành công!");
    			$('#objectManagementGrid').data('kendoGrid').dataSource.read();
    			$('#objectManagementGrid').data('kendoGrid').refresh();
    		}, function(errResponse){
    			stopLoading();
    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			       } else{
                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi cập nhật trạng thái"));
                }
	        });
				});

		}
		/*else{
			
			confirm('Xác nhận khóa',function (d){
				var check = false;
				
					if (angular.equals(data.objectName,"Quản lý chức năng")) {
						toastr.error(gettextCatalog.getString("Không cho khóa chức năng Quản lý chức năng"));
						check = true;
					
				}
				if (check === true) {
					$('#objectManagementGrid').data('kendoGrid').dataSource.read();
	    			$('#objectManagementGrid').data('kendoGrid').refresh();
				}
				else{
					startLoading();
					objectManagementService.lock(data).then(function(result){
						stopLoading();
		    			toastr.success("khóa chức năng thành công!");
		    			$('#objectManagementGrid').data('kendoGrid').dataSource.read();
		    			$('#objectManagementGrid').data('kendoGrid').refresh();
		    		}, function(errResponse){
		    			stopLoading();
		    			if (errResponse) {
										console.log(errResponse)
					                	toastr.error(errResponse.data.errorMessage);
					       } else{
		                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi cập nhật trạng thái"));
		                }
			        });	
				}
				});

		}*/
		}
		
		/*vm.unlock=function(){
			var selectedRow = [];
		var grid = vm.objectManagementGrid;
		grid.table.find("tr").each(function(idx, item) {
		var row = $(item);
		var checkbox = $('[name="gridcheckbox"]', row);
			if (checkbox.is(':checked')){
				var dataItem = grid.dataItem(item);
				selectedRow.push(dataItem);
			}
		});*/
		vm.unlock=function(){
			var selectedRow = [];
		var grid = vm.objectManagementGrid;
		grid.table.find("tr").each(function(idx, item) {
		var row = $(item);
		var checkbox = $('[name="gridcheckbox"]', row);
			if (checkbox.is(':checked')){
				var dataItem = grid.dataItem(item);
				selectedRow.push(dataItem);
			}
		}); 
		if(selectedRow.length == 0 )
		{
		    toastr.warning("Bạn chưa chọn bản ghi !");
		} else{
				confirm('Xác nhận mở khóa',function (d){
					startLoading();
					objectManagementService.unlock(selectedRow).then(function(result){
					stopLoading();
	    			toastr.success("Mở khóa thành công!");
	    			$('#objectManagementGrid').data('kendoGrid').dataSource.read();
	    			$('#objectManagementGrid').data('kendoGrid').refresh();
	    		}, function(errResponse){
	    			stopLoading();
	    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
					} else {
	                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi cập nhật trạng thái"));
	                }
		        });
					});
		
		}
		/*else{
				confirm('Xác nhận mở khóa',function (d){
					startLoading();
				objectManagementService.unlock(data).then(function(result){
					stopLoading();
	    			toastr.success("Mở khóa thành công!");
	    			$('#objectManagementGrid').data('kendoGrid').dataSource.read();
	    			$('#objectManagementGrid').data('kendoGrid').refresh();
	    		}, function(errResponse){
	    			stopLoading();
	    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
					} else {
	                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi cập nhật trạng thái"));
	                }
		        });
					});
		
		}*/
		}
		
	/*	vm.resetPass=function(dataItem){
			confirm('Xác nhận reset password',function (d){
				startLoading();
				objectManagementService.resetPass(dataItem).then(function(result){
					stopLoading();
	    			toastr.success("Reset mật khẩu thành công!");
	    			prompt("Mật khẩu được reset thành: " +result.password);
					return;
	    		}, function(errResponse){
	    			stopLoading();
	    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
					} else {
	                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi cập nhật trạng thái"));
	                }
		        });
					});
		}*/
		
		vm.showHideColumn=function(column){
        	if (angular.isUndefined(column.hidden)) {
        		vm.objectManagementGrid.hideColumn(column);
            } else if (column.hidden) {
            	vm.objectManagementGrid.showColumn(column);
            } else {
            	vm.objectManagementGrid.hideColumn(column);
            }
        	
        	
        }
		
		vm.gridColumnShowHideFilter = function (item) { 
                return item.type==null||item.type !=1; 
            };
          // handleCheck
    		vm.onCheck = function(item){
    			if(document.getElementById("chkSelectAll").checked == true){
    				document.getElementById("chkSelectAll").checked = false;
    			}
    		}
    		vm.chkSelectAll = function(item) {
    	    	var grid = vm.objectManagementGrid;
    	    	chkSelectAllBase(vm.chkAll, grid);
    	    }
    		vm.removeAll = function(lock){
    			var selectedRow = [];
    			var grid = vm.objectManagementGrid;
    			grid.table.find("tr").each(function(idx, item) {
    			var row = $(item);
    			var checkbox = $('[name="gridcheckbox"]', row);
    				if (checkbox.is(':checked')){
    					var dataItem = grid.dataItem(item);
    					selectedRow.push(dataItem.objectId);
    				}
    			});
    			if(selectedRow.length == 0 )
    			{
    			    toastr.warning("Bạn chưa chọn bản ghi !");
    			} else{
    				confirm('Xác nhận xóa',function (d){
    				objectManagementService.removeAll(selectedRow).then(
    						function(d) {
    							toastr.success("Xóa bản ghi thành công!");
    							vm.doSearch();
    						}, function(errResponse) {
    							toastr.error("Lỗi Xóa!");
    						});	
    				});
    				}
    		}
		vm.record=0;	
		vm.actionPopup=actionPopup;
    		function actionPopup(dataItem){
    			var teamplateUrl="qlan/objectManagement/actionPopup.html";
    			 var title="Thao tác quyền chức năng";
    			 var windowId="ACTION_POPUP_USERS"
    				vm.roleSearch=null;	
					vm.dataRole={};
					vm.findRole={};
					vm.role={};					
    				 vm.dataRole.userName = dataItem.userName;
    				 vm.dataRole.userId=dataItem.userId;
    				 startLoading();
			 objectManagementService.getListRoleByUserId(vm.dataRole.userId).then(
    						function(result) {
    							stopLoading();
    							 fillDataTableActionPopup(result);	
    							 CommonService.populatePopupCreate(teamplateUrl,title,null,vm,windowId,false,'85%','80%');								 
    						}, function(errResponse) {
    							stopLoading();
    							toastr.error("Lỗi !");
    						});	
    			 
    		}
			
    		function fillDataTableActionPopup(data) {
    			vm.actionPopupGridOptions = kendoConfig.getGridOptions({
    				autoBind: true,
    				resizable: true,	
    				dataSource: data,
    				noRecords: true,
					columnMenu:false,
    				messages: {
    					noRecords : gettextCatalog.getString("Không có kết quả hiển thị")
    				},
    				pageable: {
    					refresh: false,
						pageSize: 10,
    					 pageSizes: [10, 15, 20, 25],
    					messages: {
    		                display: "{0}-{1} của {2} kết quả",
    		                itemsPerPage: "kết quả/trang",
    		                empty: "Không có kết quả hiển thị"
    		            }
    				},
    				columns: [
    				{
    					title: "STT",
    					field:"stt",
    			        template: dataItem => vm.actionPopupGrid != undefined ? (vm.actionPopupGrid.dataSource.data().indexOf(dataItem)+1) : ++vm.record,
    			        width: '5%',
    			        headerAttributes: {
    						style: "text-align:center;"
    					},
    					attributes: {
    						style: "text-align:center;"
    					},
    				}
    				,  {
    					title: "Mã nhóm quyền",
    					field: 'roleCode',
    			        width: '20%',
    			        headerAttributes: {
    						style: "text-align:center;"
    					},
    					attributes: {
    						style: "text-align:left;"
    					},
    				}, {
    					title: "Tên nhóm quyền",
    			        field: 'roleName',
    			        width: '20%',
    			        headerAttributes: {
    						style: "text-align:center;"
    					},
    					attributes: {
    						style: "text-align:left;"
    					},
    				}, {
    					title: "Mô tả",
    			        field: 'description',
    			        width: '20%',
    			        headerAttributes: {
    						style: "text-align:center;"
    					},
    					attributes: {
    						style: "text-align:left;"
    					},
    				},{
					title: "Trạng thái",
			        field: 'status',
			        width: 90,
			        template :  
			        "# if(status == 1){ #" + "#= 'Hoạt động' #" + "# } " +
			        "else if (status == 0) { # " + "#= 'Không hoạt động' #"+ "#} " +
			        "#",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
					
					}, {
    					title: "Xóa",
    			        template: dataItem =>
    					'<div class="text-center"">'+
    				'<a type="button"'+	
    					'class="#=userRoleId# icon_table" style="color:red;"  uib-tooltip="Xóa" translate>'+
    					'<i class="fa fa-times" aria-hidden="true" ng-click=caller.removeItem($event)></i>'+
    				'</a>'
    					+'</div>',
    			        width: '10%',
    			        field:"stt",
    			        headerAttributes: {
    						style: "text-align:center;"
    					},
    					attributes: {
    						style: "text-align:left;"
    					},
    				}
    				,]
    			});
    		}
    		vm.headerTemplateStock='<div class="dropdown-header row text-center k-widget k-header">' +
  	      '<p class="col-md-6 text-header-auto border-right-ccc">Mã nhóm quyền</p>' +
  	      '<p class="col-md-6 text-header-auto">Tên nhóm quyền</p>' +
  	      	'</div>';
    		vm.rolesOptions = {
    	           
    	            select: function(e) {
    	                var dataItem = this.dataItem(e.item.index());
    	                vm.role = dataItem; // thành id
						var grid =vm.actionPopupGrid;
							
						if(vm.role.roleCode!=null&&vm.role.roleName!=""){
							vm.roleSearch=null;
						
						grid.dataSource.data().push(vm.role);
						grid.refresh();
						}
    	                vm.roleSearch=null;
    	            },
    	            pageSize: 10,
    	            dataSource: {
    	                serverFiltering: true,
    	                transport: {
    	                    read:  {
								type: "POST",
								url: RestEndpoint.BASE_SERVICE_URL + "commonServiceRest/getForAutoCompleteRoles",
								contentType: "application/json; charset=utf-8",
								dataType: "json"
    	                    },
    						parameterMap: function (options, type) {
								var listRoles=vm.actionPopupGrid.dataSource.data();
								var listId=[];
								for(var i=0;i<listRoles.length;i++){
									listId.push(listRoles[i].roleId);
								}
								var obj={};
								obj.listId=listId;
								obj.roleName=vm.roleSearch.name;
    								return JSON.stringify(obj)
    						}
    	                }
    	            },
    	            template:'<div class="row" ><div class="col-xs-5" style="word-break: break-word;float:left">#: data.roleCode #</div><div  style="word-break: break-word;padding-left: 5px;width:auto;overflow: hidden"> #: data.roleName #</div> </div>',
    	            change: function(e) {
    	                if (e.sender.value() === '') {
    	                	vm.role = null; // thành id
    	                	
    	                }
    	            },
    	            ignoreCase: false
    	        };
    		
			
			vm.insertUserRoleData=function(){
				var listRoles=vm.actionPopupGrid.dataSource.data();
				vm.dataRole.listRole=listRoles;
				startLoading();
				objectManagementService.insertUserRoleData(vm.dataRole).then(
    						function(result) {
    							stopLoading();
    							toastr.success("Thêm quyền cho người dùng thành công!");		
								CommonService.dismissPopup();								
    						}, function(errResponse) {
    							stopLoading();
    							if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
			                	toastr.error("Lỗi !");
			                }
    						});	
			}
			
			
	}
})();