(function() {
	'use strict';
	var controllerId = 'areaManagementController';
	
	angular.module('MetronicApp').controller(controllerId, areaManagementController);
	
	function areaManagementController($scope, $rootScope, $timeout,
			// sử dụng cho đa ngôn ngữ
			gettextCatalog, 
			
			// gọi thư viện kendo
			kendoConfig,
			
			// gọi Service Manage
			areaManagementService,
			
			// gọi Service quản lý popup erp/commom/CommonService.js
			CommonService, 
	
		// gọi Service Constant js/app.constants.js
			// Service này có thể gọi mọi nơi gọi đến API
			Constant) {
	
		
		
		
		
	
		// tiền tố thay thế cho This
		var vm = this;
		
		// sử dụng ng-disabled
		
		// disabled text Mã đơn vị cha khi cập nhật ds đơn vị
		vm.isCreateParentNew = false;
		
		// disabled text Mã đơn vị khi cập nhât
		vm.isCreateNew = false
		
		// load du lieu xuong danh sach truc thuoc
		vm.isShow= true;
		
		// load vị trí cây lần đầu tiên khi vào chức năng đơn vị
		  vm.ShowOne=true;
		
		
		// đối tượng dùng để Search danh sách đơn vị
        vm.areaManagementSearch={
        		id:null,
        		status: null,
        		areaCode: null
        		
        };
        
        // listId danh sách đơn vị cha
        vm.areaManagementSearch.listId = [];
        
        // Đối tượng để tìm danh sách đơn vị trực thuộc
        vm.areaManagementShowParent={};
        
        // Đối tượng lưu dữ liệu cho việc update và tạo mới
        vm.areaManagementCreate={};
		
		// hiển thi tên đơn vị cha ở danh sách trực thuộc
		vm.areaManagementShowParentareaName="";
		
		
		// validate
		vm.validatorOptions = kendoConfig.get('validatorOptions');
		
		
		
		
		// load data khi form QL đơn vị hiện ra
		initFormData();
		function initFormData() {
			
			// ds cây đơn vị sẽ show ra
			openTreeView();
		}
		

		
		// xử lý autoSearch - theo areaName và areaCode
		 vm.commonSearch={areaName: '', areaCode: ''};
         
		 // Template của Autosearch
         vm.headerTemplate='<div class="dropdown-header row text-center k-widget k-header">' +
'<p class="col-md-6 text-header-auto border-right-ccc">Mã đơn vị</p>' +
'<p class="col-md-6 text-header-auto border-right-ccc">Tên đơn vị</p>' +
	'</div>';
         vm.template='<div class="row"><div class="col-xs-5" style="padding: 0px 32px 0 0,float:left">#: data.areaCode #</div>' +
'<div style="padding-left: 10px,width:auto;overflow:hidden;text-align: right;">#: data.areaName #</div></div>';
            
            
            
            // dùng cho status (Trạng thái)
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
		
	
		
		
		// tìm kiếm đơn vị (All)
		vm.doSearch= doSearch;
		function doSearch(){
			// khi tìm kiếm trên cây xong xoá ID để ko bị lưu lại khi Tìm kiếm
			vm.areaManagementSearch.id = null;
			
			// khi tìm kiếm trên cây xong xoá listID của đơn vị cha để ko bị lưu lại khi Tìm kiếm
			vm.areaManagementSearch.listId = null;
			
			// validate bằng validator.validate()
			if($scope.validator.validate()){
				vm.isShow=true;
				// không có lỗi gì thì thực hiện tìm kiếm gọi lại bảng
				// dữ liệu sẽ lấy từ vm.areaManagementGrid == > đổ dữ liệu vào bảng
				var grid = vm.areaManagementGrid;	
				if(grid){
					grid.dataSource.query({
						page: 1,
						pageSize:5
					});
				}
		
			}
		}
		
		
	
		// tìm kiếm đơn vị trực thuộc
		vm.doSearchChildren= doSearchChildren;
		function doSearchChildren(param){
			if(typeof(param)==="undefined" || param===null ){
				vm.areaManagementShowParentareaName="";
				vm.countChildren = 0;
				vm.count=0;
				vm.areaManagementShowParent.id = -1;
				var grid =vm.areaManagementGridChildren;	
				if(grid){
					grid.dataSource.query({
						page: 1,
						pageSize: 5
					});
				}
			
				return;
			}
	
			if(typeof(param) !== "undefined"){
				console.log(param.id);
				areaManagementService.getAreaById(param.id).then(function(data) {
					if(data === null || typeof(data) === "undefined"){
						toastr.error(gettextCatalog.getString("Đơn vị không tồn tại"));
						vm.doSearch();
						openTreeView();
						return;
					}
					
					console.log("doSearchChildren",data);

			})

		// sử dụng để tìm danh sách đơn vị trực thuộc (param - data của đơn vị cha)
		vm.areaManagementShowParent= param;
		vm.areaManagementShowParentareaName=param.areaName;
	
		var grid =vm.areaManagementGridChildren;	
		if(grid){
			grid.dataSource.query({
				page: 1,
				pageSize: 5
			});
		}
		}	else {
			vm.areaManagementShowParentareaName="";
			vm.countChildren =0;
			vm.count=0;
			
		}	
}
		
		// load danh sách đơn vị
		vm.data = {};
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
                    '<label ng-repeat="column in vm.areaManagementGrid.columns| filter: vm.gridColumnShowHideFilter">'+
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
								vm.data = response.data;
								
								// hiển thị danh sách đơn vị trực thuộc
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
							 url: Constant.BASE_SERVICE_URL +"areaServiceRest/doSearch",
							 contentType: "application/json; charset=utf-8",
							 type: "POST"
						},					
					parameterMap: function (options, type) {
								  // Mapping 
								  vm.areaManagementSearch.page = options.page
								  vm.areaManagementSearch.pageSize = options.pageSize
								  return JSON.stringify(vm.areaManagementSearch)
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
			        template: dataItem =>vm.areaManagementGrid.dataSource.indexOf(dataItem) + 1+
                    (vm.areaManagementGrid.dataSource._page -1 ) * vm.areaManagementGrid.dataSource._pageSize ,
                    width: "6.58%",
			        headerAttributes: {
						style: "text-align:center; font-weight:Bold;",
					},
					attributes: {
						style: "text-align:center;"
					},
				}
				, {
					title: "Mã đơn vị",
					field: 'areaCode',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: "Tên đơn vị",
					field: 'areaName',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},{
					title: "Đơn vị cha",
					field: 'parentName',
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
			        	'	<div class="text-center #=areaManagementId#"">'+
			        	'		<a  type="button" class="#=areaManagementId# icon_table" uib-tooltip="Cập nhật Đơn vị" translate> '+
			        	'			<i class="fa fa-pencil" ng-click=vm.edit(dataItem) aria-hidden="true"></i>'+
			        	'		</a> '+
			        	'		<a  type="button" class="#=areaManagementId# icon_table" uib-tooltip="Đơn vị Trực thuộc" translate>'+
			        	'			<i ng-click=vm.doSearchChildren(dataItem) class="fa fa-table" aria-hidden="true"></i> '+
			        	'		</a> '+
			        	'		<a type="button" class="#=areaManagementId# icon_table" uib-tooltip="Xóa" translate >'+
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
		
		
		
// // load danh sách đơn vị Children
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
                    '<label ng-repeat="column in vm.areaManagementGridChildren.columns| filter: vm.gridColumnShowHideFilter">'+
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
							 	console.log(vm.countChildren)
								return response.total;
							},
							data: function (response) {
								return response.data;
							},
		                },
					transport: {
						read: {
		                        // Thuc hien viec goi service
							 url: Constant.BASE_SERVICE_URL + "areaServiceRest/doSearchChildren",
							 contentType: "application/json; charset=utf-8",
							 type: "POST"
						},					
						parameterMap: function (options, type) {
							// Khong co don vi cha
							if(vm.data.length <=0){
								vm.areaManagementShowParent.parentId = -1;
							}
								  vm.areaManagementShowParent.page = options.page
								  vm.areaManagementShowParent.pageSize = options.pageSize
								  return JSON.stringify(vm.areaManagementShowParent)
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
			        template: dataItem =>vm.areaManagementGridChildren.dataSource.indexOf(dataItem) + 1+
                    (vm.areaManagementGridChildren.dataSource._page -1 ) *vm.areaManagementGridChildren.dataSource._pageSize ,
                    width: "6.58%",
			        headerAttributes: {
						style: "text-align:center; font-weight:Bold;",
					},
					attributes: {
						style: "text-align:center;"
					},
				}
				, {
					title: "Mã đơn vị",
					field: 'areaCode',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},
				{
					title: "Tên đơn vị",
					field: 'areaName',
					 width: "19.7%",
			        headerAttributes: {
						style: "text-align:center;font-weight:Bold;"
					},
					attributes: {
						style: "text-align:center;"
					},
				},{
					title: "Đơn vị cha",
					field: 'parentName',
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
			        	'	<div class="text-center #=areaManagementId#"">'+
			        	'		<a  type="button" class="#=areaManagementId# icon_table" uib-tooltip="Cập nhật Đơn vị" translate> '+
			        	'			<i class="fa fa-pencil" ng-click=vm.editChildrent(dataItem) aria-hidden="true"></i>'+
			        	'		</a> '+
			        
			        	'		<a type="button" class="#=areaManagementId# icon_table" uib-tooltip="Xóa" translate >'+
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
		
		
		
		// Open popup với chức năng thêm mới đơn vị cha
		vm.add = function add(){
			
			// ds trực thuộc ko cho load đơn vị cha
			vm.isCheckDeleteChildrent= false;
			
			vm.isCreateParentNew= false;
			vm.isCreateNew= false;
			vm.areaManagementCreate={};

			vm.areaManagementCreate.id = null;
			vm.areaManagementCreate.parentId = 0;
			vm.areaManagementCreate.parentName = "";
			 var teamplateUrl="qlan/areaManagement/areaManagementPopup.html";
			 var title="Thêm mới Đơn vị";
			 var windowId="areaManagement";
			 
			 CommonService.populatePopupCreate(teamplateUrl,title,vm.areaManagementCreate,vm,windowId,true,'80%','60%'); 
			 
		 }
		
		
		
		// Open popup với chức năng thêm mới đơn vị trực thuộc
		vm.addChildrent = function addChildrent(){
			
			// lấy ra thông tin của đơn vị cha (Thêm đơn vị trực thuộc )
			areaManagementService.getAreaById(vm.areaManagementShowParent.id).then(function(data) {
				if(data === null || typeof(data) === "undefined"){
					
					toastr.error(gettextCatalog.getString("Đơn vị không tồn tại !"));
					vm.doSearch();
					openTreeView();
				
					return;
				}else {

					vm.isCreateParentNew= true;
					vm.isCreateNew= false;
					vm.areaManagementCreate={};
		 
					vm.areaManagementCreate.id = null;
					vm.areaManagementCreate.parentId = vm.areaManagementShowParent.id;
					vm.areaManagementCreate.parentName = vm.areaManagementShowParent.areaName;
					
					// kiểm tra khi thêm mới có sửa cha hay ko 
					// vm.areasManagementCreateTempparentId sẽ được lưu và truyền vào popup để check
				    vm.areasManagementCreateTempparentId = vm.areaManagementShowParent.id;
				
					 var teamplateUrl="qlan/areaManagement/areaManagementPopup.html";
					 var title="Thêm mới Đơn vị Trực Thuộc : "+vm.areaManagementCreate.parentName;
					 var windowId="areaManagement";
					 
					 CommonService.populatePopupCreate(teamplateUrl,title,vm.areaManagementCreate,vm,windowId,true,'80%','60%'); 
				}
			})
			
			
		
			 
		 }
		
		// Open popup với chức năng cập nhât đơn vị cha
		vm.edit = function edit(dataItem){
				
				// disabled trường mã đơn vị
				vm.isCreateNew= true;
				// không load lại danh sách đơn vị khi update đơn vị trực thuộc
				vm.isCheckDeleteChildrent= false;
			
				vm.isCreateParentNew= false;
				
				areaManagementService.getAreaById(dataItem.id).then(function(data) {
					
					// fix trường hợp đơn vị không còn tồn tại trong db 
					if(data === null || typeof(data) === "undefined"){
					     
						toastr.error(gettextCatalog.getString("Đơn vị không tồn tại !"));
						
						openTreeView();
												
						var currentPage = vm.areaManagementGrid.dataSource.page();
		    			var dataSize = vm.areaManagementGrid.dataSource.data().length;
		    			if (currentPage > 1&&dataSize==1) {
		    	        	vm.areaManagementGrid.dataSource.page(currentPage - 1);
						} else {
							vm.areaManagementGrid.dataSource.page(currentPage);
						}
		    			
					return;
						
					}else {
					
					    	// Tạo 1 biến tạm để lưu dữ liệu
						  	vm.areasManagementCreateTemp = {};
				            vm.areasManagementCreateTemp.id = dataItem.id;
				            vm.areasManagementCreateTemp.areaName = dataItem.areaName;
				            vm.areasManagementCreateTemp.areaCode = dataItem.areaCode;
				            vm.areasManagementCreateTemp.status = dataItem.status;
				            vm.areasManagementCreateTemp.parentId = dataItem.parentId;
				            if(dataItem.parentName != null ){
					               vm.areasManagementCreateTemp.parentName = dataItem.parentName;
					            }else {
					                vm.areasManagementCreateTemp.parentName = "";
					            }
				            
				            vm.areaManagementCreate=  vm.areasManagementCreateTemp
				            
				            // vm.checkCodeUpdate truyền kiểm tra xem có sửa Mã đơn vị
				        	vm.checkCodeUpdate=dataItem.areaCode;
				        	
				            // Click update vẫn có thể show được các con của đơn vị đó
				        	vm.doSearchChildren(vm.areasManagementCreateTemp);
				        				            
				           
						var teamplateUrl="qlan/areaManagement/areaManagementPopup.html";
						var title="Cập nhật đơn vị : "  +vm.areasManagementCreateTemp.areaName;
						var windowId="areaManagement"
						CommonService.populatePopupCreate(teamplateUrl,title,vm.areaManagementCreate,vm,windowId,false,'80%','60%');
					}
					
					

					})
			
				
		}
		
		
		
		
		
		
		// Open popup với chức năng cập nhât đơn vị trực thuộc
		vm.editChildrent = function editChildrent(dataItem){
			
			// disabled trường mã đơn vị
			vm.isCreateNew= true;
			
			// disabled trường  đơn vị cha
			vm.isCreateParentNew= true;
			
			// Kiểm tra xem đơn vị còn toofnt tại trong db không ?
			areaManagementService.getAreaById(dataItem.id).then(function(data) {
				if(data == null || typeof(data) == "undefined"){
					
					toastr.error(gettextCatalog.getString("Đơn vị không tồn tại !"));
			
					openTreeView();
				
	    			
	    			var currentPageChildrent = vm.areaManagementGridChildren.dataSource.page();
	    			var dataSizeChildrent = vm.areaManagementGridChildren.dataSource.data().length;
	    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
	    	        	vm.areaManagementGridChildren.dataSource.page(currentPageChildrent - 1);
					} else {	
						vm.areaManagementGridChildren.dataSource.page(currentPageChildrent);
					}
				
					return;
				}else {
						
						
					 	vm.areasManagementCreateTemp = {};
			            vm.areasManagementCreateTemp.id = dataItem.id;
			            vm.areasManagementCreateTemp.areaName = dataItem.areaName;
			            vm.areasManagementCreateTemp.areaCode = dataItem.areaCode;
			            vm.areasManagementCreateTemp.status = dataItem.status;
			            vm.areasManagementCreateTemp.parentId = dataItem.parentId;
			            
			            
			  		  // vm.checkCodeUpdate truyền kiểm tra xem có sửa Mã đơn vị
						vm.checkCodeUpdate=dataItem.areaCode;
			            
			            // lưu lại Id cha để khi cập nhật kiểm tra ==> không được thay đổi parentId khi update ở đơn vị trực thuộc
			            vm.areasManagementCreateTempparentId = dataItem.parentId;
			         
			            if(dataItem.parentName != null ){
			               vm.areasManagementCreateTemp.parentName = dataItem.parentName;
			            }
			        
			            vm.areaManagementCreate =vm.areasManagementCreateTemp;
					
					var teamplateUrl="qlan/areaManagement/areaManagementPopup.html";
					var title="Cập nhật đơn vị : "+   vm.areasManagementCreateTemp.areaName;
					var windowId="areaManagement"
					CommonService.populatePopupCreate(teamplateUrl,title,vm.areaManagementCreate,vm,windowId,false,'80%','60%');
				}
				
				

				})
			
	}
		
		
		vm.cancel=function(){
			 // doSearch();
		    CommonService.dismissPopup();
		}
		
		
		// tạo mới và cập nhật
		vm.save= function save(){
			var check = false;
			
			if( (typeof(vm.areaManagementCreate.parentName) === "undefined" ||  vm.areaManagementCreate.parentName === ""
				|| vm.areaManagementCreate.parentName === null)  && 
				vm.areaManagementCreate.parentId == 0 || vm.areaManagementCreate.parentId > 0 ){
				
				check = true;
			}
			
			if(check === false ){
			toastr.error("Đơn vị cha không tồn tại !");
			vm.areaManagementCreate.parentName="";
			
			return;
			}
			
			// Chưa có id ==> Tạo mới
			if(vm.areaManagementCreate.id == null) {
					
				// kiểm tra trạng thái add ds trực thuộc đơn vị
					if(vm.isCreateParentNew == true){
						// kiểm tra xem có thay đổi đơn vị cha hay không
					if(vm.areasManagementCreateTempparentId !== vm.areaManagementCreate.parentId){
	            		toastr.error("Không được sửa đơn vị cha khi ở Danh Sách trực thuộc");
        				return;
	            	}
					}
					
					startLoading();
					console.log(vm.areaManagementCreate);
	            	areaManagementService.createAreaManagement(vm.areaManagementCreate).then(function(result){
	            		stopLoading();
	            		if(result.error){
            				toastr.error(result.error);
            				if(result.error==="Đơn vị cha không tồn tại !"){
            			
	            				 doSearch();
	            				 CommonService.dismissPopup();
	            			}
            			
            				
            				return;
            			}
	            			
	            			toastr.success("Thêm mới thành công!");
	            			openTreeView();
	            			
	            			// load lại doSearch()  trong trường hợp thêm mới đơn vị cha
	            			if(vm.isCreateParentNew ==false)
	            			{    
	            				doSearch();
	            				}
	                   
	                    	vm.doSearchChildren(vm.areaManagementShowParent);
	                        CommonService.dismissPopup();
	            		}, function(errResponse){
	            			stopLoading();
			                if (errResponse.data) {
			                	toastr.error(errResponse.data.errorMessage);
			                } else {
			                	toastr.error(gettextCatalog.getString("Lỗi xuất hiện khi tạo mới đơn vị!"));
			                }
	    		        });
	            	} 
				else {
					// update ==> phải giữ nguyên areaCode (bị disabled)
					if(vm.checkCodeUpdate!==vm.areaManagementCreate.areaCode){
						toastr.error("Mã đơn vị không được cập nhật ");
        				return;
					}
					
					
					
					// kiểm tra cập nhật đơn vị con
					if(vm.isCreateParentNew ==true){
						// kiểm tra xem có thay đổi đơn vị cha hay không
					if(vm.areasManagementCreateTempparentId!==vm.areaManagementCreate.parentId){
	            		toastr.error("Không được cập nhật đơn vị cha khi ở Danh Sách trực thuộc");
        				return;
	            	}
					}
					startLoading();
					// cap nhat don vi
	            		areaManagementService.updateAreaManagement(vm.areaManagementCreate).then(function(result){
	            			console.log("resultUpdate",result);
	            			console.log("aaaaaaa",vm.areaManagementCreate)
	            			stopLoading();
	            			if(result.error){
	            				toastr.error(result.error);
	            				if(result.error==="Đơn vị không tồn tại !"){
	            			
		            				 doSearch();
		            				 CommonService.dismissPopup();
		            			}
	            				
	            				return;
	            			}
	            			toastr.success("Cập nhật thành công!");	            			
	            			
	            			if(vm.isCreateParentNew ==false){
	            				
	    	            		
	            				// sửa lại autosearch khi cập nhật con
	            				vm.areaManagementShowParent.id = vm.areaManagementCreate.id;
	            				vm.areaManagementShowParent.areaName = vm.areaManagementCreate.areaName;
	            				
	            				vm.areaManagementShowParentareaName=vm.areaManagementCreate.areaName;
	            			
	            				
	            			}
	            		
							vm.isShow= false;
	            			if( !vm.isCheckDeleteChildrent){
	            				
	            				// lấy lại vị trí trang hiện tại ds đơn vị
	            			var currentPage = vm.areaManagementGrid.dataSource.page();
	            			vm.areaManagementGrid.dataSource.page(currentPage);
	            			
	        				}

	            			// lấy lại vị trí trang hiện tại ds đơn vị trực thuộc
	            			var currentPagechilDren = vm.areaManagementGridChildren.dataSource.page();
	            			vm.areaManagementGridChildren.dataSource.page(currentPagechilDren);
	            			
	            		

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
	
		// Xóa danh sách đơn vị cha
		vm.remove = function remove(data)
		{
			
			vm.isCheckDeleteChildrent= false;
			
			vm.areaManagementCreate =data;
			confirm('Bạn có chắc chắn muốn xóa không',function (d){
				startLoading();
			areaManagementService.remove(vm.areaManagementCreate).then(function(result){
				stopLoading();
				
				if(result.error){
					toastr.error(result.error)
					if(result.error==="Xóa không thành công, đơn vị không tồn tại !"){
						console.log("vm.areaManagementGrid",vm.areaManagementGrid);
						
						// refresh lại bảng đơn vị cha
						var currentPage = vm.areaManagementGrid.dataSource.page();
		    			var dataSize = vm.areaManagementGrid.dataSource.data().length;
		    			if (currentPage > 1 && dataSize==1) {
		    	        	vm.areaManagementGrid.dataSource.page(currentPage - 1);
						} else {
							vm.areaManagementGrid.dataSource.page(currentPage);
						}
		    			
		    			// refresh lại bảng đơn vị trực thuộc của đơn vị 
		    			var currentPageChildrent = vm.areaManagementGridChildren.dataSource.page();
		    			var dataSizeChildrent = vm.areaManagementGridChildren.dataSource.data().length;
		    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
		    	        	vm.areaManagementGridChildren.dataSource.page(currentPageChildrent - 1);
						} else {	
							vm.areaManagementGridChildren.dataSource.page(currentPageChildrent);
						}
					}
					return ;
				}
				
				// gọi lại openTreeView
				openTreeView()

				
				
    			toastr.success("Xóa  thành công!");
				
				// refresh lại bảng
    			var currentPage = vm.areaManagementGrid.dataSource.page(); // số trang
    			var dataSize = vm.areaManagementGrid.dataSource.data().length; //số lượng đơn vị
    			if (currentPage > 1 && dataSize==1) {
    	        	vm.areaManagementGrid.dataSource.page(currentPage - 1);
				} else {
					vm.areaManagementGrid.dataSource.page(currentPage);
				}
    			
    			var currentPageChildrent = vm.areaManagementGridChildren.dataSource.page();
    			var dataSizeChildrent = vm.areaManagementGridChildren.dataSource.data().length;
    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
    	        	vm.areaManagementGridChildren.dataSource.page(currentPageChildrent - 1);
				} else {
					vm.areaManagementGridChildren.dataSource.page(currentPageChildrent);
				}
    			debugger;
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
			
			vm.areaManagementCreate =data;
			confirm('Bạn có chắc chắn muốn xóa không',function (d){
				startLoading();
			areaManagementService.remove(vm.areaManagementCreate).then(function(result){
				stopLoading();
				
				if(result.error){
					console.log(result.error);
					toastr.error(result.error)
					if(result.error==="Xóa không thành công, đơn vị không tồn tại !"){
						vm.isShow=false;
						if( !vm.isCheckDeleteChildrent){
							var currentPage = vm.areaManagementGrid.dataSource.page();
			    			var dataSize = vm.areaManagementGrid.dataSource.data().length;
			    			if (currentPage > 1&&dataSize==1) {
			    	        	vm.areaManagementGrid.dataSource.page(currentPage - 1);
							} else {
								vm.areaManagementGrid.dataSource.page(currentPage);
							}
						}
		    			
		    			var currentPageChildrent = vm.areaManagementGridChildren.dataSource.page();
		    			var dataSizeChildrent = vm.areaManagementGridChildren.dataSource.data().length;
		    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
		    	        	vm.areaManagementGridChildren.dataSource.page(currentPageChildrent - 1);
						} else {	
							vm.areaManagementGridChildren.dataSource.page(currentPageChildrent);
						}
					}
					return ;
				}
				
				// gọi lại openTreeView
				openTreeView()

				
				
    			toastr.success("Xóa  thành công!");
				vm.isShow=false;
				// xoa ds trực thuộc ko cho load đơn vị cha
			
				if( !vm.isCheckDeleteChildrent){
					var currentPage = vm.areaManagementGrid.dataSource.page();
	    			var dataSize = vm.areaManagementGrid.dataSource.data().length;
	    			if (currentPage > 1&&dataSize==1) {
	    	        	vm.areaManagementGrid.dataSource.page(currentPage - 1);
					} else {
						vm.areaManagementGrid.dataSource.page(currentPage);
					}
				}
    			
    			
    			
    			var currentPageChildrent = vm.areaManagementGridChildren.dataSource.page();
    			var dataSizeChildrent = vm.areaManagementGridChildren.dataSource.data().length;
    			if (currentPageChildrent > 1&&dataSizeChildrent==1) {
    	        	vm.areaManagementGridChildren.dataSource.page(currentPageChildrent - 1);
				} else {
					vm.areaManagementGridChildren.dataSource.page(currentPageChildrent);
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
			// fillDataTableAreaParent.toolbar.template
       vm.showHideColumnGridParent = function (column) {
            if (angular.isUndefined(column.hidden)) {
               vm.areaManagementGrid.hideColumn(column);
            } else if (column.hidden) {
              vm.areaManagementGrid.showColumn(column);
            } else {
               vm.areaManagementGrid.hideColumn(column);
            }
        }
	
		
       // phần ẩn hiên các cột trong grid (table)
		vm.showHideColumnChildrent=function(column){
        	if (angular.isUndefined(column.hidden)) {
        		vm.areaManagementGridChildren.hideColumn(column);
            } else if (column.hidden) {
            	vm.areaManagementGridChildren.showColumn(column);
            } else {
            	vm.areaManagementGridChildren.hideColumn(column);
            }
        	
        	
        }
		
		vm.gridColumnShowHideFilter = function (item) { 
                return item.type==null||item.type !=1; 
            };
    	
    		
    		
    		
    	    // Phần cây đơn vị
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
    		
    		
    		
    		// lấy ra các đơn vị theo areaName (thứ tự cha -con)
    		
    		// k-options = vm.treeViewOptions
         vm.treeViewOptions = {
                dataSource: [],
                dataTextField: "areaName",
                loadOnDemand: false,
                dataBound: function (e) {
                },
            }
         
    		  // Item == 1 đối tượng đơn vị == > lấy hết ra được các đơn vị
    		vm.getTreedata= function(items,parent) {
    			var param=[];
    			items.forEach( (item,index) =>{
    
    				if(item.parentId=== parent){
    					   let row = item;
   	                    row.id = item.id;	
   	                    row.items = vm.getTreedata(items, item.id);
   	                    param.push(row);
    				}
    			})
    			
    			
    			return param;
    			
    			
    			
			}
    	
         // Mở ra cây đơn vị
         // kendo-tree-view="vm.treeView"
		function openTreeView(){
				areaManagementService.getTree().then(function(result) {
				    let data = result;
				    console.log("data",data)
				    
				    // sap xep cay don vi cha - con
				    // HierarchicalDataSource ==> mở rộng thành phần DataSource để tạo mô hình phân cấp trong kendo
				    // kendo-tree-view="vm.treeView"
	             vm.treeView.setDataSource(new kendo.data.HierarchicalDataSource({
	                    data: vm.getTreedata(data, 0)
	                    
	                }));
	            vm.treeView.dataSource.read(); // trả về data (id và areaName)
	            
	            if(vm.ShowOne){
	            	   vm.isCheckDeleteChildrent= true;
	            	   
	            	   // Lấy ra thông tin của đơn vị cha đầu tiên trong cây
//	            	    vm.areaManagementSearch.id=vm.getTreedata(data, 0)[0].id;
	            	   
	            	   for (var i = 0; i < vm.getTreedata(data, 0).length; i++) {
						vm.areaManagementSearch.listId.push(vm.getTreedata(data,0)[i].id)
					}
	            	   
	            	   console.log("vm.areaManagementSearch.listId",vm.areaManagementSearch.listId);
	            	   console.log("dữ liệu tree",vm.getTreedata(data, 0));
	                   var grid =vm.areaManagementGrid;	
	                   
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
	
				
		
	

        // Dùng để tìm kiếm đơn vị trên cây
		vm.doSearchByTree = doSearchByTree;
        function doSearchByTree(dataItem){
        	areaManagementService.getAreaById(dataItem.id).then(function(data) {
        		console.log("dosearchTree",data);
        		
				if(data === null || typeof(data) === "undefined"){
					vm.doSearch();
					openTreeView();
					toastr.error(gettextCatalog.getString("Đơn vị không tồn tại"));
					
					return;
				}else {
					 var treeview = $("#treeview").data("kendoTreeView");
			            // Mở ra danh sách đơn vị con của đơn vị đc chọn
			            treeview.expand(treeview.findByText(dataItem.areaName));
			            
			            
			        // ds trực thuộc ko cho load đơn vị cha
			            vm.isCheckDeleteChildrent= true;
			            
			            
			            vm.areaManagementSearch= {};
			            // load đơn vị Parent lên Ds đơn vị
			            vm.areaManagementSearch.id= dataItem.id;
			            
			
			            var grid =vm.areaManagementGrid;	
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