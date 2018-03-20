
define(function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('ZB_BIZ_CATE');
        var vm =  yufp.custom.vue({
            el: "#WfTaskpoolList",
            data: function(){
                var me=this;
                return {
                    height: yufp.custom.viewSize().height - 100,
                    WfTaskPoolButtons:[
                        {label:'',op:'submit',type: 'primary', icon: "search",show: true, click: function (model, valid) {
                                if (valid) {
                                    var param = {
                                        condition: JSON.stringify(model),
                                        sessionInstuCde:yufp.session.instu.code
                                    };
                                    if(me.appltype){
                                        me.$refs.WfTaskPoolList.remoteData(param);
                                    }
                                }
                            }
                        },
                        {label: '', op: 'reset', type: 'primary', icon: 'yx-loop2', show: this.resetButton }
                    ],
                    DutyButtons:[
                        {label:'',op:'submit',type: 'primary', icon: "search",show: true, click: function (model, valid) {
                                if (valid) {
                                    var param = {
                                        condition: JSON.stringify(model),
                                        sessionOrgCode:yufp.session.org.code
                                    };
                                    me.$refs.DutyList.remoteData(param);
                                }
                            }
                        },
                        {label: '', op: 'reset', type: 'primary', icon: 'yx-loop2', show: this.resetButton }
                    ],
                    urls:{
                        dataUrl:backend.echainService+ '/api/jointaskpool/queryWfTaskpoolList',
                        createSaveUrl:backend.echainService+ '/api/jointaskpool/addWfTaskpool',
                        updateSaveUrl:backend.echainService+ '/api/jointaskpool/updateWfTaskpool',
                        DutyUrl:backend.echainService+ '/api/jointaskpool/queryAllDutysQry'
                    },
                    queryFileds: [
                        {placeholder: '项目池编号', field: 'tpid', type: 'input'},
                        {placeholder: '项目池名称', field: 'tpname', type: 'input'}
                    ],
                    queryDutyFileds:[
                        {placeholder: '岗位码', field: 'dutyCde', type: 'input'},
                        {placeholder: '岗位名称', field: 'dutyName', type: 'input'}
                    ],
                    mainGrid:{
                        query: {
                            tpid: '',
                            tpname: ''
                        },
                        queryDuty:{
                            dutyCde:'',
                            dutyName:''
                        }
                    },
                    dataParams: {sessionInstuCde:yufp.session.instu.code},
                    tpId:'',
                    checkbox:true,
                    DutyParams:{sessionOrgCode:yufp.session.org.code},
                    tableColumns: [
                        { label: '项目池编号', prop: 'tpid',resizable: true },
                        { label: '项目池名称', prop: 'tpname',resizable: true},
                        { label: '描述', prop: 'tpdsc',resizable: true },
                        { label: '系统ID', prop: 'sysid',resizable: true}
                    ],
                    DutyTableColumns:[
                        { label: '岗位码', prop: 'dutyCde',resizable: true },
                        { label: '岗位名称', prop: 'dutyName',resizable: true}
                    ],
                    dialogFormVisible: false,
                    dialogVisible_duty:false,
                    dialogStatus: '',
                    formDisabled:false,
                    textMap: {
                        update: '修改',
                        creat:'新增',
                        detail:'查看'
                    },
                    DutyTitle:'关联岗位',
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'tpid', label: '项目池编号',type:'input',rules: [
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ] },
                            { field: 'tpname', label: '项目池名称',type: 'input',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            {field: 'sysid', label: '',type: 'input',hidden:true}
                        ]},{
                        columnCount: 1,
                        fields: [
                            { field: 'tpdsc',label: '描述', type:'textarea',rows: 1,rules:[
                                    {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                                ]}
                        ]
                    }],
                }
            },
            methods: {
                openDutyFn:function(){//打开关联岗位页面
                    if (this.$refs.WfTaskPoolList.selections.length!==1){
                        this.$message({message: '请选择一条项目池记录!', type: 'warning'});
                        return false;
                    }
                    this.dialogVisible_duty = true;
                    var row =this.$refs.WfTaskPoolList.selections[0];
                    var me=this;
                    this.$nextTick(function () {
                        var param = {
                            condition: JSON.stringify({
                                tpid:row.tpid
                            })
                        };
                        yufp.service.request({
                            method: 'GET',
                            url: backend.echainService+'/api/jointaskpool/queryTaskpoolConfigList',
                            data: param,
                            callback: function (code, message, response) {
                                var users = response.data;
                                for(var i=0;i<users.length;i++){
                                    me.$refs.DutyList.data.filter(function (item) {
                                      if (item.dutyCde === users[i].relatedCode) {
                                          me.$refs.DutyList.toggleRowSelection(item);
                                      }
                                    });
                                }
                            }
                        });
                    })
                },
                openCreateFn: function () {//打开新增页面
                    this.opType('creat',false);
                    this.$nextTick(function () {
                        this.$refs.WfTaskPoolForm.resetFields();
                    });
                },
                openEditFn: function (row) {//打开修改页面
                    if (this.$refs.WfTaskPoolList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.WfTaskPoolList.selections[0];
                    this.tpId=row.tpid;
                    this.opType('update',false);
                    this.$nextTick(function () {
                        this.$refs.WfTaskPoolForm.resetFields();
                        yufp.extend(this.$refs.WfTaskPoolForm.formModel, row);
                    });

                },
                openDetailFn:function(row){//查看详情
                    if (this.$refs.WfTaskPoolList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.WfTaskPoolList.selections[0];
                    this.opType('detail',true);
                    this.$nextTick(function () {
                        this.$refs.WfTaskPoolForm.resetFields();
                        yufp.extend(this.$refs.WfTaskPoolForm.formModel, row);
                    });
                },
                opType:function(type,disabled){
                    this.dialogFormVisible = true;
                    this.dialogStatus = type;
                    this.formDisabled=disabled;
                },
                saveCreateFn: function () {//新增保存
                    var me = this;
                    var myform = me.$refs.WfTaskPoolForm;
                    myform.formModel.sysid=yufp.session.instu.code;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.createSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    tpid:myform.formModel.tpid
                                }),
                                sessionInstuCde:yufp.session.instu.code
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/jointaskpool/queryWfTaskpoolList',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    if(response.data.length==0) {
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                if (response.data == true) {
                                                    me.dialogFormVisible = false;
                                                    me.$message({message: '新增成功', type: 'success'});
                                                    me.$refs.WfTaskPoolList.remoteData();
                                                }else{
                                                    me.$message({message: '新增失败', type: 'error'});
                                                }
                                            }
                                        });
                                    }else{
                                        var message='项目池编号不能重复，请重新输入！'
                                        me.$message({message: message, type: 'warning'});
                                    }
                                }
                            });
                        }else {
                            me.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    })

                },
                saveEditFn:function(){//修改保存
                    var me = this;
                    var myform = me.$refs.WfTaskPoolForm;
                    myform.formModel.sysid=yufp.session.instu.code;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.updateSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    tpid:myform.formModel.tpid
                                }),
                                sessionInstuCde:yufp.session.instu.code
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/jointaskpool/queryWfTaskpoolList',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    if(me.tpId==myform.formModel.tpid){//如果tpid的值没有改变则直接修改
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                if (response.data==true) {
                                                    me.dialogFormVisible = false;
                                                    me.$message({message: '修改成功', type: 'success'});
                                                    me.$refs.WfTaskPoolList.remoteData();
                                                }else{
                                                    me.$message({message: '修改失败', type: 'error'});
                                                }
                                            }
                                        });
                                    }else{
                                        if(response.data.length==0) {//1.如果tpid改变并且通过唯一性验证
                                            yufp.service.request({//2.则先将原数据删除
                                                url: backend.echainService+'/api/jointaskpool/deleteWfTaskpool?tpid='+me.tpId,
                                                method: 'POST',
                                                callback: function (code, message, response) {
                                                    if(response.data==true){
                                                        yufp.service.request({//3.然后再添加
                                                            url: me.urls.createSaveUrl,
                                                            data: comitData,
                                                            method: 'POST',
                                                            callback: function (code, message, response) {
                                                                if (response.data == true) {
                                                                    me.dialogFormVisible = false;
                                                                    me.$message({message: '修改成功', type: 'success'});
                                                                    me.$refs.WfTaskPoolList.remoteData();
                                                                }else{
                                                                    me.$message({message: '修改失败', type: 'error'});
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }else{
                                            var message='会签策略编号不能重复，请重新输入！'
                                            me.$message({message: message, type: 'warning'});
                                        }
                                    }
                                }
                            });
                        }else {
                            me.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    })
                },
                deleteFn:function(){//删除
                    if (this.$refs.WfTaskPoolList.selections.length>0) {
                        var row =this.$refs.WfTaskPoolList.selections[0];
                        var id='';
                        for (var i=0;i< this.$refs.WfTaskPoolList.selections.length;i++) {
                            var row=this.$refs.WfTaskPoolList.selections[i];
                            id=id+row.tpid;
                        }
                        var me=this;
                        this.$confirm('您确定需要删除该条记录吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                            yufp.service.request({
                                method: 'POST',
                                url: backend.echainService+"/api/jointaskpool/deleteWfTaskpool?tpid="+id,
                                callback: function (code, message, response) {
                                    if (response.data==true) {
                                        me.$message({message: '删除成功', type: 'success'});
                                        me.$refs.WfTaskPoolList.remoteData();
                                    }else{
                                        me.$message({message: '删除失败', type: 'error'});
                                    }
                                }
                            });
                        })
                    } else {
                        this.$message({message: '请先选择要删除的数据', type: 'warning'});
                        return false;
                    }
                },
                saveDuty:function(){
                    var me=this;
                    if (this.$refs.DutyList.selections.length<1){
                        this.$message({message: '请至少选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var list=this.$refs.DutyList.selections;
                    var commit=[];
                    var taskpool =this.$refs.WfTaskPoolList.selections[0];
                    for(var i=0;i<list.length;i++){
                        var data={
                            tpid:taskpool.tpid,
                            relatedCode:list[i].dutyCde,
                            relatedType:'G'
                        };
                        commit.push(data);
                    }
                    yufp.service.request({
                        url: backend.echainService+"/api/jointaskpool/addWfTaskpoolConfig",
                        data: JSON.stringify(commit),
                        method: 'POST',
                        callback: function (code, message, response) {
                            me.$message({message: response.data.message, type: response.data.flag});
                            if (response.data.flag == "success") {
                                me.$message({message: response.data.message, type: response.data.flag});
                                me.dialogVisible_duty = false;
                            }
                        }
                    });
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