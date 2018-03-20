/**
 * @Description: 数据权限管理
 * @Date 2017/12/23 
 * @Authoer: weimei
 * @Modified By:
 */
define(function (require, exports) {
	exports.ready = function (hashCode, data, cite) {
		var param={};
		var vm = yufp.custom.vue({
			el:"#dataAuthManage",
			data:function(){
				var me = this;
				return{
					viewType: 'DETAIL',
                    viewTitle: yufp.lookup.find('CRUD_TYPE', false),
                    height:yufp.custom.viewSize().height-20,
                    dialogVisible:false,
                    formDisabled:false,
                    isChildNode:false,
                    contrId:'',
                    addFlag:false,
                    tmplDialogVisible:false,
                    authTmplId:'',
                    createCheck:!yufp.session.checkCtrl('add'), //新增按钮控制
					modifyCheck:!yufp.session.checkCtrl('modify'), //修改按钮控制
					deleteCheck:!yufp.session.checkCtrl('delete'), //删除按钮控制
                    treeUrl:backend.adminService+"/api/adminsmdataauth/treequery",
                    dataAuthUrl:backend.adminService+"/api/adminsmdataauth/getdataauth",
                    tmplUrl:backend.adminService+"/api/adminsmdataauth/authtmplquery",
					dataQueryFields:[
                		{placeholder: '数据权限模板', field: 'authTmplName', type: 'input'},
                		{placeholder: '数据权限SQL条件', field: 'sqlString', type: 'input'}
                	],
                	tmplQueryFields:[
                		{placeholder: '数据权限模板', field: 'authTmplName', type: 'input'}
                	],
                	dataQueryButtons:[
                		{label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if(valid){
                                var param = { condition: JSON.stringify(model)};
                                me.$refs.dataTable.remoteData(param);
                            }
                        }},
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                	],
                	tmplQueryButtons:[
                		{label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if(valid){
                    			if(me.addFlag){
                    				param = {
            							condition: JSON.stringify({
                               				contrId: me.contrId?me.contrId:null,
                               				authTmplName:model.authTmplName?model.authTmplName:null
                        				})
            						};
                    			}else{
                    				param = {
            							condition: JSON.stringify({
                               				contrId: me.$refs.dataTable.selections[0].contrId?me.$refs.dataTable.selections[0].contrId:null,
                               				authTmplName:model.authTmplName?model.authTmplName:null
                        				})
            						};
                    			}
                                me.$refs.tmplTable.remoteData(param);
                            }
                        }},
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                	],
                	dataTableColumns:[
                		{ label: '数据权限模板', prop: 'authTmplName', sortable: true, resizable: true},
                		{ label: '数据权限SQL条件', prop: 'sqlString',  width:500,sortable: true, resizable: true},
                		{ label:'最近变更用户',prop:'lastChgName',sortable: true, resizable: true},
                		{ label:'最近变更时间',prop:'lastChgDt',sortable: true, resizable: true}
                	],
                	tmplTableColumns:[
                		{ label: '数据权限模板', prop: 'authTmplName', width: 403, sortable: true, resizable: true}
                	],
                	dataFields:[
                    	{
                    	columnCount:1,
                    	fields: [
                    		{ field: 'authTmplName', label: '数据权限模板',readonly:true,rows:3,focus:function(event){
                    			me.tmplDialogVisible = true;
                    			me.$nextTick(function(){
                    				if(me.addFlag){
                    					param = {
            								condition: JSON.stringify({
                               					contrId: me.contrId?me.contrId:null
                        					})
            							};
                    				}else{
                    					param = {
            								condition: JSON.stringify({
                               					contrId: me.$refs.dataTable.selections[0].contrId?me.$refs.dataTable.selections[0].contrId:null
                        					})
            							};
                    				}
            						me.$refs.tmplTable.remoteData(param);
            					});
                    		},rules:[{ required: true, message: '必填项', trigger:'blur'}]
                    		}
                        ]
                    }],
                    dataFormButtons:[
                    	{label: '取消', type: 'primary', icon: "yx-undo2", hidden: false,click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false,op:'submit',click: function (model) {
                        	me.saveCreateFn();
                       	 }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false,op:'submit',click: function (model) {
                       		me.saveEditFn();
                        }}
                    ]
				}
			},
			methods:{
				//左侧树节点点击事件,点击控制点节点查询关联数据权限模板信息
				nodeClickFn:function(nodeData, node, self){
					var _this = this;
					_this.isChildNode = false;
					if(node.level=='3'){
						_this.isChildNode = true;
						_this.contrId = nodeData.id;
                   		var param = {
	                      condition: JSON.stringify({
                              contrId: _this.contrId?_this.contrId:null
                        	})
	                    };
                   	    _this.$refs.dataTable.remoteData(param);
					}
				},
				//操作状态选择
				switchStatus: function (viewType, editable) {
                    this.viewType = viewType;
                    this.dialogVisible = true;
                    this.formDisabled = !editable;
                    this.dataFormButtons[0].hidden = !editable;
                    if(viewType=='ADD'){
                        this.dataFormButtons[1].hidden = !editable;
                        this.dataFormButtons[2].hidden = editable;
                    }else if(viewType=='EDIT'){
                        this.dataFormButtons[1].hidden = editable;
                        this.dataFormButtons[2].hidden = !editable;
                    }
                },
                //新增
				dataAddFn:function(){
					if(this.isChildNode==false){
						this.$message({message: '请先选择控制点节点', type: 'warning'})
                        return;
					}
            		this.switchStatus('ADD',true);
            		this.addFlag = true;
            		this.$refs.dataTable.clearSelection();
            		this.$nextTick(function(){
            			this.$refs.dataForm.resetFields();
            		});
				},
				createFn:function(){
					var _this = this;
					_this.$refs.dataForm.formModel.contrId = _this.contrId;
		            _this.$refs.dataForm.formModel.lastChgUsr = yufp.session.userId;
				    _this.$refs.dataForm.validate(function (valid){
		                if(valid){
		                    yufp.service.request({
			                    method: 'POST',
			                    url: backend.adminService+"/api/adminsmdataauth/createdataauth",
			                    data: _this.$refs.dataForm.formModel,
			                    callback: function (code, message, response) {
			                        _this.dialogVisible = false;
			                        _this.addFlag = false;
			                        _this.$message({message: '数据保存成功！'});
			                        var param = {
			                            condition: JSON.stringify({
		                          			contrId: _this.contrId?_this.contrId:null
		                        		})
			                        };
			                        _this.$refs.dataTable.remoteData(param);
			                        _this.authTmplId = '';
			                    }
		                    });
		                }else{
		                    _this.$message({message: '请检查输入项是否合法', type: 'warning'});
		                    return false;
		                }
            		});
				},
				saveCreateFn:function(){
					var _this = this;
	    	 		delete _this.$refs.dataForm.formModel.dataAuthId;
	    	 		if(_this.authTmplId.indexOf(",")!= -1){
	    	 			var authTmplIds = _this.authTmplId.split(",");
	    	 			for(var j=0;j<authTmplIds.length;j++){
	    	 				_this.$refs.dataForm.formModel.authTmplId = authTmplIds[j];
	    	 				_this.createFn();
	    	 			}
	    	 		}else{
	    	 			_this.$refs.dataForm.formModel.authTmplId = _this.authTmplId;
	    	 			_this.createFn();
	    	 		}
				},
				//修改
				modifyFn:function(){
					if (this.$refs.dataTable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
            		if (this.$refs.dataTable.selections.length > 1) {
                        this.$message({message: '请选择一条记录', type: 'warning'})
                        return;
                    }
            		this.switchStatus("EDIT",true);
            		this.$nextTick(function () {
                        yufp.extend(this.$refs.dataForm.formModel, this.$refs.dataTable.selections[0]);
                    });
				},
				saveEditFn:function(){
				    var _this = this;
				    if(_this.authTmplId==''||_this.authTmplId==undefined){
				    	_this.authTmplId = _this.$refs.dataTable.selections[0].authTmplId;
				    }else{
				    	if(_this.authTmplId.indexOf(",")!= -1){
					    	_this.$message({message: '修改时只能选择一个数据权限模板', type: 'warning'})
	                        return;
				    	}
				    }
            		_this.$refs.dataForm.validate(function (valid){
                     	_this.$refs.dataForm.formModel.authTmplId = _this.authTmplId;
                     	_this.$refs.dataForm.formModel.lastChgUsr = yufp.session.userId;
                        if(valid){
                            yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService+"/api/adminsmdataauth/edtidataauth",
	                            data: _this.$refs.dataForm.formModel,
	                            callback: function (code, message, response) {
	                                _this.dialogVisible = false;
	                                _this.$message({message: '数据保存成功！'});
	                                var param = {
	                                    condition: JSON.stringify({
                          				    contrId: _this.contrId?_this.contrId:null
                        				})
	                                };
	                            	_this.$refs.dataTable.remoteData(param);
	                           		_this.authTmplId = '';
	                            }
                            });
                        }else{
                            _this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
            		});
				},
				//删除
				dataDeleteFn:function(){
					if (this.$refs.dataTable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
            		var _this=this;
            		if (_this.$refs.dataTable.selections) {
            			var ids = '';
                        for (var i = 0; i < _this.$refs.dataTable.selections.length; i++) {
                            ids = ids + ',' + _this.$refs.dataTable.selections[i].authId;
                        }
						_this.$confirm('删除数据将同时删除其授权数据,确定删除?', '提示', {
								    confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(function(){
									yufp.service.request({
                           			method: 'POST',
                            		url: backend.adminService+"/api/adminsmdataauth/deletedataauth/"+ids,
                            		callback: function (code, message, response) {
                              			 _this.$message({message: '数据删除成功！'});
                              			 var param = {
	                                        condition: JSON.stringify({
	                                          contrId: _this.contrId?_this.contrId:null
                        					})
	                                    };
                                	    _this.$refs.dataTable.remoteData(param);
                         		    }
                                });
     				 			})
                   		  }
				},
				//选择可用数据权限模板
				getTmpl:function(){
					if (this.$refs.tmplTable.selections.length>0){
						var tmpl = this.$refs.tmplTable.selections;
						var authTmplName = '';
						var authTmplId = '';
						for(var n=0;n<tmpl.length;n++){
							authTmplName = authTmplName+','+tmpl[n].authTmplName;
							authTmplId = authTmplId+','+tmpl[n].authTmplId;
						}
						this.$refs.dataForm.formModel.authTmplName = authTmplName.substr(1);
                   		this.authTmplId = authTmplId.substr(1);
					}
                    this.tmplDialogVisible = false;
				},
				//左侧树节点类型图标
				renderContent:function() {
	    	 		var createElement=arguments[0];
                    var type = arguments[1].data.nodeType;
                    return createElement('span',[
                            createElement('span',{attrs:{class:'yu-treeMenuType'+type}},type),
                            createElement('span',arguments[1].node.label)
                        ]
                    );
                }
			}
		});
	}
});
