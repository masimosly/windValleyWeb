/**
 * Created by liaoxd on 2017/12/17.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {

        //创建virtual filter model
        var vm =  yufp.custom.vue({
            //TODO 请替换此id属性
            el: "#dataauthtmpl_grid",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data: function(){
            	var me = this;
            	return {
            		//数据模板URL
            		serviceUrl:backend.adminService+'/api/adminsmdataauthtmpl/',
            		//控制点URL
            		contrUrl:backend.adminService+'/api/adminsmrescontr/',
	            	idView: false,
	                height: yufp.custom.viewSize().height - 140,

	                userId: yufp.session.userId,


	                queryFields: [
                        {placeholder: '模版名', field: 'authTmplName', type: 'input'},
                        {placeholder: 'SQL名称', field: 'sqlName', type: 'input'}

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
                        { label: '模版名', prop: 'authTmplName', width: 250, sortable: true, resizable: true },
                        { label: 'SQL占位符名称', prop: 'sqlName', width: 250 },
                        { label: "优先级", prop: 'priority', width: 150},
                        { label: '数据权限SQL条件', prop: 'sqlString', width: 300 },
                        { label: '最新变更用户', prop: 'lastChgUsr', width: 160 },
                        { label: '最新变更时间', prop: 'lastChgDt', width: 164 }

                    ],
                    contrlTableColumns:[
                        { label: '控制点ID', prop: 'contrId', width: 200, sortable: true, resizable: true },
                        { label: '控制点代码', prop: 'contrCode', width: 200 },
                        { label: '控制点名称', prop: 'contrName', width: 250 }

                    ],


                    updateFields: [{
                        columnCount: 1,
                        fields: [
                            {
                            	field: 'authTmplName', label: '模版名',
                            	rules: [{required: true, message: '必填项', trigger: 'blur'},
                            			{max:50, message: '最大长度不超过16个中文字符', trigger: 'blur' }]
                            },
                            {
                            	field: 'sqlName',label: 'SQL占位符名称' ,
                            	rules: [{required: true, message: '必填项', trigger: 'blur'},
                            			{max:50, message: '最大长度不超过50个中文字符', trigger: 'blur' }]
                            }/*,
                            {
                            	field: 'contrInclude', label: '可用的控制点记录编号',
                            	rules: [{required: true, message: '必填项', trigger: 'blur'}],
                            	icon: 'search',click:function(){
                            	me.tmplDialogVisible = true;
                            	}}        */
                           	,
                            {
                                field: 'priority', label: '优先级',
                                rules:[{message:"请输入数字",validator:yufp.validator.number}]
                             },
                           	{
		                        field: 'sqlString', label: '数据SQL条件',
		                        rules: [{required: true, message: '必填项', trigger: 'blur'}]
                   			 }
                        ]
                    }],
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", op: 'submit',hidden: false, click: function (model,valid) {
                        	if(valid){
                        		model.contrInclude = '*';
                        		model.lastChgUsr = me.userId;
	                        	me.createFilter(model);
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
                          	}

                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false,op: 'submit', click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
	                        	me.dataFliterEditFn(model);
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                        }

                        }}

                    ],
                    selectionButton: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.tmplDialogVisible = false;
                        }},
                        {label: '确认选择', type: 'primary', icon: "check", hidden: false, click: function (model) {
		                    me.$refs.datafilterForm.formModel.contrInclude = me.filterGrid.contrlSelection;
		                    me.tmplDialogVisible = false;
                        }}

                    ],
                    //表单是否显示
                    dialogVisible: false,
                    //表单是否可用
                    formDisabled: false,
                    //表单操作状态
                    viewType: 'DETAIL',
                    //可用控制点
                    tmplDialogVisible: false,

	                filterGrid: {
		               	//权限模板当前行
		                currentRow: null,
		                //权限模板选择数组
		                selections:[],
		                //权限模板多选ID
		                multipleSelection: '',
		                //控制点多选ID
		                contrlSelection: '',
	                    data: null,

	                    total: null,
	                    loading: true,
	                    subloading:true,

	                    paging: {
	                        page: 1,
	                        pageSize: 10
	                    },
	                    //系统参数模糊查询表头
	                    query: {
		                    authTmplName: '',
		                    sqlName: ''
	                	}

	                }
	            }
            },
            mounted: function(){
            },
            methods: {
                startChangeFn: function(val) {
                    this.filterGrid.paging.page = val;
                    this.queryfilterGridFn();
                },
                limitChangeFn: function(val) {
                    this.filterGrid.paging.page = 1;
                    this.filterGrid.paging.pageSize = val;
                    this.queryfilterGridFn();
                },
                rowClickFn: function(selection,row) {
                	//用于单个修改
                	this.filterGrid.currentRow = row;
                },

                //控制功能点多选择
                contrlSelete: function(selection,row) {
                	var selections = '';
                	if(selection.length > 0){
                		for(var i=0;i<selection.length;i++){
                			//记录多选用于控制功能点选择
                			if(i == 0){
                				selections = selection[i].contrId;
                			}else{
                				selections = selections + ',' + selection[i].contrId;
                			}

                   		}
                	}
                	this.filterGrid.contrlSelection = selections;
                },

                //控制功能点展示
                tmplShow: function(){
                	this.$nextTick(function () {
                        this.$refs.contrlTable.remoteData();
                   });
                },

                //修改按钮
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


                //修改保存
                dataFliterEditFn: function (row) {

		             yufp.service.request({
		                url: backend.adminService+'/api/adminsmdataauthtmpl/updates',
		                method: 'post',
		                data: row,
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

                //新增按钮
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

				 	delete this.filterGrid.currentRow.authTmplId;
                	yufp.service.request({
		                url: backend.adminService+'/api/adminsmdataauthtmpl/',
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

                //批量删除模板
                dataFiltermultDeleteFn: function () {
	                	var ids='';
	                	var filterSelecttions = this.$refs.filterTable.selections;
	                	if(filterSelecttions.length > 0){
	                		for(var i=0;i<filterSelecttions.length;i++){
	                			//记录多选用于多删
	                			if(filterSelecttions.length === 1){
	                				ids = filterSelecttions[i].authTmplId;
	                			}else{
	                				ids = ids + ',' + filterSelecttions[i].authTmplId;
	                			}

	                   		}
	                	}else{
	                		vm.$message({ message: '请选择需要删除的模版!' });
	                		return false;
	                	}
	                	vm.$confirm('确认批量删除数据权限模板?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function() {
	              			yufp.service.request({
				                url: backend.adminService+'/api/adminsmdataauthtmpl/deletes/'+ids,
				                method: 'post',
				                data: null,
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
                dateFilter: function(d) {
                    return d
                }
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