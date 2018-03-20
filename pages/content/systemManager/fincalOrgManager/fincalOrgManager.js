/**
 * @Authoer: hujun
 * @Description: 金融机构管理
 * @Date 2017/12/5 10:41
 * @Modified By:
 *
*/
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        //注册该功能要用到的数据字典
        yufp.lookup.reg("DATA_STS",'SYS_TYPE');
        //创建virtual model
        var vm;
        vm = yufp.custom.vue({
            el: "#fincalOrg",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data:function() {
                var me=this;
                return {
                    height: yufp.custom.viewSize().height - 150,
					createButton:!yufp.session.checkCtrl('addFincalOrg'),//新增按钮控制
					editButton:!yufp.session.checkCtrl('editFincalOrg'),//修改按钮控制
					deleteButton:!yufp.session.checkCtrl('deleteFincalOrg'),//删除按钮控制
					useButton:!yufp.session.checkCtrl('useFincalOrg'),//启用按钮控制
					unuseButton:!yufp.session.checkCtrl('unuseFincalOrg'),//停用按钮控制
                    queryFileds: [
                        {placeholder: '金融机构代码', field: 'instuCde', type: 'input'},
                        {placeholder: '金融机构名称', field: 'instuName', type: 'input'},
                        {placeholder: '状态', field: 'instuSts', type: 'select', dataCode: 'DATA_STS'}
                    ],
                    mainGrid:{
                        query: {
                            sysId: '',
                            instuCde: '',
                            instuName: '',
                            instuSts: ''
                        },
                        height: yufp.custom.viewSize().height - 220,
                        checkbox: true,
                        dataUrl: backend.adminService+'/api/adminsminstu/querypage',
                        paging: {
                            page: 1,
                            size: 10
                        },
                        currentRow: null,
                        tableColumns: [
                         //   { label: '编号', prop: 'instuId' , width: 230},
                            { label: '金融机构名称', prop: 'instuName', resizable: true, template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.instuName }}</a>\
                            </template>';
                            } },
                            { label: '金融机构代码', prop: 'instuCde',resizable: true },
                            { label: '状态', prop: 'instuSts',resizable: true, dataCode: 'DATA_STS'},
                            { label: '进入日期', prop: 'joinDt',type:'date', resizable: true},
                            { label: '最新变更用户', prop: 'userName', resizable: true},
                            { label: '最新变更时间', prop: 'lastChgDt', type:'date',  resizable: true}
                        ]
                    },
                    

                    updateFields: [{
                        columnCount: 2,
                        fields: [
//                          { field: 'sysId', label: '所属逻辑系统',type: 'select', dataCode: 'SYS_TYPE',rules: [
//                              {required: true, message: '必填项', trigger: 'change'}
//                          ] },
                            { field: 'instuCde', label: '金融机构代码',rules:[
                                {required: true, message: '必填项', trigger: 'blur'},
                                {max: 10, message: '最大长度不超过10个字符', trigger: 'blur' }
                            ]},
                            { field: 'instuName',label: '金融机构名称', rules:[
                                {required: true, message: '必填项', trigger: 'blur'},
                                {max: 100, message: '最大长度不超过50个汉字', trigger: 'blur' }
                            ]},
                            { field: 'instuSts', label: '状态' , type: 'select',dataCode: 'DATA_STS',disabled:true }
                            ]
                    }],
                    updateOtherFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'joinDt', label: '进入日期',type: 'date',format:'yyyy-MM-dd' },
                            { field: 'zipCde', label: '邮编', rules:[
                                {validator: yufp.validator.postcode,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                            { field: 'contUsr',label: '联系人' ,rules:[
                           		 {max: 100, message: '最大长度不超过50个汉字', trigger: 'blur' }
                            ]},
                            { field: 'contTel', label: '联系电话', rules:[
                                {validator: yufp.validator.mobile,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                            { field: 'userName',label: '最新变更用户' },
                            { field: 'lastChgDt',label: '最新变更时间' }
                        ]
                    },{
                        columnCount: 1,
                        fields: [
                            { field: 'instuAddr', label: '地址', type: 'textarea', rows: 1,rules:[
                            	{max: 200, message: '最大长度不超过100个汉字', trigger: 'blur' }
                            ] }
                        ]
                    }],
                    dialogFormVisible: false,
                    dialogStatus: '',
                    formDisabled:false,
                    nowRow:null,
                    dialogDisabled: true,
                    activeName: ['1'],//默认显示name为1的
                    textMap: {
                        update: '修改',
                        detail: '详情',
                        create: '新增'
                    }
                }
            },
            mounted: function () {
                this.queryFn()
            },
            methods: {
                queryFn: function () {
                    var me = this;
                    me.$refs.infotable.remoteData();
                },
                openCreateFn: function () {
                    this.opType('create',false,['1','2']);
						this.updateFields[0].fields[0].readonly=false;
 						this.updateOtherFields[0].fields[4].hidden=true;
 						this.updateOtherFields[0].fields[5].hidden=true;
                    this.$nextTick(function () {
                        this.$refs.form.resetFields();
                        this.$refs.otherForm.resetFields();
                        this.$refs.form.formModel.instuSts='W';
                        
                    });

                },
                openDetailFn: function (row) {
                    this.opType('detail',true,['1','2']);
                    this.updateOtherFields[0].fields[4].hidden=false;
 					this.updateOtherFields[0].fields[5].hidden=false;
                    this.$nextTick(function () {
                        this.$refs.form.resetFields();
                        this.$refs.otherForm.resetFields();
                        yufp.extend(this.$refs.form.formModel, row.row);
                        yufp.extend(this.$refs.otherForm.formModel, row.row);
                       

                    });
                },
                openEditFn: function () {
                    if (this.$refs.infotable.selections.length!==1){
                        this.$message({message: '请选着一条数据!', type: 'warning'});
                        return false;
                    }
                    var row=this.$refs.infotable.selections[0];
                    if ( row.instuSts === 'A') {
                        this.$message({message: '只能选着停用和待启用的数据', type: 'warning'});
                        return;
                    }
                    this.opType('update',false,['1','2']);
                    this.updateFields[0].fields[0].readonly=true;
 					this.updateOtherFields[0].fields[4].hidden=true;
 					this.updateOtherFields[0].fields[5].hidden=true;
                    this.$nextTick(function () {
                        this.$refs.form.resetFields();
                        this.$refs.otherForm.resetFields();
                        yufp.extend(this.$refs.form.formModel, row);
                        yufp.extend(this.$refs.otherForm.formModel, row);
                        
                    });
                },
                opType:function(type,disabled,active){
                    
                    this.dialogFormVisible = true;
                    this.dialogStatus = type;
                    this.activeName=active;//显示哪一块
                    this.formDisabled=disabled;

                },
                saveCreateFn: function () {
                    var vue=this;
                    var form = vue.$refs.form, otherForm = vue.$refs.otherForm;
                    var formFlag=true;
                    form.validate(function (valid) {
                        formFlag=valid;
                    });
                    if (formFlag) {
                            var comitData = {
                                contTel: null,
                                contUsr: null,
                                instuAddr: null,
                                joinDt: null,
                                zipCde: null};
                            delete form.formModel.instuId;
                            form.formModel.sysId=yufp.session.logicSys.id;
                            yufp.extend(comitData, form.formModel);
                            comitData.joinDt= otherForm.formModel.joinDt;
                            comitData.zipCde=otherForm.formModel.zipCde;
                            comitData.contUsr=otherForm.formModel.contUsr;
                            comitData.contTel=otherForm.formModel.contTel;
                            comitData.instuAddr=otherForm.formModel.instuAddr;
                            comitData.lastChgUsr=yufp.session.userId;
                            comitData.sysId=yufp.session.logicSys.id;
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsminstu/insertinfo",
                                data: comitData,
                                callback: function (code, message, response) {
                                	if(response.data.code=='2'){
                                    	 vue.$message({message: response.data.message,type: 'warning'});
                                    }else{
                                    	vue.dialogFormVisible = false;
                                    	vue.$message({message: '数据保存成功！'});
                                    	vue.queryFn();
                                    }
                                    
                                }
                            });

                    }else {
                            this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                    }

                },
                saveEditFn:function() {

                    var me=this;
                    var form = me.$refs.form, otherForm = me.$refs.otherForm;
                    var formFlag=true;
                    form.validate(function (valid) {
                        formFlag=valid;
                    });
                    if (formFlag) {
                        var comitData = {
                            contTel: null,
                            contUsr: null,
                            instuAddr: null,
                            joinDt: null,
                            zipCde: null};
                            yufp.extend(comitData, form.formModel);
                            comitData.joinDt= otherForm.formModel.joinDt;
                            comitData.zipCde=otherForm.formModel.zipCde;
                            comitData.contUsr=otherForm.formModel.contUsr;
                            comitData.contTel=otherForm.formModel.contTel;
                            comitData.instuAddr=otherForm.formModel.instuAddr;
                            comitData.lastChgUsr=yufp.session.userId;
                            comitData.sysId=yufp.session.logicSys.id;
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsminstu/update",
                                data: comitData,
                                callback: function (code, message, response) {
                                    me.dialogFormVisible = false;
                                    me.$message({message: '数据保存成功！'});
                                    me.queryFn();


                                }
                            });

                    }else {
                            this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                    }

                },
                useFn: function () {//启用
                    if (this.$refs.infotable.selections.length>0) {
                        var id='';
                        for (var i=0;i< this.$refs.infotable.selections.length;i++)
                        {
                            var row=this.$refs.infotable.selections[i];
                            if(row.instuSts!=='A'){
                                id=id+','+row.instuId
                            }else {
                                this.$message({message: '只能选择停用或者待生效的数据', type: 'warning'});
                                return false;
                            }
                        }
                        var vue=this;
                         this.$confirm('此操作将启用该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                        	
		                    yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService+"/api/adminsminstu/usebatch?ids="+id+'&lastChgUsr='+yufp.session.userId,
	                            callback: function (code, message, response) {
	                                vue.$message({message: '数据操作成功！'});
	                                vue.queryFn()
	                            }
	                        });
						})
                       

                    } else {
                        this.$message({message: '请先选择要生效的数据', type: 'warning'});
                        return;
                    }

                },
                unUseFn: function () {//停用
                    if (this.$refs.infotable.selections.length>0) {
                        var id='';
                        for (var i=0;i< this.$refs.infotable.selections.length;i++)
                        {
                            var row=this.$refs.infotable.selections[i];
                            if(row.instuSts==='A'){
                                id=id+','+row.instuId
                            }else {
                                this.$message({message: '只能选择生效的数据', type: 'warning'});
                                return false;
                            }
                        }

                        var vue=this;
                          this.$confirm('此操作将停用该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
	                        yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService+"/api/adminsminstu/unusebatch?ids="+id+'&lastChgUsr='+yufp.session.userId,
	                            callback: function (code, message, response) {
	                                vue.$message({message: '数据操作成功！'});
	                                vue.queryFn()
	                            }
	                        });
						})
                    } else {
                        this.$message({message: '请先选择要失效的数据', type: 'warning'});
                        return false;
                    }

                },
                deletestFn: function () {//删除
                    
                    if (this.$refs.infotable.selections.length>0) {
                        var id='';
                        for (var i=0;i< this.$refs.infotable.selections.length;i++)
                        {
                            var row=this.$refs.infotable.selections[i];
                            if(row.instuSts!=='A'){
                                id=id+','+row.instuId
                            }else {
                                this.$message({message: '只能删除失效或者待生效的数据', type: 'warning'});
                                return false;
                            }
                        }
                        var vue=this;
                        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsminstu/deletebatch?ids="+id,
                                callback: function (code, message, response) {
                                    vue.$message({message: response.message});
                                    vue.queryFn()
                                }
                            });
                        })

                    } else {
                        this.$message({message: '请先选择要删除的数据', type: 'warning'});
                        return false;
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