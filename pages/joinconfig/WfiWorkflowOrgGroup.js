
define(function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('ZB_BIZ_CATE');
        var vm =  yufp.custom.vue({
            el: "#WfiWorkflowOrgGroup",
            data: function(){
                var me=this;
                return {
                    height: yufp.custom.viewSize().height - 100,
                    wfSignButtons:[
                        {label:'',op:'submit',type: 'primary', icon: "search",show: true, click: function (model, valid) {
                                if (valid) {
                                    var param = {
                                        condition: JSON.stringify(model),
                                        applType:me.appltype
                                    };
                                    if(me.appltype){
                                        me.$refs.wfSignList.remoteData(param);
                                    }
                                }
                            }
                        },
                        {label: '', op: 'reset', type: 'primary', icon: 'yx-loop2', show: this.resetButton }
                    ],
                    urls:{
                        dataUrl:backend.echainService+ '/api/joinbiz/queryWfiWorkflowOrgByParam',
                        createSaveUrl:backend.echainService+ '/api/joinbiz/addWfiWorkflowOrg',
                        updateSaveUrl:backend.echainService+ '/api/joinbiz/updateWfiWorkflowOrg',
                        wfSignUrl:backend.echainService+ '/api/joinbiz/queryWfiWorkflowBizList',
                        OrgListUrl:backend.echainService+ '/api/joinbiz/queryAllOrgs'
                    },
                    queryFileds: [
                        {placeholder: '机构ID', field: 'orgCode', type: 'input'},
                        {placeholder: '机构名称', field: 'orgName', type: 'input'},
                        {placeholder: '流程名称', field: 'wfname', type: 'input'}
                    ],
                    queryWfSignFileds:[
                        {placeholder: '流程标识', field: 'wfsign', type: 'input'},
                        {placeholder: '流程名称', field: 'wfname', type: 'input'}
                    ],
                    mainGrid:{
                        query: {
                            orgCode: '',
                            orgName: '',
                            wfname: ''
                        },
                        queryWfSign:{
                            wfsign:'',
                            wfname:''
                        }
                    },
                    dataParams: {},
                    appltype:'',
                    wfSignParams:{
                        applType:me.appltype
                    },
                    OrgParams:{sessionInstuCde:yufp.session.instu.code},
                    tableColumns: [
                        { label: '关联ID', prop: 'pkvalue',hidden: true },
                        { label: '机构ID', prop: 'orgCode',resizable: true },
                        { label: '机构名称', prop: 'orgName',resizable: true},
                        { label: '流程标识', prop: 'wfsign',resizable: true },
                        { label: '流程名称', prop: 'wfname',resizable: true},
                        { label: '申请类型', prop: 'applType', resizable: true , dataCode: 'ZB_BIZ_CATE'}
                    ],
                    wfSignTableColumns:[
                        { label: '流程标识', prop: 'wfsign',resizable: true },
                        { label: '流程名称', prop: 'wfname',resizable: true}
                    ],
                    OrgTableColumns:[
                        { label: '机构ID', prop: 'orgCode',resizable: true },
                        { label: '机构名称', prop: 'orgName',resizable: true},
                    ],
                    dialogFormVisible: false,
                    dialogVisible_wfSign:false,
                    dialogVisible_org:false,
                    dialogStatus: '',
                    formDisabled:false,
                    textMap: {
                        update: '修改',
                        creat:'新增',
                        detail:'查看'
                    },
                    title:'流程标识选取',
                    orgTitle:'所属机构选取',
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'orgCode', label: '所属机构ID',icon:'search',disabled:true,click:function(){
                                    me.dialogVisible_org = true;
                                },rules: [
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ] },
                            { field: 'orgName', label: '所属机构名称',disabled:true,type: 'input',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'applType', label: '申请类型',type: 'select',clearable:false,dataCode: 'ZB_BIZ_CATE',
                                change:function (model,val) {
                                    me.appltype=val.applType;
                                    me.$refs.WfiWorkflowOrgForm.formModel.wfsign='';
                                    me.$refs.WfiWorkflowOrgForm.formModel.wfname='';
                                },rules:[
                                    {required: true, message: '必填项',trigger: 'blur'}
                                ]},
                            { field: 'wfsign', label: '流程标识',icon:'search',disabled:true,click:function(){
                                    var param=me.$refs.WfiWorkflowOrgForm.formModel.applType;
                                    if(me.appltype){
                                        me.dialogVisible_wfSign = true;
                                        me.$nextTick(function () {
                                            var params = {
                                                applType:param
                                            };
                                            me.$refs.wfSignList.remoteData(params);
                                        })
                                    }
                                },rules: [
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ] },
                            { field: 'wfname', label: '流程名称',disabled:true,type: 'input',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'pkvalue', label: '关联ID',type: 'input',hidden:true},
                            { field: 'instuCode', label: '金融机构',type: 'input',hidden:true}
                        ]},{
                        columnCount: 1,
                        fields: [
                            { field: 'remark',label: '备注', type:'textarea',rows: 3,rules:[
                                    {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                                ]}
                        ]
                    }],
                }
            },
            methods: {
                openCreateFn: function () {//打开新增页面
                    this.opType('creat',false);
                    this.$nextTick(function () {
                        this.$refs.WfiWorkflowOrgForm.resetFields();
                    });
                },
                openEditFn: function (row) {//打开修改页面
                    if (this.$refs.WfiWorkflowOrgList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.WfiWorkflowOrgList.selections[0];
                    this.opType('update',false);
                    this.$nextTick(function () {
                        this.$refs.WfiWorkflowOrgForm.resetFields();
                        yufp.extend(this.$refs.WfiWorkflowOrgForm.formModel, row);
                        this.$nextTick(function () {
                            this.$refs.WfiWorkflowOrgForm.formModel.wfsign=row.wfsign;
                            this.$refs.WfiWorkflowOrgForm.formModel.wfname=row.wfname;
                        })
                    });

                },
                openDetailFn:function(row){//查看详情
                    if (this.$refs.WfiWorkflowOrgList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.WfiWorkflowOrgList.selections[0];
                    this.opType('detail',true);
                    this.$nextTick(function () {
                        this.$refs.WfiWorkflowOrgForm.resetFields();
                        yufp.extend(this.$refs.WfiWorkflowOrgForm.formModel, row);
                        this.$nextTick(function () {
                            this.$refs.WfiWorkflowOrgForm.formModel.wfsign=row.wfsign;
                            this.$refs.WfiWorkflowOrgForm.formModel.wfname=row.wfname;
                        })
                    });
                },
                opType:function(type,disabled){
                    this.dialogFormVisible = true;
                    this.dialogStatus = type;
                    this.formDisabled=disabled;
                },

                returnWfSign:function(){//选取返回
                    if (this.$refs.wfSignList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.wfSignList.selections[0];
                    this.$nextTick(function () {
                        this.$refs.WfiWorkflowOrgForm.formModel.wfsign=row.wfsign;
                        this.$refs.WfiWorkflowOrgForm.formModel.wfname=row.wfname;
                        this.dialogVisible_wfSign = false;
                    });
                },
                returnOrg:function(){
                    if (this.$refs.OrgList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.OrgList.selections[0];
                    this.$nextTick(function () {
                        this.$refs.WfiWorkflowOrgForm.formModel.orgCode=row.orgCode;
                        this.$refs.WfiWorkflowOrgForm.formModel.orgName=row.orgName;
                        this.dialogVisible_org = false;
                    });
                },
                saveCreateFn: function () {//新增保存
                    var me = this;
                    me.$refs.WfiWorkflowOrgForm.formModel.instuCode=yufp.session.instu.code;
                    var myform = me.$refs.WfiWorkflowOrgForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.createSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    orgCode:myform.formModel.orgCode,
                                    applType:myform.formModel.applType,
                                    wfsign:myform.formModel.wfsign
                                })
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/joinbiz/queryWfiWorkflowOrgByParam',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    if(response.data.length==0) {
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                me.$message({message: response.data.message, type: response.data.flag});
                                                if (response.data.flag == "success") {
                                                    me.dialogFormVisible = false;
                                                    me.$refs.WfiWorkflowOrgList.remoteData();
                                                }
                                            }
                                        });
                                    }else{
                                        var message='根据机构+申请类型+流程标识校验唯一性不通过！'
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
                    var myform = me.$refs.WfiWorkflowOrgForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.updateSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    orgCode:myform.formModel.orgCode,
                                    applType:myform.formModel.applType,
                                    wfsign:myform.formModel.wfsign,
                                    pkvalue:myform.formModel.pkvalue
                                })
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/joinbiz/queryWfiWorkflowOrgByParam',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    var param=myform.formModel.pkvalue;
                                    if(response.data.length==0 ||response.data[0].pkvalue==param) {
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                me.$message({message: response.data.message, type: response.data.flag});
                                                if (response.data.flag == "success") {
                                                    me.dialogFormVisible = false;
                                                    me.$refs.WfiWorkflowOrgList.remoteData();
                                                }
                                            }
                                        });
                                    }else{
                                        var message='根据机构+申请类型+流程标识校验唯一性不通过！'
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
                deleteFn:function(){//删除
                    if (this.$refs.WfiWorkflowOrgList.selections.length>0) {
                        var row =this.$refs.WfiWorkflowOrgList.selections[0];
                        var id='';
                        for (var i=0;i< this.$refs.WfiWorkflowOrgList.selections.length;i++) {
                            var row=this.$refs.WfiWorkflowOrgList.selections[i];
                            id=id+row.pkvalue;
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
                                url: backend.echainService+"/api/joinbiz/deleteWfiWorkflowOrg?pkvalue="+id,
                                callback: function (code, message, response) {
                                    me.$message({message: response.data.message, type: response.data.flag});
                                    me.$refs.WfiWorkflowOrgList.remoteData();
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