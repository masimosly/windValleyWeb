/**
 * Created by liaoxd on 2017/12/17.
 */
define([
    './custom/widgets/js/yufpOrgTree.js',
    './custom/widgets/js/yufpUploadTable.js'
], function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
       	yufp.lookup.reg('PUB_STS,TOP_FLAG,NOTICE_LEVEL');
        //创建virtual Notice model
        var vm =  yufp.custom.vue({
            //TODO 请替换此id属性
            el: "#notice_grid",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data: function(){  
            	var me = this;
            	return {
            		//公告查询URL
            		serviceUrl:backend.adminService+'/api/adminsmnotice/',  
            		//角色列表URL
            		contrUrl:backend.adminService+'/api/adminsmnotice/roles',
            		reciveOptions:[{"key":'org',"value":'机构'},{"key":'role',"value":'角色'}],
	            	idView: false,
	            	
	            	//生成的公告ID
	            	createdNoticeId:'',
	            	
	            	//富文本编辑器附件URL
	            	action: '/api/adminfileuploadinfo/richedituploadfile',
	            	//富文本编辑器文本
	            	content: '',
	            	//富文本操作附件ID传参
	            	busNo:'',
	                height: yufp.custom.viewSize().height - 140,                
	                userId: yufp.session.userId,
	                userName:yufp.session.userName,
	                orgId: yufp.session.org.id,
	                orgName: yufp.session.org.name,
	                //机构树多选参数
	                orgTreeParams: {
	                	needCheckbox:true
	                },
	                
	                
	                //附件列表按钮
	                uploadVisible:true,
	                downloadVisible:true,
	                deleteVisible:true,
	                
	                //弹出窗保存按钮
	                createButton:false,
	                updateButton:false,
	                
	                //初始化查询时，传入接收对象
	                initTableParams:{
	                	condition: JSON.stringify({
	                			reciveOgjId:yufp.session.org.id,
	                			creatorId:yufp.session.userId,
	                			userId:yufp.session.userId,
	                			roles:yufp.session.roles
	                		})
	                },
	                //初始化角色列表	
	               	initRolesTableParams:{
	               		condition: JSON.stringify({
	                			orgIds:''
	                	})
	               		
	               	},
	                	
	               	//初始化附件列表查询时，传入为空
	                initFilesParams:{
	                	condition: JSON.stringify({
	                			busNo:''
	                		})
	                },
	                
	                noticeUpLoadBusNo:{},
	                
	                queryFields: [
                        {placeholder: '公告标题', field: 'noticeTitle', type: 'input'},
                        {placeholder: '有效期开始时间', field: 'beginTime', type: 'date'},
                        {placeholder: '有效期结束时间', field: 'endTime', type: 'date'}
                    ],
                    queryButtons: [
                       {label: '搜索', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if(valid){          
                            	var initParam = {
                            		reciveOgjId:yufp.session.org.id,
		                			creatorId:yufp.session.userId,
		                			userId:yufp.session.userId,
		                			roles:yufp.session.roles
                            	}
                            	yufp.extend(true,model,initParam);
                                var param = { condition: JSON.stringify(model) };
                                me.$refs.noticeTable.remoteData(param);
                            }
                        }},
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                    ],
                    
                    tableColumns: [
                        { label: '发布状态', prop: 'pubSts', width: 100, sortable: true, resizable: true ,type: 'select', dataCode: 'PUB_STS'},
                        { label: '阅读标志', prop: 'readSts', width: 100 , sortable: true},              
                        { label: '公告标题', prop: 'noticeTitle', width: 200 , sortable: true},
                        { label: '重要程度', prop: 'noticeLevel', width: 100 ,type: 'select', dataCode: 'NOTICE_LEVEL', sortable: true},
                        { label: '发布日期', prop: 'pubTime', width: 150 , sortable: true},
                        { label: '发布机构', prop: 'pubOrgName', width: 160 , sortable: true},
                        { label: '发布人', prop: 'pubUserName', width: 164 , sortable: true},
                        { label: '置顶时间至', prop: 'topActiveDate', width: 164 , sortable: true}
                    ],
                    
                    
                    updateFields: [
	                    {
	                        columnCount: 1,
	                        fields: [                        
	                            { 
	                            	field: 'noticeTitle', label: '公告标题',
	                            	rules: [{required: true, message: '必填项', trigger: 'blur'}]
	                            }
	                        ]
	                    },
	                    {
	                        columnCount: 2,
	                        fields: [                        
	                            { 
	                            	field: 'noticeLevel',label: '重要程度' ,type: 'select', dataCode: 'NOTICE_LEVEL',value:'N'
	                            },
	                            {
	                            	field: 'activeDate', label: '有效时间',type:'date'
	                            },
	                            { 
	                            	field: 'isTop',label: '是否置顶' ,type: 'select', dataCode: 'TOP_FLAG',value:'N',rules: [{required: true, message: '必填项', trigger: 'blur'}]
	                            },
	                             {
	                            	field: 'topActiveDate', label: '置顶期至',type:'date'
	                            },
	                            { 
	                            	field: 'reciveOrgId',label: '接收机构',
	                            	params: {
                                        dataId: "orgId",
                                        needCheckbox: true,
                                        checkStrictly:true,
                                        dataParams: {}
                                   	},
	                            	type: 'custom',is: "yufp-org-tree"
	                          	},          
                            	{
	                            	field: 'reciveRoleName', label: '角色',
	                            	icon: 'search',click:function(){
	                            	me.initRolesTableParams = {
					               		condition: JSON.stringify({
					                			orgIds: me.$refs.noticeForm.formModel.reciveOrgId
					                	})	
					               	};
	                            	me.roleDialogVisible = true;
                            	}},
                            	{
	                            	field: 'reciveRoleId', label: '角色ID',
	                            	icon: 'search',click:function(){
	                            	me.roleDialogVisible = true;
                            		},
                            		hidden:true
	                            }
	                        ]
	                    }
                    ],
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", op: 'submit',hidden: true, click: function (model,valid) {
                        	me.$refs.noticeForm.$children[0].validate(function (validate) {
                        		if(validate){
		                            me.createNotice();
	                          	} 
                        	});
                        	
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: true,op: 'submit', click: function (model,valid) {
                        	if(valid){        		
	                            me.dataNoticeEditFn();
	                        }
                           
                        }}
                    ],
                    //角色选择列表
                    contrlTableColumns:[
                        {
                            label: '角色代码',
                            prop: 'roleCode'
                        }, {
                            label: '角色名称',
                            prop: 'roleName'
                        }, {
                            label: '所属机构编号',
                            prop: 'orgId'
                        }, {
                            label: '所属机构名称',
                            prop: 'orgName'
                        }

                    ],
                    
                    //角色选择按钮
                    selectionButton: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.roleDialogVisible = false;
                        }},
                        {label: '确认选择', type: 'primary', icon: "check", hidden: false, click: function (model) {
                        	var values = '';
                        	var names = '';
		                	if(me.$refs.contrlTable.selections.length > 0){
		                		for(var i= 0;i<me.$refs.contrlTable.selections.length;i++){
		                			if(i == 0){
		                				values = me.$refs.contrlTable.selections[i].roleId;
		                				names = me.$refs.contrlTable.selections[i].roleName;
		                			}else{
		                				values = values + ',' + me.$refs.contrlTable.selections[i].roleId;
		                				names = names + ',' +me.$refs.contrlTable.selections[i].roleName
		                			}
		
		                   		}
		                	}
		                	
                        	me.$refs.noticeForm.formModel.reciveRoleId = values;
                        	me.$refs.noticeForm.formModel.reciveRoleName = names;
		                    me.roleDialogVisible = false;
                        }}

                    ],
                    

                        
                    //表单是否显示
                    dialogVisible: false,
                    detaildialogVisible: false,
                    roleDialogVisible:false,
                    //表单是否可用
                    formDisabled: true,
                    //表单操作状态
                    viewType: 'DETAIL',
	                
	                NoticeGrid: {
		               	//权限模板当前行
		                currentRow: null,	
		                //权限模板选择数组
		                selections:[],
	                    data: null,
	                    loading: true,            
	                }
	            }
            },
            mounted: function(){
            	var me = this;
            	
                yufp.lookup.bind("NOTICE_LEVEL", function(lookup) {
					    me.updateFields[1].fields[0].options = lookup;
					});
				yufp.lookup.bind("TOP_FLAG", function(lookup) {
					    me.updateFields[1].fields[2].options = lookup;
					});
            },
            methods: {
                startChangeFn: function(val) {
                    this.NoticeGrid.paging.page = val;
                    this.queryNoticeGridFn();
                },
                limitChangeFn: function(val) {
                    this.NoticeGrid.paging.page = 1;
                    this.NoticeGrid.paging.pageSize = val;
                    this.queryNoticeGridFn();
                },
                rowClickFn: function(selection,row) {
                	//用于单个修改
                	this.NoticeGrid.currentRow = row;                                          
                },                
              
                //修改按钮
                noticetableEditFn: function () {

                	if(this.$refs.noticeTable.selections.length < 1 ){
                		vm.$message({ message: '请选择一条记录修改!' });
                		return false;
                	}
                	if(this.$refs.noticeTable.selections.length > 1 ){
                		vm.$message({ message: '只能选择一条记录修改!' });
                		return false;
                	}
                	this.viewType = 'UPDATE';
                	vm.dialogVisible = true;    
                	
                	var noticeId = '';
                	this.content ='';
                	
                	yufp.service.request({
		                url: backend.adminService+'/api/adminsmnotice/noticeinfo/'+this.$refs.noticeTable.selections[0].noticeId,		           
		                method: 'get',
		                data: null,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$nextTick(function () {     
		                        	//vm.$refs.noticeForm.resetFields();
		                        	vm.$refs.tinymce.disabled = false;
		                        	vm.$refs.noticeForm.resetFn();
			                        //yufp.extend(vm.$refs.noticeForm.formModel, response.data);
			                        vm.$refs.noticeForm.formModel = response.data;
			                        vm.content = response.data.detailcontent;
			                        //window.tinymce.get('tinymceEditor').setContent(vm.content);
			                        //vm.$refs.tinymce.setContent(vm.content);
			                        noticeId = response.data.noticeId;
			                        
			                        //富文本附件操作传参
			                        vm.busNo = noticeId;
			                        
							        //初始化附件列表查询时，传入为空
					                var files = {
					                	condition: JSON.stringify({
					                			busNo:noticeId
					                		})
					                }
				            		yufp.extend(vm.initFilesParams , files);
				            		//获取附件列表
						            vm.$refs.filesTable.queryFn(files); 
						            
						            //设置附件列表组件传入NOTICEID
						            vm.noticeUpLoadBusNo = {
		                        		busNo:response.data.noticeId
		                        	}
			       
			                    });
			                     
		                    } else {
		                        vm.$message({ message: '获取详情失败!' });
		                    }		
		                }
		            });
		            
		        
                },
                
                //角色展示
                tmplShow: function(){
                	this.$nextTick(function () {
                        this.$refs.contrlTable.remoteData();
                   });
                },
                
                //详情按钮
                detailFn: function () {
  
  
                	if(this.$refs.noticeTable.selections.length < 1 ){
                		vm.$message({ message: '请选择一条记录查看!' });
                		return false;
                	}
                	if(this.$refs.noticeTable.selections.length > 1 ){
                		vm.$message({ message: '只能选择一条记录查看!' });
                		return false;
                	}
                	this.viewType = 'DETAIL';
                	vm.dialogVisible = true;    
                	
                	var noticeId = '';
                	
                	yufp.service.request({
		                url: backend.adminService+'/api/adminsmnotice/noticeinfo/'+this.$refs.noticeTable.selections[0].noticeId,		           
		                method: 'get',
		                data: null,
		                callback: function (code, message, response) {
		                    if (code == '0') {		  
		                        vm.$nextTick(function () {     
		                        	//window.tinymce.get('tinymceEditor').getBody().setAttribute('contenteditable', false); 
		                        	//vm.$refs.noticeForm.resetFields();   
		                        	vm.uploadVisible=false;
			                		vm.downloadVisible=true;
			               			vm.deleteVisible=false;
		                        	vm.$refs.tinymce.disabled = true;
		                        	vm.$refs.noticeForm.resetFn();
			                        //yufp.extend(vm.$refs.noticeForm.formModel, response.data);
			                        vm.$refs.noticeForm.formModel = response.data
			                        vm.content = response.data.detailcontent;
			                        noticeId = response.data.noticeId;
			                        //window.tinymce.get('tinymceEditor').setContent(vm.content);
			                        //vm.$refs.tinymce.setContent(vm.content);

							        //初始化附件列表查询时，传入noticeId
					                var files = {
					                	condition: JSON.stringify({
					                			busNo:noticeId
					                		})
					                }
				            		yufp.extend(vm.initFilesParams , files);
				            		//获取附件列表
						            vm.$refs.filesTable.queryFn(files); 
						            
						            //设置附件列表组件传入NOTICEID
						            vm.noticeUpLoadBusNo = {
		                        		busNo:response.data.noticeId
		                        	}
		                        	
		                        	//标为已阅,并刷新公告列表
		                        	vm.readFn();
		                        	vm.$refs.noticeTable.remoteData();
			                    });
			                     
		                    } else {
		                        vm.$message({ message: '获取详情失败!' });
		                    }		
		                }
		            });
		            
		        
                },
                
                //已阅按钮
                readButtonFn:function(){
                	//标为已阅,并刷新公告列表
		            vm.readFn();
		            vm.$refs.noticeTable.remoteData();
                },
                
                //阅读记录
                readFn:function(){
                  	for(var i=0;i<this.$refs.noticeTable.selections.length;i++){               
	                    this.$refs.noticeTable.selections[i].readUserId = this.userId;
                    }
                    yufp.service.request({
		                url: backend.adminService+'/api/adminsmnotice/reads',		           
		                method: 'post',
		                data: JSON.stringify(this.$refs.noticeTable.selections),
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        //vm.$message({ message: '已阅!' });
		                        vm.$refs.noticeTable.remoteData();
		                    } else {
		                        vm.$message({ message: '加载阅读状态失败!' });
		                    }		
		                }
		            });
                	
                },
                
                //发布按钮
                pubNoticeButtonFn:function () {
                	if(this.$refs.noticeTable.selections.length < 1 ){
                		vm.$message({ message: '请选择公告进行发布!' });
                		return false;
                	}
                	this.pubNoticeFn();
                },
                //发布
                pubNoticeFn:function () {
                	//var tempModel = {};
                    //yufp.extend(tempModel, this.$refs.noticeTable.selections[0]);
                    
                    for(var i=0;i<this.$refs.noticeTable.selections.length;i++){               
                    	this.$refs.noticeTable.selections[i].pubSts = 'O';
	                    this.$refs.noticeTable.selections[i].pubOrgId = this.orgId;
	                    this.$refs.noticeTable.selections[i].pubOrgName = this.orgName;
	                    this.$refs.noticeTable.selections[i].pubUserId = this.userId;
	                    this.$refs.noticeTable.selections[i].pubUserName = this.userName;
                    }
                    yufp.service.request({
		                url: backend.adminService+'/api/adminsmnotice/pubnotices',		           
		                method: 'post',
		                data: JSON.stringify(this.$refs.noticeTable.selections),
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '发布成功!' });
		                        vm.$refs.noticeTable.remoteData();
		                    } else {
		                        vm.$message({ message: '发布失败!' });
		                    }		
		                }
		            });
		             
                },
                
                
                //修改保存
                dataNoticeEditFn: function () {
                	 
                	 if(vm.$refs.noticeForm.formModel.reciveRoleName ==''){
                	 	vm.$refs.noticeForm.formModel.reciveRoleId = '';
                	 }
                	 
		             yufp.service.request({
		                url: backend.adminService+'/api/adminsmnotice/updates',		           
		                method: 'post',
		                data: vm.$refs.noticeForm.formModel,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '修改成功!' });

		                        vm.$refs.noticeTable.remoteData();
		                    } else {
		                        vm.$message({ message: '修改失败!' });
		                    }		
		                }
		            });
                },
                
                //新增按钮
                addNoticeRecord:function(){
                	this.dialogVisible = true;
                	
                	
                	//初始化生成的ID
                	this.createdNoticeId = '';
                	//初始化富文本
                	
                	this.content = '';
                	//初始化附件列表参数
                	this.initFilesParams = {
                		condition: JSON.stringify({
					        busNo:''
					    })
                	};           
              
                 	this.viewType = 'ADD';
                 	this.$nextTick(function () {
                 		vm.content = '';
                 		vm.$refs.tinymce.disabled = false;
                        vm.$refs.noticeForm.resetFn();
                        //初始化空附件列表
						vm.$refs.filesTable.queryFn(); 
                    });
				   
                    
                    //生成UUID
                    yufp.service.request({
		                url: backend.adminService+'/api/adminsmnotice/createNoticeId',		           
		                method: 'get',
		                data: null,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                       	vm.createdNoticeId =response.data;
		                       	
		                       	//富文本附件操作传参
			                    vm.busNo = vm.createdNoticeId;
		                       	
		                        //设置附件列表组件传入NOTICEID
		                        vm.noticeUpLoadBusNo = {
		                        	busNo:vm.createdNoticeId
		                        };
		                        //初始化附件列表查询时，传入为空
					            var files = {
					                condition: JSON.stringify({
					                	busNo:vm.createdNoticeId
					                })
					            };
				            	yufp.extend(vm.initFilesParams , files);
				            	//获取附件列表
						        vm.$refs.filesTable.queryFn(); 
		                    } else {
		                       	vm.$message({ message: '生成公告ID失败!' });
		                    }
		
		                }
		            });

				 },
				
				 //保存新增
				 createNotice: function () {
				 	var model = this.$refs.noticeForm.formModel;
				 	model.content = vm.content;
                    model.pubSts = 'C';
                    model.creatorId = this.userId;
                    model.creatorName = this.userName;
                    model.noticeId = this.createdNoticeId;
                                   
				 					 	
                	yufp.service.request({
		                url: backend.adminService+'/api/adminsmnotice/createinfo',		           
		                method: 'post',
		                data: model,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        
		                        vm.$message({ message: '保存成功!' });
		                        //vm.dialogVisible = false;
		                        vm.$refs.noticeTable.remoteData();
		                        
		                    } else {
		                       	vm.$message({ message: '保存失败!' });
		                    }
		
		                }
		            });
                },
               
                //批量删除
                dataNoticemultDeleteFn: function () {
	                	var ids='';
	                	var NoticeSelecttions = this.$refs.noticeTable.selections;  
	                	if(NoticeSelecttions.length > 0){
	                		for(var i=0;i<NoticeSelecttions.length;i++){
	                			//记录多选用于多删
	                			if(NoticeSelecttions.length === 1){
	                				ids = NoticeSelecttions[i].noticeId;  
	                			}else{
	                				ids = ids + ',' + NoticeSelecttions[i].noticeId;
	                			}
	                   			                      			
	                   		}               	
	                	}else{
	                		vm.$message({ message: '请选择需要删除的公告!' });	
	                		return false;
	                	}
	                	vm.$confirm('确认批量删除系统公告?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function() {
	              			yufp.service.request({
				                url: backend.adminService+'/api/adminsmnotice/deletes/'+ids,		           
				                method: 'post',
				                data: null,
				                callback: function (code, message, response) {
				                    if (code == '0') {		
				                    	vm.$message({ message: '删除成功!' });			                    	
										vm.$refs.noticeTable.remoteData();
				                    } else {
				                    	vm.$message({ message: '删除失败!' });	
				                    }
				
				                }
				            });

	              		});
		            
		            
                }
               
                
            },
            watch: {
            	viewType:function(value){
            		 	if (value == 'ADD') {
            		 		 //附件列表按钮
	                		this.uploadVisible=true;
			                this.downloadVisible=true;
			                this.deleteVisible=true;
			                this.updateButtons[1].hidden = false;
                            this.updateButtons[2].hidden = true;
							this.formDisabled = false;
                        } else if (value == 'UPDATE') {
                      		this.uploadVisible=true;
			                this.downloadVisible=true;
			                this.deleteVisible=true;
			                this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = false;
                            this.formDisabled = false;
                            
                        } else if (value == 'DETAIL') {
                    		this.uploadVisible=false;
			                this.downloadVisible=true;
			                this.deleteVisible=false;
			                this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = true;
                            this.formDisabled = true;
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