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
            //TODO 请替换此id参数
            el: "#sysprop_grid",
            //以m_开头的参数为UI数据不作为业务数据，否则为业务数据
            data: function(){
            	var me = this;
            	return{
            		serviceUrl:backend.adminService+'/api/adminsmprop/',
	            	idView: false,
	                height: yufp.custom.viewSize().height - 140,
	                userId: yufp.session.userId,
	                
	                queryFields: [
                        {placeholder: '参数名', field: 'propName', type: 'input'},
                        {placeholder: '参数描述', field: 'propDesc', type: 'input'}
                        /*{placeholder: '金融机构编号', field: 'instuId', type: 'input'}*/
        
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
                        /*{ label: '参数名', prop: 'propName', width: 200, sortable: true, resizable: true },*/
                        { label: '参数名',
                            prop: 'title',
                            width: 200,
                            sortable: true,
                            resizable: true,
                            template: function () {    
                                return '<template scope="scope">\
                                    <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-row-click\', scope)">{{ scope.row.propName }}</a>\
                                </template>';
                            }
                        },
                        
                        
                        { label: '参数描述', prop: 'propDesc', width: 200 },                  
                        { label: '参数值', prop: 'propValue', width: 250 },
                        { label: '备注', prop: 'propRemark', width: 214},
                       /* { label: '金融机构编号', prop: 'instuId', width: 120},*/
                        { label: '最新变更用户', prop: 'lastChgUsr', width: 130 },
                        { label: '最新变更时间', prop: 'lastChgDt', width: 130 }
                    ],
                    
                    updateFields: [{
                        columnCount: 1,
                        fields: [                        
                            { field: 'propName', label: '参数名',rules: [{required: true, message: '必填项', trigger: 'blur'}]},
                            { field: 'propDesc',label: '参数描述'},
                            { field: 'propValue', label: '参数值',rules: [{required: true, message: '必填项', trigger: 'blur'}]} ,
                            { field: 'propRemark', label: '备注' ,placeholder:'2000个字符以内',  type: 'textarea'}
                        ]
                    }],
                    
                    detailFields:[{
                        columnCount: 1,
                        fields: [                        
                            { field: 'propName', label: '参数名'},
                            { field: 'propDesc',label: '参数描述'},
                            { field: 'propValue', label: '参数值'} ,
                            { field: 'propRemark', label: '备注' ,  type: 'textarea'},
                            { field: 'lastChgUsr',label: '最新变更用户'},
                            { field: 'lastChgDt',label: '最新变更时间'}
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
		                url: backend.adminService+'/api/adminsmprop/updates',		           
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
				 					 	
				 	delete this.filterGrid.currentRow.propId;
                	yufp.service.request({
		                url: backend.adminService+'/api/adminsmprop/',		           
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
	                				ids = filterSelecttions[i].propId;  
	                			}else{
	                				ids = ids + ',' + filterSelecttions[i].propId;
	                			}
	                   			                      			
	                   		}               	
	                	}else{
	                		vm.$message({ message: '请选择需要删除的系统参数!' });	
	                		return false;
	                	}                              
	                	vm.$confirm('确认批量删除该系统参数?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function() {
	              			yufp.service.request({
				                url: backend.adminService+'/api/adminsmprop/deletes/'+ids,		           
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