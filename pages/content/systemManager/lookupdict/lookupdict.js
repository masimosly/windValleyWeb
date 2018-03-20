/**
 * Created by liaoxd on 2017/12/16.
 */
define([
    './custom/widgets/js/yufpOrgTree.js'
], function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var vm=yufp.custom.vue({
            el: "#lookupdictdiv",
            data:function(){
            	var me = this;
            	return{
            		//类别目录url
            		typeUrl:backend.adminService+'/api/adminsmlookuptype/list',
            		//类别表格url
            		typetableUrl:backend.adminService+'/api/adminsmLookup/',
            		//内容url
            		itemUrl:backend.adminService+'/api/adminsmlookupitem/',
            		lookUpCodeUpdate: false,		
            		queryFields: [
                        {placeholder: '类别别名或名称', field: 'lookupName', type: 'input'}/*,
                        {placeholder: '字典类别名称', field: 'lookupName', type: 'input'}*/
        
                    ],
                    queryButtons: [
                        {label: '搜索', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if(valid){
                                var param = { condition: JSON.stringify(model) };
                                me.$refs.filterTable.remoteData(param);                               
                            }
                        }},
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                    ],	
 
                    tableColumns: [
                        { label: '字典类别英文别名', prop: 'lookupCode',  sortable: true, resizable: true },
                        { label: '字典类别名称', prop: 'lookupName'}/*,                                         
                        { label: '最新变更用户', prop: 'lastChgUsr', width: 110 },
                        { label: '最新变更时间', prop: 'lastChgDt', width: 110 }*/

                    ],
                   

                   updateFields: [{
                        columnCount: 1,
                        fields: [                        
                            { field: 'lookupCode', label: '类别英文别名',
                            rules: [{required: true, message: '必填项', trigger: 'blur'},
                            		{max:50, message: '最大长度不超过50个英文字符', trigger: 'blur' }
                            ]},
                            { field: 'lookupName',label: '字典类别名称' ,
                            rules: [{required: true, message: '必填项', trigger: 'blur'},
                            		{max:100, message: '最大长度不超过100个中文字符', trigger: 'blur' }]}/*,
                            { 
                            	field: 'instuId',label: '金融机构',
                            	type: 'custom',is: "yufp-org-tree" ,rules: [{required: true, message: '必填项', trigger: 'blur'}]
                            }*/
                        ]
                    }],
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
                        		model.instuId = me.defaultInstuId;
	                        	me.createFilter(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                        }
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
                        		model.instuId = me.defaultInstuId;
	                        	me.lookuptableUpdateFn(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                        }
                        }}
                        
                    ],
                    lookupTypeFields: [{
                        columnCount: 1,
                        fields: [                        
                            { 
                            	field: 'lookupTypeName', label: '目录名称',
                            	rules: [{required: true, message: '必填项', trigger: 'blur'},
                            			{max:50, message: '最大长度不超过50个中文字符', trigger: 'blur' }]
                            },
                            { 
                            	field: 'upLookupTypeId',label: '上级目录编号' ,readonly:true,
                            	rules: [{required: true, message: '必填项', trigger: 'blur'}]
                            }/*,
                            { 
                           		field: 'instuId',label: '金融机构',
                            	type: 'custom',is: "yufp-org-tree"   ,rules: [{required: true, message: '必填项', trigger: 'blur'}]                   
                        	}    */                  
                        ]
                    }],
                    lookupTypeButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.lkTypeDialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false,op: 'submit', click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
                        		model.instuId = me.defaultInstuId;
	                        	me.saveLookUpType(model);                      	
	                            me.lkTypeDialogVisible = false;  
	                        }
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false,op: 'submit', click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
                        		model.instuId = me.defaultInstuId;
	                        	me.updateLookUpType(model);                      	
	                            me.lkTypeDialogVisible = false;
	                        }
                        }}                  
                    ],
                    
                    queryItemFields: [
                        {placeholder: '字典代码或名称', field: 'lookupItemName', type: 'input'}/*,
                        {placeholder: '字典名称', field: 'lookupItemName', type: 'input'}*/
        
                    ],
                    queryItemButtons: [
                        {label: '搜索', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if(valid){
                                var param = { condition: JSON.stringify(model) };
                                me.$refs.itemTable.remoteData(param);                               
                            }
                        }},
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                    ],	
                     //内容TABLE
                    itemColumns: [
                        { label: '字典代码', prop: 'lookupItemCode',  sortable: true, resizable: true },
                        { label: '字典名称', prop: 'lookupItemName'},                                         
                        { label: '字典备注说明', prop: 'lookupItemComment'}
                    ],
                    lookupItemFields: [{
                        columnCount: 1,
                        fields: [                        
                            { 
                            	field: 'lookupItemCode', label: '字典代码',
                            	rules: [{required: true, message: '必填项', trigger: 'blur'},
                            			{max:50, message: '最大长度不超过50个英文字符', trigger: 'blur' }]
                            },
                            { 
                            	field: 'lookupItemName',label: '字典名称' ,
                            	rules: [{required: true, message: '必填项', trigger: 'blur'},
                            			{max:50, message: '最大长度不超过50个中文字符', trigger: 'blur' }]
                            },
                            { 
                            	field: 'lookupCode',label: '类别英文别名' ,readonly:true,
                            	rules: [{required: true, message: '必填项', trigger: 'blur'}]
                            }/*,
                            { 
                            	field: 'upLookupItemId',label: '上级字典内容编号' ,
                            	rules: [{required: true, message: '必填项', trigger: 'blur'}]
                            }*/
                            ,{ field: 'lookupItemComment', label: '字典备注说明' }
                        ]
                    }],
                    lookupItemButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.lkItemDialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check",op: 'submit', hidden: false, click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
	                        	me.saveLookUpItem(model);                      	
	                            me.lkItemDialogVisible = false;   
	                        }
                        }},
                        {label: '保存', type: 'primary', icon: "check",op: 'submit', hidden: false, click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
	                        	me.updateLookUpItem(model);                      	
	                            me.lkItemDialogVisible = false;
	                        }
                        }}
                        
                    ],
                 	defaultInstuId:'100',
                 	userId: yufp.session.userId,
                    //表单是否显示
                    dialogVisible: false,
                    //表单是否可用
                    formDisabled: false,
                    //类别表单操作状态            
                    viewType: 'DETAIL',
                    //类别目录
                    lktypeviewType: 'DETAIL',
                    //内容
                    lkItemviewType: 'DETAIL',
                    lookupTypeFormDisabled:false,
                    lookupItemFormDisabled:false,
	 
	                styleObj: {height: yufp.custom.viewSize().height + 'px', overflow: 'auto'},
	                height: yufp.custom.viewSize().height - 65,
                    mheight: yufp.custom.viewSize().height - 150,
	                //目录FORM表单
	                lkTypeDialogVisible: false,
	                //内容目录FORM表单
	                lkItemDialogVisible: false,
	                //当前点击目录ID
	                parentTypeId: null,
	                //当前选中目录ID
	                currentTypeId:null,
	                 //当前选中内容目录ID
	                currentItemId:null,
	                //表格类型目录ID不显示
	                lookuptypids:false,
	                idView:false,
	                //类别树过滤
	                filterText: '',
	                //内容树过滤
	                itemText:'',
	                
	                //类别目录表单
	                lookupType: {
	                		lookupTypeId: '',
		                    instuId: '',
		                    lookupTypeName: '',
		                    upLookupTypeId: '',
		                    lastChgUsr: '',
		                    lastChgDt: ''
	                },
	                //内容目录表单
	                lookupItem: {
							lookupItemId:'',
							lookupItemCode:'',
							lookupItemName:'',
							lookupCode:'',
							upLookupItemId:'',
							lookupItemComment:'',
							lastChgUsr:'',
							lastChgDt:''
					},
	                
	                filterGrid: {
	                	//当前类别行
	                	currentRow:null,
	                	//当前内容行
	                	currentItemRow:null,

	                    data: null,                    
	                    total: null,
	                    loading: false,
	                    multipleSelection: '',
	                    //多选类别
	                    selections:[],
	                    paging: {
	                        page: 1,
	                        pageSize: 10
	                    },
	                   //类别TABLE模糊查询表头
	                    query: {
		                    lookupName: '',
		                    lookupCode: '',
		               		lookupTypeId: ''
	                	},
	                	lookup: {
	                		lookupId: '',
	                		lookupTypeId: '',
		                    instuId: '',
		                    lookupName: '',
		                    lastChgUsr: '',
		                    lastChgDt: ''
	                	}
	                },
	                lookuptypetree: {
	                    data: [{
	                        id: 0,
	                        label: '',
	                        children: []
	                    }],
	                    props: {
	                        children: 'children',
	                        label: 'label'
	                    }
	                },
	                itemTable: {
	                    data: [{
	                        id: 0,
	                        label: '',
	                        children: []
	                    }],
	                    props: {
	                        children: 'children',
	                        label: 'label'
	                    }
	                }
	            }
            },
            methods: {
            	startChangeFn: function(val) {
                    this.filterGrid.paging.page = val;
                    this.queryInitFn();
                },
                limitChangeFn: function(val) {
                    this.filterGrid.paging.page = 1;
                    this.filterGrid.paging.pageSize = val;
                    this.queryInitFn();
                },
                //类别目录过滤搜索
                filterNode: function(value, data) {
			        if (!value) return true;
			        return data.label.indexOf(value) !== -1;
			    },
			    //内容目录过滤搜索
                itemNode: function(value, data) {
			        if (!value) return true;
			        return data.label.indexOf(value) !== -1;
			    },             
                 //点击内容目录
                itemClickFn: function(row, event, column) {       	
                	//用于单个修改
                	this.filterGrid.currentItemRow = row;              
                },
                //点击类别目录
                nodeClickFn:function(obj, node, nodeComp) {           
                    this.currentTypeId = node.data.id;

                	//获取数据字典类别TABLE start
                    var me = this
                    me.filterGrid.loading = true
                    var param = {
                        page: me.filterGrid.paging.page,
                        pageSize: me.filterGrid.paging.pageSize,
                        condition: JSON.stringify({
                            lookupTypeId: this.currentTypeId
                        })
                    }
                    //发起请求
                    me.$refs.filterTable.remoteData(param);  
                    //获取数据字典类别TABLE  end
                },
                
                //新增类别目录按钮
               	createLkType:function() {
               		
               		if(this.currentTypeId == null){
                		vm.$message({ message: '请选择目录节点!' })
                		return false;
                	}
               		
               		//挂在当前选中目录下面
               		this.lookupType.upLookupTypeId= this.currentTypeId;
                    this.lkTypeDialogVisible = true;
                 	this.lktypeviewType = 'ADD';
				    this.$nextTick(function () {
                        this.$refs.lookupTypeForm.resetFields();
                        this.$refs.lookupTypeForm.formModel.upLookupTypeId = this.currentTypeId;
                   });
                },
                //修改类别目录按钮
                updateLkType:function() {
                	var lkTypeId = this.currentTypeId;
                	this.lktypeviewType = 'UPDATE';
                	//获取当前目录元素数据BY-ID
                	 yufp.service.request({
		                url: backend.adminService+'/api/adminsmlookuptype/'+lkTypeId,		           
		                method: 'get',
		                data: null,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.lookupType = response.data;                
		                        vm.$nextTick(function () {
                        			this.$refs.lookupTypeForm.formModel = vm.lookupType;
                  			  	});
		                  
		                    } else {
		                        vm.$message({ message: '获取目录元素失败!' })
		                    }
		
		                }
		            });           	
					this.lkTypeDialogVisible = true;  
                },               
                //新增内容目录按钮
               	createLkItem:function() {
               		//挂在当前选中目录下面
               		if(this.filterGrid.currentRow == null){
                 		vm.$message({ message: '请选择类别!' });
                 		return false;
                 	}
               		this.lookupItem.lookupCode = this.filterGrid.currentRow.lookupCode;
                    this.lkItemDialogVisible = true;
                 	this.lkItemviewType = 'ADD';
                    this.$nextTick(function () {
                        this.$refs.lookupItemForm.resetFields();
                        this.$refs.lookupItemForm.formModel.lookupCode = this.filterGrid.currentRow.lookupCode;
                    });
                },
                //修改内容目录按钮
                updateLkItem:function() {
                	if(this.filterGrid.currentItemRow == null){
                		vm.$message({ message: '请选择数据字典内容!' })
                		return false;
                	}
                	
                	//var lkTypeId = this.filterGrid.currentItemRow.lookupItemId;
                	this.lkItemviewType = 'UPDATE';
                	this.$nextTick(function () {
                        this.$refs.lookupItemForm.formModel = this.filterGrid.currentItemRow;
                  	});
                    this.lkItemDialogVisible =true;
                },
                //新增目录保存
                saveLookUpType:function(model) {
                	this.lookupType = model;
                	delete this.lookupType.lookupTypeId
                    yufp.service.request({
		                url: backend.adminService+'/api/adminsmlookuptype/',		           
		                method: 'post',
		                data: this.lookupType,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '保存成功!' })
		                        vm.lkTypeDialogVisible = false;
		                         //刷新树
                    			vm.$refs.lookuptypetree.remoteData();
		                    } else {
		                        vm.$message({ message: '保存失败!' })
		                    }
		                }
		            });		       
                },
                //修改目录保存
                updateLookUpType:function(model) { 
                	this.lookupType = model;
                    yufp.service.request({
		                url: backend.adminService+'/api/adminsmlookuptype/updates',		           
		                method: 'post',
		                data: this.lookupType,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '保存成功!' })
		                        vm.lkTypeDialogVisible = false;
		                         //刷新树
                  				vm.$refs.lookuptypetree.remoteData();
		                    } else {
		                        vm.$message({ message: '保存失败!' })
		                    }
		
		                }
		            });
		           
                },
                //新增内容目录保存
                saveLookUpItem:function(model) {
                	this.lookupItem = model;
                	this.lookupItem.upLookupItemId='';
                	delete this.lookupItem.lookupItemId;
                    yufp.service.request({
		                url: backend.adminService+'/api/adminsmlookupitem/',		           
		                method: 'post',
		                data: this.lookupItem,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '保存成功!' })
		                        vm.lkItemDialogVisible = false;
		                        var param = {
			                        page: 0,
			                        pageSize: 100,
			                        condition: JSON.stringify({
			                            lookupCode: vm.lookupItem.lookupCode
			                        })
			                    }
					             //刷新树
			                    vm.$refs.itemTable.remoteData(param);
		                    } else {
		                        vm.$message({ message: '保存失败!' })
		                    }
		                }
		            });
		            
                },
                //修改内容目录保存
                updateLookUpItem:function(model) {    
                	this.lookupItem = model;
                    yufp.service.request({
		                url: backend.adminService+'/api/adminsmlookupitem/updates',		           
		                method: 'post',
		                data: this.lookupItem,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '保存成功!' })
		                        vm.lkItemDialogVisible = false;
		                        var param = {
			                        page: 0,
			                        pageSize: 100,
			                        condition: JSON.stringify({
			                            lookupCode: vm.lookupItem.lookupCode
			                        })
			                    }
					            //刷新树
			                    vm.$refs.itemTable.remoteData(param);
		                    } else {
		                        vm.$message({ message: '保存失败!' })
		                    }
		
		                }
		            });		            
                },
                //删除类别目录
                deleteLkType:function(){
                	var lookupTypeId = this.currentTypeId;
                	if(lookupTypeId == null){
                		vm.$message({ message: '请选择目录节点!' })
                		return false;
                	}
                	vm.$confirm('确认删除该类别目录以及目录下的类别?', '提示', {
              			confirmButtonText: '确定',
              			cancelButtonText: '取消',
              			type: 'warning'
              		}).then(function() {
						yufp.service.request({
		                url: backend.adminService+'/api/adminsmlookuptype/deletes/'+lookupTypeId,		           
		                method: 'post',
		                data: null,
		                callback: function (code, message, response) {
			                    if (code == '0') {		                        
			                        vm.$message({ message: '删除成功!' })
			                        //刷新树
                   					 vm.$refs.lookuptypetree.remoteData();
                   					 vm.$refs.filterTable.remoteData();
                   					 vm.$refs.itemTable.remoteData();
			                        
			                    } else {
			                        vm.$message({ message: '删除失败!' });
			                    }
			                }
				                	
		            	});
              		});
                },
                //删除内容目录
                deleteLkItem:function(){          	 
                	if(this.filterGrid.currentItemRow == null){
                		vm.$message({ message: '请选择数据字典内容!' })
                		return false;
                	}
                	var lookupItemId = this.filterGrid.currentItemRow.lookupItemId;
                		vm.$confirm('确认删除该字典内容?', '提示', {
              			confirmButtonText: '确定',
              			cancelButtonText: '取消',
              			type: 'warning'
              		}).then(function() {
						yufp.service.request({
		                url: backend.adminService+'/api/adminsmlookupitem/delete/'+lookupItemId,		           
		                method: 'post',
		                data: null,
		                callback: function (code, message, response) {
			                    if (code == '0') {		                        
			                        vm.$message({ message: '删除成功!' })
			                        	//刷新树
			                           var param = {
					                        page: 0,
					                        pageSize: 100,
					                        condition: JSON.stringify({
					                            lookupCode: vm.filterGrid.currentRow.lookupCode
					                        })
					                    }
							            //刷新树
					                    vm.$refs.itemTable.remoteData(param);
			                    } else {
			                        vm.$message({ message: '删除失败!' }) 
			                    }
			                }
				                	
		            	});
              		});
                },
//    ---------------------------------字典类别表格操作 start------------------------------------------
                rowClickFn: function(row, event, column) {       	
                	//用于单个修改
                	this.filterGrid.currentRow = row;
                    //获取内容目录 start
                    var param = {
                        page: 0,
                        pageSize: 100,
                        condition: JSON.stringify({
                            lookupCode: this.filterGrid.currentRow.lookupCode
                        })
                    }
                    vm.$refs.itemTable.remoteData(param);
                    //获取内容目录 end 
                },
                
                //通过typeId初始化查询类别TABLE
                queryInitFn: function() {
                    var me = this;
                    me.filterGrid.loading = true;
                    var param = {
                        page: me.filterGrid.paging.page,
                        pageSize: me.filterGrid.paging.pageSize,                     
                       	condition: JSON.stringify({
                            lookupTypeId: this.currentTypeId
                        })
                    }
                    //发起请求
                    me.$refs.filterTable.remoteData(param);  
                },       
                //编辑按钮
                lookuptableEditFn: function () {	
                	if(vm.filterGrid.currentRow == null){
                		vm.$message({ message: '请选择一条字典类别记录!' });
                		return false;
                	}
	                this.viewType = 'UPDATE';
	                vm.dialogVisible = true;    
                    this.$nextTick(function () {
                    	vm.$refs.datafilterForm.formModel = this.filterGrid.currentRow;
                    });

                },
                //修改字典类别
                lookuptableUpdateFn: function (row) {
                	 this.filterGrid.currentRow = row;
                	 
		             yufp.service.request({
		                url: backend.adminService+'/api/adminsmLookup/updates',		           
		                method: 'post',
		                data: this.filterGrid.currentRow,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '保存成功!' });

		                        vm.queryInitFn();
		                    } else {
		                        vm.$message({ message: '修改失败!' });
		                    }
		
		                }
		            });
               	},
                //增加字典类别
                 addFilterRecord:function(){
                 	if(this.currentTypeId === null){
                 		vm.$message({ message: '请选择目录!' });
                 		return false;
                 	}
             		this.dialogVisible = true;
				    this.viewType = 'ADD';
				    this.$nextTick(function () {
                        this.$refs.datafilterForm.resetFields();
                        this.$refs.datafilterForm.formModel.lookupTypeId = this.currentTypeId;
                   });
				 },
				 
				 //保存新增字典类别
				 createFilter: function (row) {
				 				
				 	this.filterGrid.currentRow = row;			 	
				 	delete this.filterGrid.currentRow.lookupId;
                	yufp.service.request({
		                url: backend.adminService+'/api/adminsmLookup/createvalidate',		           
		                method: 'post',
		                data: this.filterGrid.currentRow,
		                callback: function (code, message, response) {
		                	
		                    if (code == '0') {		
		                    	if (response.code == '2000') {		                        
			                        vm.$message({ message: response.message ,type: 'warning'});
			                      	return false;	                        
		                    	}else{
		                    		vm.$message({ message: '保存成功!' });
		                        	vm.queryInitFn();
		                    	}     		                        
		                    } else {
		                        vm.$message({ message: '保存失败!' });
		                    }
		
		                }
		            });
                },
                //删除数据字典类别
                dataFilterDeleteFn: function (row) {
            	  this.filterGrid.currentRow = row;
            	  vm.$confirm('确认删除该数据字典类别?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function(){
	              			yufp.service.request({
				                url: backend.adminService+'/api/adminsmLookup/delete/'+this.filterGrid.currentRow.lookupId,		           
				                method: 'post',
				                data: null,
				                callback: function (code, message, response) {
				                    if (code == '0') {		                        
				                        vm.$message({ message: '删除成功!' });
				                        vm.queryInitFn();
				                        vm.$refs.itemTable.remoteData();
				                        
				                    } else {
				                        vm.$message({ message: '删除失败!' });
				                    }
				                }
				            });
	              		});
                },
                //批量删除数据字典类别
                dataFiltermultDeleteFn: function () {
                	if(vm.filterGrid.currentRow == null){
                		vm.$message({ message: '请选择一条字典类别记录!' });
                		return false;
                	}
            	 	vm.$confirm('确认删除该字典类别以及类别下的字典内容?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function(){
	              			yufp.service.request({
				                url: backend.adminService+'/api/adminsmLookup/deletes/'+vm.filterGrid.currentRow.lookupId,		           
				                method: 'post',
				                data: '',
				                callback: function (code, message, response) {
				                    if (code == '0') {		                        
				                        vm.$message({ message: '删除成功!' });
				                        vm.queryInitFn();	
				                        vm.$refs.itemTable.remoteData();
				                    } else {
				                        vm.$message({ message: '删除失败!' });
				                    }
				                }
				            });

	              		});
                }
//    ---------------------------------字典类别表格操作 end------------------------------------------
                
            },
            mounted:function () {
                //this.queryMainGridFn();
            },
            watch: {
            	filterText:function(value){
            		vm.$refs.lookuptypetree.filter(value);
            	},
            	/*itemText(value){
            		vm.$refs.itemTable.filter(value);
            	},*/
            	viewType:function(value){
            		 	if (value == 'ADD') {
            		 		this.lookUpCodeUpdate = false;
                            this.updateButtons[1].hidden = false;
                            this.updateButtons[2].hidden = true;
                        } else if (value == 'UPDATE') {
                        	this.lookUpCodeUpdate = true;
                            this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = false;
                        } else if (value == 'DETAIL') {
                            this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = true;
                        }
            	},
            	lktypeviewType:function(value){
            		 	if (value == 'ADD') {
                            this.lookupTypeButtons[1].hidden = false;
                            this.lookupTypeButtons[2].hidden = true;
                        } else if (value == 'UPDATE') {
                            this.lookupTypeButtons[1].hidden = true;
                            this.lookupTypeButtons[2].hidden = false;
                        } else if (value == 'DETAIL') {
                            this.lookupTypeButtons[1].hidden = true;
                            this.lookupTypeButtons[2].hidden = true;
                        }
            	},
            	lkItemviewType:function(value){
            		 	if (value == 'ADD') {
                            this.lookupItemButtons[1].hidden = false;
                            this.lookupItemButtons[2].hidden = true;
                        } else if (value == 'UPDATE') {
                            this.lookupItemButtons[1].hidden = true;
                            this.lookupItemButtons[2].hidden = false;
                        } else if (value == 'DETAIL') {
                            this.lookupItemButtons[1].hidden = true;
                            this.lookupItemButtons[2].hidden = true;
                        }
            	}
		      
		    }

        });
    };

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }

});