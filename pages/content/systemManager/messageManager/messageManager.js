/**
 * Created by liaoxd on 2017/11/17.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
       
       	yufp.lookup.reg('MESSAGE_LEVEL,MESSAGE_TYPE');
        //创建virtual filter model
        var vm =  yufp.custom.vue({
            //TODO 请替换此id属性
            el: "#messageManager_grid",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data: function(){
            	var me = this;
            	return{
            		serviceUrl:backend.adminService+'/api/adminsmmessage/',
	            	idView: false,
	                height: yufp.custom.viewSize().height - 140,
	                userId: yufp.session.userId,
	                queryFields: [
                        {placeholder: '信息码', field: 'code', type: 'input'},
                        {placeholder: '提示内容', field: 'message', type: 'input'}
                       
        
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
                        { label: '信息码', prop: 'code', width: 200, sortable: true, resizable: true },
                        { label: '提示内容', prop: 'message', width: 220 },                                         
                        { label: '信息级别', prop: 'messageLevel', width: 250 ,type: 'select', dataCode: 'MESSAGE_LEVEL'},
                        { label: '消息类别', prop: 'messageType', width: 117,type: 'select', dataCode: 'MESSAGE_TYPE'},
                        { label: '所属模块名称', prop: 'funcName', width: 117},
                        { label: '最新变更用户', prop: 'lastChgUsr', width: 110 },
                        { label: '最新变更时间', prop: 'lastChgDt', width: 110 }
                      
                    ],
                    updateFields: [{
                        columnCount: 1,
                        fields: [                        
                            { field: 'code', label: '信息码',rules: [{required: true, message: '必填项', trigger: 'blur'}]},
                            { field: 'message',label: '提示内容',rules: [{required: true, message: '必填项', trigger: 'blur'}] },
                            { field: 'messageLevel', label: '信息级别',type: 'select', dataCode: 'MESSAGE_LEVEL' ,options:[],rules: [{required: true, message: '必填项', trigger: 'blur'}]} ,
                            { field: 'messageType', label: '消息类别',type: 'select', dataCode: 'MESSAGE_TYPE' ,options:[],rules: [{required: true, message: '必填项', trigger: 'blur'}]} ,
                            { field: 'funcName', label: '所属模块名称'} 
                        ]
                    }],
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
                        		me.createFilter(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
                        	}
             
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
	                        	me.dataFliterEditFn(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                        }
                           
                        }} 
                    ],
                    //表单是否显示
                    dialogVisible: false,
                    //表单是否可用
                    formDisabled: false,
                    //表单操作状态
                    viewType: 'DETAIL',
	                
	                filterGrid: {
		               	//系统参数当前行
		                currentRow: null,	             
		                //系统参数多选ID
		                multipleSelection: '',	              
	                    data: null,
	                    subdata:null,
	                    total: null,
	                    loading: true,
	                    subloading:true,
	                    
	                    paging: {
	                        page: 1,
	                        pageSize: 10
	                    },
	                    //系统参数模糊查询表头
	                    query: {
		                    instuId: '',
		                    propDesc: '',
		                    propName: '' 
	                	}
	               
	                } 
               }
            },
            mounted: function(){
            	var me = this;
                yufp.lookup.bind("MESSAGE_LEVEL", function(lookup) {
					    me.updateFields[0].fields[2].options = lookup;
					});
				yufp.lookup.bind("MESSAGE_TYPE", function(lookup) {
					    me.updateFields[0].fields[3].options = lookup;
					});
					
					
            },
            methods: {
                
                rowClickFn: function(selection,row) {
                	this.selections = selection;
                	//用于单个修改
                	this.filterGrid.currentRow = row;
                	if(selection.length > 0){
                		for(var i=0;i<selection.length;i++){
                			//记录多选用于多删
                			if(selection.length == 1){
                				this.filterGrid.multipleSelection = selection[i].messageId;  
                			}else{
                				this.filterGrid.multipleSelection = this.filterGrid.multipleSelection + ',' + selection[i].messageId;
                			}
                   			                      			
                   		}               	
                	}                           
                },
      
                //编辑按钮
                lookuptableEditFn: function () {
                	if(this.$refs.filterTable.selections.length < 1 ){
                		vm.$message({ message: '请选择一条记录修改!' });
                		return false;
                	}
                	if(this.$refs.filterTable.selections.length > 1 ){
                		vm.$message({ message: '只能选择一条记录修改!' });
                		return false;
                	}
                	          	 
                	this.viewType = 'UPDATE';
                	vm.dialogVisible = true;         	 
                	this.$nextTick(function () {
                        yufp.extend(this.$refs.datafilterForm.formModel, this.$refs.filterTable.selections[0]);
                    });
		             
                },
                
                
                //修改系统参数
                dataFliterEditFn: function (row) {
                	 this.filterGrid.currentRow = row ;  
                	 
		             yufp.service.request({
		                url: backend.adminService+'/api/adminsmmessage/updates',		           
		                method: 'post',
		                data: this.filterGrid.currentRow,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '修改成功!' });

		                        vm.$refs.filterTable.remoteData();
		                    } else {
		                        vm.$message({ message: '修改失败!' });
		                    }		
		                }
		            });
                },
                
                //增加系统参数空行
                 addFilterRecord:function(){
				    this.dialogVisible = true;
                 	this.viewType = 'ADD';
				    
				    this.$nextTick(function () {
                        this.$refs.datafilterForm.resetFields();
                    });
  
				 },
				
				 //保存新增系统参数
				 createFilter: function (row) {
				 	this.filterGrid.currentRow = row;
				 					 	
				 	delete this.filterGrid.currentRow.messageId;
                	yufp.service.request({
		                url: backend.adminService+'/api/adminsmmessage/createvalidate',		           
		                method: 'post',
		                data: this.filterGrid.currentRow,
		                callback: function (code, message, response) {
		                    if (code == '0') {	
		                    	if (response.code == '2000') {		                        
			                        vm.$message({ message: response.message ,type: 'warning' });
			                      	return false;	                        
		                    	}else{
			                        vm.$message({ message: '保存成功!' });
			                        vm.$refs.filterTable.remoteData();
			                    }
		                    } else {		                      
		                        vm.$message({ message: '保存失败!' });
		                    }
		
		                }
		            });
                },
               
                //批量删除系统参数
                dataFiltermultDeleteFn: function () {
                		var ids='';
	                	var filterSelecttions = this.$refs.filterTable.selections;  
	                	if(filterSelecttions.length > 0){
	                		for(var i=0;i<filterSelecttions.length;i++){
	                			//记录多选用于多删
	                			if(filterSelecttions.length === 1){
	                				ids = filterSelecttions[i].code;  
	                			}else{
	                				ids = ids + ',' + filterSelecttions[i].code;
	                			}
	                   			                      			
	                   		}               	
	                	}else{
	                		vm.$message({ message: '请选择需要删除的系统消息!' });	
	                		return false;
	                	}
	                	vm.$confirm('确认批量删除系统提示消息配置?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function() {
	              			yufp.service.request({
				                url: backend.adminService+'/api/adminsmmessage/deletes/'+ids,		           
				                method: 'post',
				                data: vm.filterGrid.currentRow,
				                callback: function (code, message, response) {
				                    if (code == '0') {		                        
				                        vm.$message({ message: '删除成功!' });
				                        vm.$refs.filterTable.remoteData();			                        
				                    } else {
				                        //alert('删除失败！');
				                        vm.$message({ message: '删除失败!' });
				                    }
				
				                }
				            });

	              		});
		            
		            
                }
               
                
            },
            filters: {

            },
            watch: {
            	viewType:function(value){
            		 	if (value == 'ADD') {
                            this.updateButtons[1].hidden = false;
                            this.updateButtons[2].hidden = true;
                        } else if (value == 'UPDATE') {
                            this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = false;
                        } else if (value == 'DETAIL') {
                            this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = true;
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