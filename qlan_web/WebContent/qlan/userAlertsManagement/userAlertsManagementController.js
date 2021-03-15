(function() {
	'use strict';
	var controllerId = 'userAlertsManagementController';
	
	angular.module('MetronicApp').controller(controllerId, userAlertsManagementController);
	
	function userAlertsManagementController($scope, $rootScope, $timeout, gettextCatalog, 
			kendoConfig,userAlertsManagementService,
			CommonService, Constant) {
		var vm = this;
		vm.showSearch = true;
		vm.isCreateNew = false;
        vm.showDetail = false;
        //vm.options =[0];
		vm.removeItem=removeItem;
		// đối tượng để search userAlert
        vm.userAlertsManagementSearch={
        		status: null,
        		deptId: null,
				warningLevel: null,
        };
		
		// đối tượng khi tạo mới userAlert
        vm.userAlertsManagementCreate={
        		status: 2,
        		objectTypeId: 2
        };

		vm.userAlertsManagement={};
		vm.validatorOptions = kendoConfig.get('validatorOptions');
		initFormData();
		function initFormData() {
			fillDataTable([]);
		}
		
		/*$scope.$watch('vm.userAlertsManagementCreate.checkIp', function() {
			if(vm.userAlertsManagementCreate.checkIp==1){
				$("#create_ip_lb").addClass("req");
				$("#create_ip").attr("required",true);
			} else {
				$("#create_ip_lb").removeClass("req");
				$("#create_ip").removeAttr("required");
			}
  	       
  	    });*/

		// xử lý autoSearch
		vm.commonSearch={deptName: '', deptCode: ''};
        vm.deptSearch= {deptName:''};
            vm.headerTemplate='<div class="dropdown-header row text-center k-widget k-header">' +
'<p class="col-md-6 text-header-auto border-right-ccc">Mã</p>' +
'<p class="col-md-6 text-header-auto border-right-ccc">Tên</p>' +
	'</div>';
            vm.template='<div class="row"><div class="col-xs-5" style="padding: 0px 32px 0 0,float:left">#: data.deptCode #</div>' +
'<div style="padding-left: 10px,width:auto;overflow:hidden;text-align: right;">#: data.deptName #</div></div>';
		
		// Data cho Combobox
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
            };

	
		vm.doSearch= doSearch;
		function doSearch(){
			 // vm.showDetail = false;
			var grid =vm.userAlertsManagementGrid;	
			if(grid){
				grid.dataSource.query({
					page: 1,
					pageSize: 10
				});
			}
		}
		
		var dataWarning = [];
		userAlertsManagementService.getListWarningLevel().then(function(result){
				for(var i= 0; i< result.length; i++){
					dataWarning.push({
							apParamId: result[i].apParamId,
							name: result[i].name
						});
					};
				vm.warningLevel = dataWarning;
				vm.warningSelectOption = {
		                dataSource: vm.warningLevel,
		                dataTextField: "name",
		                dataValueField: "apParamId",
		                optionLabel: "---Chọn---",
		                valuePrimitive: true
		            };
				vm.warningSelectOptionsCreate = {
		                dataSource: vm.warningLevel,
		                dataTextField: "name",
		                dataValueField: "apParamId",
		                optionLabel: "---Chọn---",
		                valuePrimitive: true
		            };

			});
		var dataDept = [];
		userAlertsManagementService.getDept(vm.deptSearch).then(function(result){
				for(var i= 0; i< result.length; i++){
					dataDept.push({
							deptName: result[i].deptName,
							deptId: result[i].deptId
						});
					};
				vm.dept = dataDept;
				vm.optDept = {
		                dataSource: vm.dept,
		                dataTextField: "deptName",
		                dataValueField: "deptId",
		                optionLabel: "---Chọn---",
		                valuePrimitive: true
		            };
				vm.optDeptCreate = {
		                dataSource: vm.dept,
		                dataTextField: "deptName",
		                dataValueField: "deptId",
		                optionLabel: "---Chọn---",
		                valuePrimitive: true
		            };

			});
		 

		
		
		
		/*function refreshGrid(d) {
			var grid = vm.userAlertsManagementFileGrid;
			if(grid){
				grid.dataSource.data(d);
				grid.refresh();
			}
		}*/
		
		function fillDataTable(data) {
			vm.gridOptionsUserAlerts = kendoConfig.getGridOptions({
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
                        '<a class="btn btn-qlk padding-search-right removeQLK"'+
    					'ng-click="vm.removeAll()" uib-tooltip="Xóa" translate><p class="action-button add" aria-hidden="true">Xóa</p></a>'+
    					'</div>'	
        				+
                      	  '<div class="btn-group pull-right margin_top_button margin_right10">'+
                    '<i data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog" aria-hidden="true"></i></i>'+
                    '<div class="dropdown-menu hold-on-click dropdown-checkboxes" role="menu">'+
                    '<label ng-repeat="column in vm.userAlertsManagementGrid.columns| filter: vm.gridColumnShowHideFilter">'+
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
							 url: Constant.BASE_SERVICE_URL + "userAlertServiceRest/userAlert/doSearch",
							 contentType: "application/json; charset=utf-8",
							 type: "POST"
						},					
						parameterMap: function (options, type) {
								  vm.userAlertsManagementSearch.page = options.page
								  vm.userAlertsManagementSearch.pageSize = options.pageSize
								  return JSON.stringify(vm.userAlertsManagementSearch)
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
				    	title: "<input type='checkbox' name='gridchkselectall' ng-click='vm.chkSelectAll($event);' ng-model='vm.chkAll' />",
				        template: "<input type='checkbox' name='gridcheckbox' ng-click='vm.onCheck($event)' />",
				        width: 30
				   }, {
					title: gettextCatalog.getString("TT"),
					field:"stt",
			        template: dataItem =>vm.userAlertsManagementGrid.dataSource.indexOf(dataItem) + 1+
                    (vm.userAlertsManagementGrid.dataSource._page -1 ) *vm.userAlertsManagementGrid.dataSource._pageSize ,
			        width: 35,
			        headerAttributes: {
						style: "text-align:center; font-weight:Bold;",
					},
					attributes: {
						style: "text-align:right;"
					},
				}
				, {
					title: "Mã người dùng",
					field: 'staffCode',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:left;"
					},
				},
				{
					title: "Tên người dùng",
					field: 'name',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:left;"
					},
				},
				{
					title: "Phòng ban",
					field: 'deptName',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:left;"
					},
				},{
					title: "Số điện thoại",
					field: 'tel',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:right;"
					},
				},{
					title: "Email",
					field: 'email',
			        width: 120,
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:left;"
					},
				},
				{
					title: "Mức độ cảnh báo",
			        field: 'warningLevel',
			        width: 120,
			        template :  
			        "# if(warningLevel == 1){ #" + "#= 'Mức cảnh báo 1' #" + "# } " +
			        "else if (warningLevel == 2) { # " + "#= 'Mức cảnh báo 2' #"+ "#} " +
					"else if (warningLevel == 3) { # " + "#= 'Mức cảnh báo 3' #"+ "#} " +
			        "#",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:left;"
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
						style: "text-align:left;"
					},
					
				}
				,{
					title: "Thao tác",
			        template:dataItem =>
			        	'	<div class="text-center #=userAlertsManagementId#"">'+
			        	'		<a  type="button" class="#=userAlertsManagementId# icon_table" uib-tooltip="Cập nhật người dùng" translate> '+
			        	'			<i class="fa fa-pencil" ng-click=vm.edit(dataItem) aria-hidden="true"></i>'+
			        	'		</a> '+
			        	'		<a type="button" class="#=userAlertsManagementId# icon_table" uib-tooltip="Xóa" translate >'+
			        	'			<i class="fa fa-trash" ng-click=vm.remove(dataItem) aria-hidden="true" style="color:red;"></i>'+
			        	'		</a>'+
			        	'	</div>',
			        width: 90,
			        field:"actionss",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
				}
				]
			});
		}

		vm.add = function add(){
			vm.isCreateNew = true;
			vm.userAlertsManagementCreate = {deptId:null, warningLevel:null};
			 var teamplateUrl="qlan/userAlertsManagement/userAlertsManagementPopup.html";
			 var title="Thêm mới cảnh báo người dùng";
			 var windowId="userAlertsManagement";
			 
			 CommonService.populatePopupCreate(teamplateUrl,title,{},vm,windowId,true,'80%','60%'); 
			 
		 }
		
		vm.edit = function edit(dataItem){
				vm.isCreateNew = false;
				vm.userAlertsManagementCreateTemp = {};
				vm.userAlertsManagementCreateTemp.staffId = dataItem.staffId;
				vm.userAlertsManagementCreateTemp.staffCode = dataItem.staffCode;
				vm.userAlertsManagementCreateTemp.name = dataItem.name;
				vm.userAlertsManagementCreateTemp.tel = dataItem.tel;
				vm.userAlertsManagementCreateTemp.email = dataItem.email;
				vm.userAlertsManagementCreateTemp.warningLevel = dataItem.warningLevel;
				vm.userAlertsManagementCreateTemp.status = dataItem.status;
				vm.userAlertsManagementCreateTemp.deptId = dataItem.deptId; 
				vm.userAlertsManagementCreate = vm.userAlertsManagementCreateTemp;
				var teamplateUrl="qlan/userAlertsManagement/userAlertsManagementPopup.html";
				var title="Cập nhật cảnh báo người dùng";
				var windowId="userAlertsManagement"
				CommonService.populatePopupCreate(teamplateUrl,title,vm.userAlertsManagementCreate,vm,windowId,false,'80%','60%');
		}
		
		
		
		vm.save= function save(data){
			console.log(vm.userAlertsManagementCreate);
			startLoading();
				if(vm.isCreateNew) {
	            	userAlertsManagementService.createUserAlertsManagement(vm.userAlertsManagementCreate).then(function(result){
	            		stopLoading();
	            			if(result.error){
	            				toastr.error(result.error);
	            				return;
	            			}
	            			
	            			toastr.success("Thêm mới thành công!");
	                        vm.refreshGrid();
	                        
	                        CommonService.dismissPopup();
	            		}, function(errResponse){
	            			stopLoading();
			                if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
			                	toastr.error(gettextCatalog.getString("Lỗi xuất hiện khi tạo mới người dùng!"));
			                }
	    		        });
	            	} else {
	            		userAlertsManagementService.updateUserAlertsManagement(vm.userAlertsManagementCreate).then(function(result){
	            			stopLoading();
	            			if(result.error){
	            				toastr.error(result.error);
								doSearch();
	            				return;
	            			}
							console.log(vm.userAlertsManagementCreate);
	            			toastr.success("Cập nhật thành công!");
							
							vm.refreshGrid();
							
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
			vm.userAlertsManagementCreate =data;
			confirm('Xác nhận xóa',function (d){
				startLoading();
			userAlertsManagementService.remove(vm.userAlertsManagementCreate).then(function(result){
				stopLoading();
				if(result.error){
					toastr.error(result.error);
					vm.refreshGrid();
					return ;
				}
    			toastr.success("Xóa cảnh báo người dùng thành công!");
				// Cập nhật lại bảng
    			var currentPage = vm.userAlertsManagementGrid.dataSource.page();
    			var dataSize = vm.userAlertsManagementGrid.dataSource.data().length;
    			if (currentPage > 1&&dataSize==1) {
    	        	vm.userAlertsManagementGrid.dataSource.page(currentPage - 1);
				} else {
					vm.userAlertsManagementGrid.dataSource.page(currentPage);
				}
    			
    		}, function(errResponse){
    			stopLoading();
    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi xóa Cảnh báo người dùng"));
                }
	        });
				});
		}
		
		vm.refreshGrid = function(){
			var currentPage = vm.userAlertsManagementGrid.dataSource.page();
			vm.userAlertsManagementGrid.dataSource.page(currentPage);
		}
	
		
		
		vm.showHideColumn=function(column){
        	if (angular.isUndefined(column.hidden)) {
        		vm.userAlertsManagementGrid.hideColumn(column);
            } else if (column.hidden) {
            	vm.userAlertsManagementGrid.showColumn(column);
            } else {
            	vm.userAlertsManagementGrid.hideColumn(column);
            }
        	
        	
        }
		
		vm.gridColumnShowHideFilter = function (item) { 
                return item.type==null||item.type !=1; 
            };
          //handleCheck
    		vm.onCheck = function(item){
    			if(document.getElementById("chkSelectAll").checked == true){
    				document.getElementById("chkSelectAll").checked = false;
    			}
    		}
    		vm.chkSelectAll = function(item) {
    	    	var grid = vm.userAlertsManagementGrid;
    	    	chkSelectAllBase(vm.chkAll, grid);
    	    }
    		vm.removeAll = function(){
    			var selectedRow = [];
    			var grid = vm.userAlertsManagementGrid;
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
    				confirm('Xác nhận xóa',function (d){
    				userAlertsManagementService.removeAll(selectedRow).then(
    						function(result) {
								if(result){
									if(result.error){
									toastr.error(result.error);
									vm.refreshGrid();
									return;
									}
								}
									toastr.success("Xóa bản ghi thành công!");
    								vm.doSearch();
    						}, function(errResponse) {
    							toastr.error("Lỗi Xóa!");
    						});	
    				});
    				}
    		}
		vm.record=0;	
			
	}
})();
