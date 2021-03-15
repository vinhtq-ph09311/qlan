(function() {
	'use strict';
	var controllerId = 'deptManagementController';
	
	angular.module('MetronicApp').controller(controllerId, deptManagementController);
	
	function deptManagementController($scope, $rootScope, $timeout,
			// sử dụng cho đa ngôn ngữ
			gettextCatalog, 
			
			// gọi thư viện kendo
			kendoConfig,
			
			// gọi Service Manage
			deptManagementService,
			
			// gọi Service quản lý popup erp/commom/CommonService.js
			CommonService, 
	
		// gọi Service Constant js/app.constants.js
			// Service này có thể gọi mọi nơi gọi đến API
			Constant) {
	
		
		
		
		
	
		// tiền tố  thay thế cho This
		var vm = this;
		
		// disabled text Mã phòng cha khi cập nhật ds phòng ban
		vm.isCreateParentNew = false;
		
		// disabled text Mã phòng phòng ban khi cập nhât
		vm.isCreateNew = false
		
		// load du lieu xuong danh sach truc thuoc 
		vm.isShow= true;
		
		//  load vị trí cây lần đầu tiên khi vào chức năng QL Phòng ban
		  vm.ShowOne=true;
		
		 //  ds trực thuộc ko cho load phòng ban cha
        vm.isCheckDeleteChildrent= false;
	
		
      
//        vm.options =[0];
//        
//		vm.removeItem=removeItem;
		
		// đối tượng dùng để Search danh sách phòng ban
        vm.deptManagementSearch={
        		status: null,

        		deptId:null
        };
        
        
        // Đối tượng để tìm danh sách phòng ban trực thuộc
        
        vm.deptManagementShowParent={
        	
        };
        
        
        vm.deptManagementCreate={
        		status: 2,
        		objectTypeId: 2
        };
        // lưu cha lại khi xoá
		vm.deptManagementParentChildrent={};
		
		
		// hiển thi tên phòng ban cha ở danh sách trực thuộc
		vm.deptManagementShowParentdeptName="";
		
		
		vm.validatorOptions = kendoConfig.get('validatorOptions');
		
		
		
		
		// load data khi form QL phòng ban hiện ra
		initFormData();
		function initFormData() {
			openTreeView();
		
		
		
		
		}
		

		
		
		
			
		
		
		// xử lý autoSearch
		 vm.commonSearch={deptName: '', deptCode: ''};
         
         vm.headerTemplate='<div class="dropdown-header row text-center k-widget k-header">' +
'<p class="col-md-6 text-header-auto border-right-ccc">Mã</p>' +
'<p class="col-md-6 text-header-auto border-right-ccc">Tên</p>' +
	'</div>';
         vm.template='<div class="row"><div class="col-xs-5" style="padding: 0px 32px 0 0,float:left">#: data.deptCode #</div>' +
'<div style="padding-left: 10px,width:auto;overflow:hidden;text-align: right;">#: data.deptName #</div></div>';
            
            
            
            // dùng cho status (Trạng thái) gọi sangbeen
			// deptManagementPopup.html
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
		
	
		
		
		// tìm kiếm phòng ban (All)
		vm.doSearch= doSearch;
		function doSearch(){
			// khi tìm kiếm trên cây xong xoá ID để ko bị lưu lại khi Tìm kiếm
			// bình thường
			vm.deptManagementSearch.deptId=null;

	// assets/global/kendoui/cunstom/kendo.validator.js
		if($scope.validator.validate()){

			vm.isShow=true;
		
			// gọi lại bảng 
			var grid =vm.deptManagementGrid;	
			if(grid){
				grid.dataSource.query({
					page: 1,
					pageSize:5
				});
			}
	
		}else{
			var errIds=$.map($scope.validator._errors,function(value,index) {
				  return [index];
				});
			var errMsg=$.map($scope.validator._errors,function(value,index) {
				  return "* "+ [value] +"</br>";
				});
			$("#"+errIds[0]).focus();	
			toastr.error(errMsg);
		}
			
	
			
			
			
		}
		
		
		
		// tìm kiếm phòng ban trực thuộc
		vm.doSearchChildren= doSearchChildren;
		function doSearchChildren(param){
			
			if(typeof(param)==="undefined" || param===null ){
				vm.deptManagementShowParentdeptName="";
				vm.countChildren =0;
				vm.count=0;
				vm.deptManagementShowParent.deptId=-1;
				var grid =vm.deptManagementGridChildren;	
				if(grid){
					grid.dataSource.query({
						page: 1,
						pageSize: 5
					});
				}
			
				return;
			}
			
	
			if(typeof(param) !== "undefined"){
	deptManagementService.getDeptById(param.deptId).then(function(data) {
		if(data === null || typeof(data) === "undefined"){
			toastr.error(gettextCatalog.getString("Phòng ban không tồn tại"));
			vm.doSearch();
			openTreeView();
			return;
		}

			})


		vm.deptManagementShowParent= param;
		vm.deptManagementShowParentdeptName=param.deptName;
	
	
		var grid =vm.deptManagementGridChildren;	
		if(grid){
			grid.dataSource.query({
				page: 1,
				pageSize: 5
			});
		}
		}	else {
			vm.deptManagementShowParentdeptName="";
			vm.countChildren =0;
			vm.count=0;
			
		}	
}
		
		
		

		
		
		// load danh sách phòng ban
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
        			+
                      	  '<div class="btn-group pull-right margin_top_button margin_right10">'+
                    '<i data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog" aria-hidden="true"></i></i>'+
                    '<div class="dropdown-menu hold-on-click dropdown-checkboxes" role="menu">'+
                    '<label ng-repeat="column in vm.deptManagementGrid.columns| filter: vm.gridColumnShowHideFilter">'+
                    '<input type="checkbox" checked="column.hidden" ng-click="vm.showHideColumnGridParent(column)"> {{column.title}}'+
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
								
								
								

								
								if(vm.isShow){
							
									
									
									vm.doSearchChildren(response.data[0]);
									
								
								}
						
					
								vm.isShow= true;
							
							
								return response.data;
							},
		                },
					transport: {
						read: {
		                        // Thuc hien viec goi service
							 url: Constant.BASE_SERVICE_URL + "deptService/dept/doSearch",
							 contentType: "application/json; charset=utf-8",
							 type: "POST"
						},					
						parameterMap: function (options, type) {
								  vm.deptManagementSearch.page = options.page
								  vm.deptManagementSearch.pageSize = options.pageSize
								  return JSON.stringify(vm.deptManagementSearch)
						}
					},					 
					pageSize: 5
				},
				noRecords: true,
				messages: {
					noRecords : gettextCatalog.getString("Không có kết quả hiển thị")
				},
				pageable: {
					refresh: false,
					 pageSizes: [5, 10, 15, 20, 25],
					messages: {
		                display: "{0}-{1} của {2} kết quả",
		                itemsPerPage: "kết quả/trang",
		                empty: "Không có kết quả hiển thị"
		            }
				},
				
				columns: [
					 {
					title: gettextCatalog.getString("STT"),
					field:"stt",
			        template: dataItem =>vm.deptManagementGrid.dataSource.indexOf(dataItem) + 1+
                    (vm.deptManagementGrid.dataSource._page -1 ) * vm.deptManagementGrid.dataSource._pageSize ,
                    width: "6.58%",
			        headerAttributes: {
						style: "text-align:center; font-weight:Bold;",
					},
					attributes: {
						style: "text-align:center;"
					},
				}
				, {
					title: "Mã phòng ban",
					field: 'deptCode',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: "Tên phòng ban",
					field: 'deptName',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},{
					title: "Phòng ban cha",
					field: 'parentDeptName',
					 width: "19.7%",
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
			        width: "14.62%",
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
			        	'	<div class="text-center #=deptManagementId#"">'+
			        	'		<a  type="button" class="#=deptManagementId# icon_table" uib-tooltip="Cập nhật Phòng ban" translate> '+
			        	'			<i class="fa fa-pencil" ng-click=vm.edit(dataItem) aria-hidden="true"></i>'+
			        	'		</a> '+
			        	'		<a  type="button" class="#=deptManagementId# icon_table" uib-tooltip="Phòng ban Trực thuộc" translate>'+
			        	'			<i ng-click=vm.doSearchChildren(dataItem) class="fa fa-table" aria-hidden="true"></i> '+
			        	'		</a> '+
			        	'		<a type="button" class="#=deptManagementId# icon_table" uib-tooltip="Xóa" translate >'+
			        	'			<i class="fa fa-trash" ng-click=vm.remove(dataItem) aria-hidden="true" style="color:red;"></i>'+
			        	'		</a>'+
			        	'	</div>',
			        	 width: "19.7%",
			        field:"actionss",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
				}]
			});
		}
		
		
		
		// load danh sách phòng ban Children
		function fillDataTableChildren(data) {
			vm.gridOptionsChildren = kendoConfig.getGridOptions({
				autoBind: true,
				sortable: false,
				resizable: true,
				columnMenu: false,
				toolbar: [
                    {
                    	name: "actions",
                        template: '<div class=" pull-left ">'+
                        '<a class="btn btn-qlk padding-search-right addQLK"'+
    					'ng-click="vm.addChildrent()" uib-tooltip="Thêm mới" translate><p class="action-button add" aria-hidden="true">Tạo mới</p></a>'+
    					'</div>'	
        			+
                      	  '<div class="btn-group pull-right margin_top_button margin_right10">'+
                    '<i data-toggle="dropdown" aria-expanded="false"><i class="fa fa-cog" aria-hidden="true"></i></i>'+
                    '<div class="dropdown-menu hold-on-click dropdown-checkboxes" role="menu">'+
                    '<label ng-repeat="column in vm.deptManagementGridChildren.columns| filter: vm.gridColumnShowHideFilter">'+
                    '<input type="checkbox" checked="column.hidden" ng-click="vm.showHideColumnChildrent(column)"> {{column.title}}'+
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
							 	vm.countChildren = response.total;
							 	
						
								return response.total;
							},
							data: function (response) {
								return response.data;
							},
		                },
					transport: {
						read: {
		                        // Thuc hien viec goi service
							 url: Constant.BASE_SERVICE_URL + "deptService/dept/doSearchChildren",
							 contentType: "application/json; charset=utf-8",
							 type: "POST"
						},					
						parameterMap: function (options, type) {
								  vm.deptManagementShowParent.page = options.page
								  vm.deptManagementShowParent.pageSize = options.pageSize
								  return JSON.stringify(vm.deptManagementShowParent)
						}
					},					 
					pageSize: 5
				},
				noRecords: true,
				messages: {
					noRecords : gettextCatalog.getString("Không có kết quả hiển thị")
				},
				pageable: {
					refresh: false,
					 pageSizes: [5, 10, 15, 20, 25],
					messages: {
		                display: "{0}-{1} của {2} kết quả",
		                itemsPerPage: "kết quả/trang",
		                empty: "Không có kết quả hiển thị"
		            }
				},
				
				columns: [
					 {
					title: gettextCatalog.getString("STT"),
					field:"stt",
			        template: dataItem =>vm.deptManagementGridChildren.dataSource.indexOf(dataItem) + 1+
                    (vm.deptManagementGridChildren.dataSource._page -1 ) *vm.deptManagementGridChildren.dataSource._pageSize ,
                    width: "6.58%",
			        headerAttributes: {
						style: "text-align:center; font-weight:Bold;",
					},
					attributes: {
						style: "text-align:center;"
					},
				}
				, {
					title: "Mã phòng ban",
					field: 'deptCode',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: "Tên phòng ban",
					field: 'deptName',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},{
					title: "Phòng ban cha",
					field: 'parentDeptName',
					 width: "19.7%",
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
			        width: "14.62%",
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
			        	'	<div class="text-center #=deptManagementId#"">'+
			        	'		<a  type="button" class="#=deptManagementId# icon_table" uib-tooltip="Cập nhật Phòng ban" translate> '+
			        	'			<i class="fa fa-pencil" ng-click=vm.editChildrent(dataItem) aria-hidden="true"></i>'+
			        	'		</a> '+
			        
			        	'		<a type="button" class="#=deptManagementId# icon_table" uib-tooltip="Xóa" translate >'+
			        	'			<i class="fa fa-trash" ng-click=vm.removeChildrent(dataItem) aria-hidden="true" style="color:red;"></i>'+
			        	'		</a>'+
			        	'	</div>',
			        	 width: "19.7%",
			        field:"actionss",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
				}]
			});
		}
		
		
		
		
		

		vm.add = function add(){
			//  ds trực thuộc ko cho load phòng ban cha
			vm.isCheckDeleteChildrent= false;
			
			vm.isCreateParentNew= false;
			vm.isCreateNew= false;
			vm.deptManagementCreate={};

			vm.deptManagementCreate.deptId = null;
			vm.deptManagementCreate.parentDeptId = 0;
			vm.deptManagementCreate.parentDeptName = "";
			 var teamplateUrl="qlan/deptManagement/deptManagementPopup.html";
			 var title="Thêm mới Phòng ban";
			 var windowId="deptManagement";
			 
			 CommonService.populatePopupCreate(teamplateUrl,title,vm.deptManagementCreate,vm,windowId,true,'80%','60%'); 
			 
		 }
		
		
		
		
		vm.addChildrent = function addChildrent(){
			
			deptManagementService.getDeptById(vm.deptManagementShowParent.deptId).then(function(data) {
				if(data === null || typeof(data) === "undefined"){
					
					toastr.error(gettextCatalog.getString("Phòng ban không tồn tại"));
					vm.doSearch();
					openTreeView();
				
					return;
				}else {

					vm.isCreateParentNew= true;
					vm.isCreateNew= false;
					vm.deptManagementCreate={};
		
					vm.deptManagementCreate.deptId = null;
					vm.deptManagementCreate.parentDeptId = vm.deptManagementShowParent.deptId;
					vm.deptManagementCreate.parentDeptName = vm.deptManagementShowParent.deptName;
					// kiểm tra khi thêm mới có sửa cha hay ko
				    vm.deptsManagementCreateTempparentDeptId=vm.deptManagementShowParent.deptId;
				
					 var teamplateUrl="qlan/deptManagement/deptManagementPopup.html";
					 var title="Thêm mới Phòng ban Trực Thuộc : "+vm.deptManagementCreate.parentDeptName;
					 var windowId="deptManagement";
					 
					 CommonService.populatePopupCreate(teamplateUrl,title,vm.deptManagementCreate,vm,windowId,true,'80%','60%'); 
				}
			})
			
			
		
			 
		 }
		
		
		vm.edit = function edit(dataItem){
		
				vm.isCreateNew= true;
				//không load lại danh sách phòng ban khi update phòng ban trực thuộc
				vm.isCheckDeleteChildrent= false;
			
				vm.isCreateParentNew= false;
				deptManagementService.getDeptById(dataItem.deptId).then(function(data) {
					if(data === null || typeof(data) === "undefined"){
					     
						toastr.error(gettextCatalog.getString("Phòng ban không tồn tại"));
					
						
						
						openTreeView();
						
						
						var currentPage = vm.deptManagementGrid.dataSource.page();
		    			var dataSize = vm.deptManagementGrid.dataSource.data().length;
		    			if (currentPage > 1&&dataSize==1) {
		    	        	vm.deptManagementGrid.dataSource.page(currentPage - 1);
						} else {
							vm.deptManagementGrid.dataSource.page(currentPage);
						}
		    			
					return;
						
					}else {
					
					    
						  vm.deptsManagementCreateTemp = {};
				            vm.deptsManagementCreateTemp.deptId = dataItem.deptId;
				            vm.deptsManagementCreateTemp.deptName = dataItem.deptName;
				            vm.deptsManagementCreateTemp.deptCode = dataItem.deptCode;
				            // vm.checkCodeUpdate truyền kiểm tra xem có sửa Mã
							// phòng ban
				        	vm.checkCodeUpdate=dataItem.deptCode;
				            vm.deptsManagementCreateTemp.status = dataItem.status;
				            vm.deptsManagementCreateTemp.parentDeptId = dataItem.parentDeptId;
				        	vm.doSearchChildren(vm.deptsManagementCreateTemp);
				        
				            if(dataItem.parentDeptName != null ){
				               vm.deptsManagementCreateTemp.parentDeptName = dataItem.parentDeptName;
				            }else {
				                vm.deptsManagementCreateTemp.parentDeptName = "";
				            }
				            
				            vm.deptManagementCreate=  vm.deptsManagementCreateTemp
						var teamplateUrl="qlan/deptManagement/deptManagementPopup.html";
						var title="Cập nhật phòng ban : "  +vm.deptsManagementCreateTemp.deptName;
						var windowId="deptManagement"
						CommonService.populatePopupCreate(teamplateUrl,title,vm.deptManagementCreate,vm,windowId,false,'80%','60%');
					}
					
					

					})
			
				
		}
		
		
		
		
		
		
		
		vm.editChildrent = function editChildrent(dataItem){
			vm.isCreateNew= true;
			vm.isCreateParentNew= true;
			deptManagementService.getDeptById(dataItem.deptId).then(function(data) {
				if(data == null || typeof(data) == "undefined"){
					
					toastr.error(gettextCatalog.getString("Phòng ban không tồn tại"));
			
					openTreeView();
				
	    			
	    			var currentPageChildrent = vm.deptManagementGridChildren.dataSource.page();
	    			var dataSizeChildrent = vm.deptManagementGridChildren.dataSource.data().length;
	    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
	    	        	vm.deptManagementGridChildren.dataSource.page(currentPageChildrent - 1);
					} else {	
						vm.deptManagementGridChildren.dataSource.page(currentPageChildrent);
					}
				
					return;
				}else {
					 vm.deptsManagementCreateTemp = {};
			            vm.deptsManagementCreateTemp.deptId = dataItem.deptId;
			            vm.deptsManagementCreateTemp.deptName = dataItem.deptName;
			            vm.deptsManagementCreateTemp.deptCode = dataItem.deptCode;
			  		  // vm.checkCodeUpdate truyền kiểm tra xem có sửa Mã
						// phòng ban
						vm.checkCodeUpdate=dataItem.deptCode;
			            vm.deptsManagementCreateTemp.status = dataItem.status;
			            vm.deptsManagementCreateTemp.parentDeptId = dataItem.parentDeptId;
			            // lưu lại Id cha để khi cập nhật kiểm tra
			            vm.deptsManagementCreateTempparentDeptId=dataItem.parentDeptId;
			         
			            if(dataItem.parentDeptName != null ){
			               vm.deptsManagementCreateTemp.parentDeptName = dataItem.parentDeptName;
			            }
			        
					vm.deptManagementCreate =vm.deptsManagementCreateTemp;
					
					var teamplateUrl="qlan/deptManagement/deptManagementPopup.html";
					var title="Cập nhật phòng ban : "+   vm.deptsManagementCreateTemp.deptName;
					var windowId="deptManagement"
					CommonService.populatePopupCreate(teamplateUrl,title,vm.deptManagementCreate,vm,windowId,false,'80%','60%');
				}
				
				

				})
			
	}
		
		
		vm.cancel=function(){
			 // doSearch();
		
		    CommonService.dismissPopup();
		}
		
		
		vm.save= function save(){
		

	
			
			var check = false;
		
			if( ( 	 typeof(vm.deptManagementCreate.parentDeptName) === "undefined" 
				||  vm.deptManagementCreate.parentDeptName === ""
				
						|| vm.deptManagementCreate.parentDeptName === null) 
						&& vm.deptManagementCreate.parentDeptId == 0 
						|| vm.deptManagementCreate.parentDeptId > 0  ){
				check = true;
				
			}
	
		

			
		if(check === false ){
			
		
			toastr.error("Phòng ban cha không tồn tại");
			vm.deptManagementCreate.parentDeptName="";
			return;
		}
		
			
			
			
	
			
		
				if(vm.deptManagementCreate.deptId == null) {
					
				// kiểm tra trạng thái add ds trực thuoọc
					if(vm.isCreateParentNew ==true){
						// kiểm tra xem có thay đổi phòng ban cha hay không
					if(vm.deptsManagementCreateTempparentDeptId!==vm.deptManagementCreate.parentDeptId){
	            		toastr.error("Không được sửa phòng ban cha khi ở Danh Sách trực thuộc");
        				return;
	            	}
					}
					
					startLoading();
	            	deptManagementService.createdeptManagement(vm.deptManagementCreate).then(function(result){
	            		stopLoading();
	            		if(result.error){
            				toastr.error(result.error);
            				if(result.error==="Phòng ban cha không tồn tại ! </br>"){
            			
	            				 doSearch();
	            				 CommonService.dismissPopup();
	            			}
            			
            				
            				return;
            			}
	            			
	            			toastr.success("Thêm mới thành công!");
	            			openTreeView();
	            			if(vm.isCreateParentNew ==false)
	            			{    
	            				doSearch();
	            				}
	                   
	                    	vm.doSearchChildren(vm.deptManagementShowParent);
	                        CommonService.dismissPopup();
	            		}, function(errResponse){
	            			stopLoading();
			                if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
			                	toastr.error(gettextCatalog.getString("Lỗi xuất hiện khi tạo mới phòng ban!"));
			                }
	    		        });
	            	} 
				else {
					
					if(vm.checkCodeUpdate!==vm.deptManagementCreate.deptCode){
						toastr.error("Mã phòng ban không được cập nhật ");
        				return;
					}
					
					
					
					// kiểm tra cập nhật phòng ban con
					if(vm.isCreateParentNew ==true){
						// kiểm tra xem có thay đổi phòng ban cha hay không
					if(vm.deptsManagementCreateTempparentDeptId!==vm.deptManagementCreate.parentDeptId){
	            		toastr.error("Không được cập nhật phòng ban cha khi ở Danh Sách trực thuộc");
        				return;
	            	}
					}
					startLoading();
	            		deptManagementService.updatedeptManagement(vm.deptManagementCreate).then(function(result){
	            	
	            			stopLoading();
	            			if(result.error){
	            				toastr.error(result.error);
	            				if(result.error==="Phòng ban không tồn tại ! </br>"){
	            			
		            				 doSearch();
		            				 CommonService.dismissPopup();
		            			}
	            				
	            				return;
	            			}
	            			
	            			
	            			
	            		
	            			toastr.success("Cập nhật thành công!");
	            			
	            			// khi cập nhật thành công thì lấy phòng ban vừa cập
							// nhật về .
//	            			deptManagementService.getDeptById(JSON.stringify(result)).then(function(data) {
//	            	
//							})
	            			
	            			
	            			if(vm.isCreateParentNew ==false){
	            				
	    	            		
	            				// sử lại autosearch khi cập nhật con
	            				vm.deptManagementShowParent.deptId = vm.deptManagementCreate.deptId;
	            				vm.deptManagementShowParent.deptName = vm.deptManagementCreate.deptName;
	            				
	            				vm.deptManagementShowParentdeptName=vm.deptManagementCreate.deptName;
	            			
	            				
	            			}
	            		
							vm.isShow= false;
	            			if( !vm.isCheckDeleteChildrent){
	            				
	            				// lấy lại vị trí trang hiện tại ds phòng ban
	            			var currentPage = vm.deptManagementGrid.dataSource.page();
	            			vm.deptManagementGrid.dataSource.page(currentPage);
	            			
	        				}
	            			
	            			
	            	
	            			
	            	
	            			
	            			// lấy lại vị trí trang hiện tại ds phòng ban trực
							// thuộc
	            			var currentPagechilDren = vm.deptManagementGridChildren.dataSource.page();
	            			vm.deptManagementGridChildren.dataSource.page(currentPagechilDren);
	            			
	            		

	            			openTreeView();
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
			
			vm.isCheckDeleteChildrent= false;
			
			vm.deptManagementCreate =data;
			confirm('Bạn có chắc chắn muốn xóa không',function (d){
				startLoading();
			deptManagementService.remove(vm.deptManagementCreate).then(function(result){
				stopLoading();
				
				if(result.error){
					toastr.error(result.error)
					if(result.error==="Xóa không thành công, phòng ban không tồn tại !"){
						
						var currentPage = vm.deptManagementGrid.dataSource.page();
		    			var dataSize = vm.deptManagementGrid.dataSource.data().length;
		    			if (currentPage > 1&&dataSize==1) {
		    	        	vm.deptManagementGrid.dataSource.page(currentPage - 1);
						} else {
							vm.deptManagementGrid.dataSource.page(currentPage);
						}
		    			
		    			var currentPageChildrent = vm.deptManagementGridChildren.dataSource.page();
		    			var dataSizeChildrent = vm.deptManagementGridChildren.dataSource.data().length;
		    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
		    	        	vm.deptManagementGridChildren.dataSource.page(currentPageChildrent - 1);
						} else {	
							vm.deptManagementGridChildren.dataSource.page(currentPageChildrent);
						}
					}
					return ;
				}
				openTreeView()

				
				
    			toastr.success("Xóa  thành công!");
			
    			var currentPage = vm.deptManagementGrid.dataSource.page();
    			var dataSize = vm.deptManagementGrid.dataSource.data().length;
    			if (currentPage > 1&&dataSize==1) {
    	        	vm.deptManagementGrid.dataSource.page(currentPage - 1);
				} else {
					vm.deptManagementGrid.dataSource.page(currentPage);
				}
    			
    			var currentPageChildrent = vm.deptManagementGridChildren.dataSource.page();
    			var dataSizeChildrent = vm.deptManagementGridChildren.dataSource.data().length;
    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
    	        	vm.deptManagementGridChildren.dataSource.page(currentPageChildrent - 1);
				} else {
					vm.deptManagementGridChildren.dataSource.page(currentPageChildrent);
				}
    			
    		}, function(errResponse){
    			stopLoading();
    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi Xoá"));
                }
	        });
				});
		}

		
		
		
		
		
		vm.removeChildrent = function removeChildrent(data)
		{
			
			vm.deptManagementCreate =data;
			confirm('Bạn có chắc chắn muốn xóa không',function (d){
				startLoading();
			deptManagementService.remove(vm.deptManagementCreate).then(function(result){
				stopLoading();
				
				if(result.error){
					toastr.error(result.error)
					if(result.error==="Xóa không thành công, phòng ban không tồn tại !"){
						vm.isShow=false;
						if( !vm.isCheckDeleteChildrent){
							var currentPage = vm.deptManagementGrid.dataSource.page();
			    			var dataSize = vm.deptManagementGrid.dataSource.data().length;
			    			if (currentPage > 1&&dataSize==1) {
			    	        	vm.deptManagementGrid.dataSource.page(currentPage - 1);
							} else {
								vm.deptManagementGrid.dataSource.page(currentPage);
							}
						}
		    			
		    			var currentPageChildrent = vm.deptManagementGridChildren.dataSource.page();
		    			var dataSizeChildrent = vm.deptManagementGridChildren.dataSource.data().length;
		    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
		    	        	vm.deptManagementGridChildren.dataSource.page(currentPageChildrent - 1);
						} else {	
							vm.deptManagementGridChildren.dataSource.page(currentPageChildrent);
						}
					}
					return ;
				}
				openTreeView()

				
				
    			toastr.success("Xóa  thành công!");
				vm.isShow=false;
				// xoa ds trực thuộc ko cho load phòng ban cha
			
				if( !vm.isCheckDeleteChildrent){
					var currentPage = vm.deptManagementGrid.dataSource.page();
	    			var dataSize = vm.deptManagementGrid.dataSource.data().length;
	    			if (currentPage > 1&&dataSize==1) {
	    	        	vm.deptManagementGrid.dataSource.page(currentPage - 1);
					} else {
						vm.deptManagementGrid.dataSource.page(currentPage);
					}
				}
    			
    			
    			
    			var currentPageChildrent = vm.deptManagementGridChildren.dataSource.page();
    			var dataSizeChildrent = vm.deptManagementGridChildren.dataSource.data().length;
    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
    	        	vm.deptManagementGridChildren.dataSource.page(currentPageChildrent - 1);
				} else {
					vm.deptManagementGridChildren.dataSource.page(currentPageChildrent);
				}
    	
    			
    			
    		}, function(errResponse){
    			stopLoading();
    			if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
                	toastr.error(gettextCatalog.getString("Xảy ra lỗi khi Xoá"));
                }
	        });
				});
		}
		
		
		
	
		
		   // Ẩn || hiện cột trong grid khi click checkbox trong
			// fillDataTableDeptParent.toolbar.template
       vm.showHideColumnGridParent = function (column) {
            if (angular.isUndefined(column.hidden)) {
               vm.deptManagementGrid.hideColumn(column);
            } else if (column.hidden) {
              vm.deptManagementGrid.showColumn(column);
            } else {
               vm.deptManagementGrid.hideColumn(column);
            }
        }
	
		
		vm.showHideColumnChildrent=function(column){
        	if (angular.isUndefined(column.hidden)) {
        		vm.deptManagementGridChildren.hideColumn(column);
            } else if (column.hidden) {
            	vm.deptManagementGridChildren.showColumn(column);
            } else {
            	vm.deptManagementGridChildren.hideColumn(column);
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
    	    	var grid = vm.deptManagementGrid;
    	    	chkSelectAllBase(vm.chkAll, grid);
    	    }

			
    	
    		
    		
    		
    	     // Phần cây phòng ban
            // dataSource : Dữ liệu đc lấy về từ hàm DAO
            // dataTextField : tên thuộc tính đại diện cho từng đối tương (1 đối
			// tượng có nhiều thuộc tính thì chọn thuộc tính nào để hiển thị
			// trên cây)
            // dataSource : chứa dữ liệu danh sách đối tượng
            // loadOnDemand : true || false : có cho load lại các con của cha
			// khi mở rộng hay không( mặc định true == không load )
            // expandAll : true || false : có mở tất cả các con , cháu của cha
			// khi click hay ko (mặc định true == có cho || false == không : chỉ
			// mở con của nó , không mở cháu)

         vm.treeViewOptions = {
                dataSource: [],
                dataTextField: "deptName",
                loadOnDemand: false,
                dataBound: function (e) {
                },
            }
    		
    		
    		
    		
    		
    		
    		  // Item == 1 đối tượng phòng ban
    		vm.getTreedata= function(items,parent) {

				
    			var param=[];
    	
    			items.forEach( (item,index) =>{
    
    				if(item.parentDeptId=== parent){
    					   let row = item;
   	                    row.deptId = item.deptId;
   	                    row.items = vm.getTreedata(items, item.deptId);
   	                 param.push(row);
    				}
    			})
    			return param;
    			
    			
			}
    	
    		
		function openTreeView(){
				deptManagementService.getTree().then(function(result) {
				    let data = result;
	             vm.treeView.setDataSource(new kendo.data.HierarchicalDataSource({
	                    data: vm.getTreedata(data, 0)
	                }));
	        
	            vm.treeView.dataSource.read();
	            if(vm.ShowOne){
	            	   vm.isCheckDeleteChildrent= true;
	           
	                   vm.deptManagementSearch.deptId=vm.getTreedata(data, 0)[0].deptId;
	                
	                   var grid =vm.deptManagementGrid;	
	       			if(grid){
	       				grid.dataSource.query({
	       					page: 1,
	       					pageSize:5
	       				});
	       			}
	            }
	            
	            vm.ShowOne=false;
	        	fillDataTable([]);
				fillDataTableChildren([]);
	        
				});
			
				
			}
	
		
		
		
	

        // Dùng để tìm kiếm phòng ban trên cây
		vm.doSearchByTree = doSearchByTree;
        function doSearchByTree(dataItem){
           
        	deptManagementService.getDeptById(dataItem.deptId).then(function(data) {
				if(data === null || typeof(data) === "undefined"){
					toastr.error(gettextCatalog.getString("Phòng ban không tồn tại"));
			
					vm.doSearch();
					openTreeView();
					return;
				}else {
					 var treeview = $("#treeview").data("kendoTreeView");
			            // Mở ra danh sách phòng ban con của phòng ban đc chọn
			            treeview.expand(treeview.findByText(dataItem.deptName));
			            
			            
			        //  ds trực thuộc ko cho load phòng ban cha
			            vm.isCheckDeleteChildrent= true;
			            
			            
			            vm.deptManagementSearch= {};
			            // load phòng ban Parent lên Ds phòng ban
			            vm.deptManagementSearch.deptId= dataItem.deptId;
			            
			
			            var grid =vm.deptManagementGrid;	
			        	if(grid){
		       				grid.dataSource.query({
		       					page: 1,
		       					pageSize:5
		       				});
		       			}

			          vm.doSearchChildren(dataItem);
				}

				})

           
        }
		
			
			
	}
})();