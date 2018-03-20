/**
 * Created by liaoxd on 2017/12/17.
 */
define([
    './custom/widgets/js/yufpOrgTree.js'
], function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
       
        //创建virtual filter model
        var vm =  yufp.custom.vue({
            //TODO 请替换此id参数这个id 需要和html 里面那个id 一致
            el: "#usermng",
            //以m_开头的参数为UI数据不作为业务数据，否则为业务数据
            data: function(){
            	var me = this;
            	return{
            		serviceUrl:backend.adminService+'/api/usermanage/',
	            	idView: false,
	                height: yufp.custom.viewSize().height - 140,
	                userId: yufp.session.userId,
	                
	                queryFields: [
                        {placeholder: '用户名', field: 'username', type: 'input'},
                        {placeholder: '类型', field: 'type', type: 'input'}
        
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
                        { label: '用户名',
                            prop: 'title',
                            width: 200,
                            sortable: true,
                            resizable: true,
                            template: function () {    
                                return '<template scope="scope">\
                                    <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-row-click\', scope)">{{ scope.row.username }}</a>\
                                </template>';
                            }
                        },
                        
                        
                        { label: '密码', prop: 'password', width: 200 },                  
                        { label: '角色', prop: 'role', width: 250 },
                        { label: '用户类型', prop: 'type', width: 214},
                        { label: '权限', prop: 'certificate', width: 130 }
                    ],
                    
                    updateFields: [{
                        columnCount: 1,
                        fields: [                        
                            { field: 'username', label: '用户名',rules: [{required: true, message: '必填项', trigger: 'blur'}]},
                            { field: 'password',label: '密码'},
                            { field: 'type', label: '用户类型',rules: [{required: true, message: '必填项', trigger: 'blur'}]}
                        ]
                    }],
                    
                    detailFields:[{
                        columnCount: 1,
                        fields: [                        
                            { field: 'username', label: '用户名'},
                            { field: 'password',label: '密码'},
                            { field: 'type', label: '用户类型'}
                        ]
                    }],
                    
                    
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
                        		alert("add");
	                        	me.createFilter(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                       	}
                           
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
                        		alert("update");
                        		model.lastChgUsr = me.userId;
	                        	me.dataFliterEditFn(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                        }
                           
                        }}
                        
                    ],
                    //表单是否显示
                    dialogVisible: false,
                    //详情表单
                    detaildialogVisible :false,
                    //表单是否可用
                    formDisabled: false,
                    //表单操作状态
                    viewType: 'DETAIL',
                    //表单多选
	                selections:[],
	                defaultInstuId:'100',
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
            },
            methods: {
              
                rowClickFn: function(selection,row) {

                	this.selections = selection;
                	//用于单个修改
                	this.filterGrid.currentRow = row;              
                }, 
                detailFn:function(scope){
          	 
                	this.viewType = 'DETAIL';
                	this.detaildialogVisible = true;
                	
                	this.$nextTick(function () {
                        this.$refs.detailForm.formModel = scope.row;
                  	});
                	
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
		                url: backend.adminService+'/api/userupdate',		           
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
				
				 //保存新增用户
				 createFilter: function (row) {
				 	this.filterGrid.currentRow = row;
                	yufp.service.request({
		                url: backend.adminService+'/api/useradd',		           
		                method: 'post',
		                data: this.filterGrid.currentRow,
		                callback: function (code, message, response) {
		                    if (code == '0') {		
				                vm.$message({ message: '保存成功!' });	
		                        vm.$refs.filterTable.remoteData();
		                    } else {
		                    	vm.$message({ message: '保存失败!' });	
		                    }
		
		                }
		            });
                },

                //批量删除
                dataFiltermultDeleteFn: function () {
                		var ids='';
	                	var filterSelecttions = this.$refs.filterTable.selections;  
	                	if(filterSelecttions.length > 0){
	                		for(var i=0;i<filterSelecttions.length;i++){
	                			//记录多选用于多删
	                			if(filterSelecttions.length === 1){
	                				ids = filterSelecttions[i].username;  
	                			}else{
	                				ids = ids + ',' + filterSelecttions[i].username;
	                			}
	                   			                      			
	                   		}               	
	                	}else{
	                		vm.$message({ message: '请选择需要删除的用户!' });	
	                		return false;
	                	}                              
	                	vm.$confirm('确认批量删除用户?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function() {
	              			yufp.service.request({
				                url: backend.adminService+'/api/userdel/deletes/'+ids,		           
				                method: 'post',
				                data: vm.filterGrid.currentRow,
				                callback: function (code, message, response) {
				                    if (code == '0') {
				                    	vm.$message({ message: '删除成功!' });	
				                        vm.$refs.filterTable.remoteData();		                        
				                    } else {
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
                            this.detaildialogVisible = false;
                        } else if (value == 'UPDATE') {
                            this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = false;
                            this.detaildialogVisible = false;

                        } else if (value == 'DETAIL') {
                         	this.detaildialogVisible = true;
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