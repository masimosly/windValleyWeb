
define(function (require, exports) {
    var vicarioustypeOptions = [
        { key: '0', value: '默认指定' },
        { key: '1', value: '特殊指定' }
    ]
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('DATA_STS','ZB_BIZ_CATE');
        var vm =  yufp.custom.vue({
            el: "#listWfHumanstates",
            data: function(){
                var me=this;
                var validateBeginTime = function(rule, value, callback){
                    if (value === '') {
                        callback(new Error('请选择开始日期'));
                    } else {
                        var myDate = new Date();
                        var endtime=me.$refs.wfHumanstatesForm.formModel.endtime;
                        var endTime=new Date(endtime);
                        if(value<myDate){
                            callback(new Error('委托开始时间不能早于当前时间'));
                        }else if(value>endTime&&endTime!=''){
                            callback(new Error('委托开始时间不能晚于结束时间'));
                        }else{
                            callback();
                        }
                    }
                };
                var validateEndTime = function(rule, value, callback){
                    if (value === '') {
                        callback(new Error('请选择结束日期'));
                    } else {
                        var begintime=me.$refs.wfHumanstatesForm.formModel.begintime;
                        var endtime=me.$refs.wfHumanstatesForm.formModel.endtime;
                        var beginTime=new Date(begintime);
                        var endTime=new Date(endtime);
                        if(endTime>beginTime){
                            callback();
                        }else{
                            callback(new Error('委托结束时间不能早于开始时间'));
                        }
                    }
                };
                return {
                    height: yufp.custom.viewSize().height - 100,
                    buttons:[
                        {label:'搜索',op:'submit',type: 'primary', icon: "search",show: true, click: function (model, valid) {
                                if (valid) {
                                    var param = {
                                        condition: JSON.stringify(model),
                                        sessionInstuCde:yufp.session.instu.code
                                    };
                                    me.$refs.wfHumanstatesList.remoteData(param);
                                }
                            }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2', show: this.resetButton }
                    ],
                    vicarButtons:[
                        {label:'',op:'submit',type: 'primary', icon: "search",show: true, click: function (model, valid) {
                                if (valid) {
                                    var param = {
                                        condition: JSON.stringify(model),
                                        sessionOrgCode:yufp.session.org.code
                                    };
                                    me.$refs.vicarList.remoteData(param);
                                }
                            }
                        },
                        {label: '', op: 'reset', type: 'primary', icon: 'yx-loop2', show: this.resetButton }
                    ],
                    urls:{
                        dataUrl:backend.echainService+ '/api/joinagent/queryWFHumanstatesList',
                        createSaveUrl:backend.echainService+ '/api/joinagent/addWfHumanstates',
                        updateSaveUrl:backend.echainService+ '/api/joinagent/updateWfHumanstates',
                        vicarUrl:backend.echainService+ '/api/joinagent/querySUsrPopList'
                    },
                    queryFileds: [
                        {placeholder: '被委托人用户名', field: 'vicar', type: 'input'},
                        {placeholder: '被委托人姓名', field: 'vicarname', type: 'input'}
                    ],
                    queryVicarFileds:[
                        {placeholder: '登录用户名', field: 'aloginCode', type: 'input'},
                        {placeholder: '姓名', field: 'auserName', type: 'input'}
                    ],
                    mainGrid:{
                        query: {
                            vicar: '',
                            vicarname: ''
                        },
                        queryVicar:{
                            aloginCode:'',
                            auserName:''
                        }
                    },
                    dataParams: {sessionInstuCde:yufp.session.instu.code},
                    vicarParams:{sessionOrgCode:yufp.session.org.code},
                    tableColumns: [
                        { label: '流水号', prop: 'pkey',hidden: true },
                        { label: 'sysid', prop: 'sysid',hidden: true },
                        { label: '委托人用户名', prop: 'userid',resizable: true },
                        { label: '委托人姓名', prop: 'username',resizable: true},
                        { label: '被委托人用户名', prop: 'vicar', resizable: true},
                        { label: '被委托人姓名', prop: 'vicarname', resizable: true},
                        { label: '开始时间', prop: 'begintime', resizable: true,format:'yyyy-MM-dd'},
                        { label: '结束时间', prop: 'endtime', resizable: true,format:'yyyy-MM-dd'},
                        { label: '申请类型', prop: 'appid', resizable: true ,dataCode: 'ZB_BIZ_CATE'}
                    ],
                    vicarTableColumns:[
                        { label: '登录用户名', prop: 'loginCode',resizable: true},
                        { label: '姓名', prop: 'userName',resizable: true },
                        { label: '状态', prop: 'userSts',resizable: true ,dataCode: 'DATA_STS'}
                    ],
                    dialogFormVisible: false,
                    dialogVisible_vicar:false,
                    dialogStatus: '',
                    formDisabled:false,
                    textMap: {
                        update: '修改',
                        create: '新增',
                        detail:'查看'
                    },
                    title:'被委托人信息',
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'userid', label: '委托人用户名',disabled:true,type: 'input',rules: [
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ] },
                            { field: 'username', label: '委托人姓名',disabled:true,type: 'input',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'vicar', label: '被委托人用户名',icon:'search',disabled:true,click:function(){
                                    me.dialogVisible_vicar = true;
                                },rules: [
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ] },
                            { field: 'vicarname', label: '被委托人姓名',disabled:true,type: 'input',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'begintime', label: '开始时间',type: 'date',rules:[
                                    { validator: validateBeginTime, required: true,trigger: 'blur' }
                                ]
                            },
                            { field: 'endtime', label: '结束时间',type: 'date',rules:[
                                    { validator: validateEndTime, required: true,trigger: 'blur' }
                                ]
                            },
                            { field: 'vicarioustype', label: '委托类型',type: 'select',options: vicarioustypeOptions,rules: [
                                    {required: true, message: '必填项',trigger: 'blur'}] ,change:function(vicarioustype){
                                    var fields = me.updateFields[0].fields;
                                    if(vicarioustype=='0'){//默认指定
                                        fields[7].hidden = true;
                                        fields[7].rules[0].required=false;
                                    }else{//特殊指定
                                        fields[7].hidden = false;
                                        fields[7].rules[0].required=true;
                                    }
                                }
                            },
                            { field: 'appid', label: '申请类型',type: 'select',dataCode: 'ZB_BIZ_CATE',hidden:true,rules:[
                                    {required: true, message: '必填项',trigger: 'blur'}
                                ]},
                            { field: 'pkey', label: '流水号',type: 'input',hidden:true},
                            { field: 'sysid', label: 'sysid',type: 'input',hidden:true}
                        ]},{
                        columnCount: 1,
                        fields: [
                            { field: 'vicarmemo',label: '说明', type:'textarea',rows: 3,rules:[
                                    {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                                ]}
                        ]
                    }],
                }
            },
            methods: {
                openCreateFn: function () {//打开新增页面
                    this.opType('create',false);
                    this.$nextTick(function () {
                        this.$refs.wfHumanstatesForm.resetFields();
                        this.$refs.wfHumanstatesForm.formModel.userid=yufp.session.user.loginCode;
                        this.$refs.wfHumanstatesForm.formModel.username=yufp.session.userName;
                        this.$refs.wfHumanstatesForm.formModel.sysid=yufp.session.instu.code;
                    });
                },
                openEditFn: function (row) {//打开修改页面
                    if (this.$refs.wfHumanstatesList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.wfHumanstatesList.selections[0];
                    if(row.userid==yufp.session.user.loginCode){
                        this.opType('update',false);
                        this.$nextTick(function () {
                            this.$refs.wfHumanstatesForm.resetFields();
                            yufp.extend(this.$refs.wfHumanstatesForm.formModel, row);
                        });
                    }else{
                        this.$message({message: '对不起，您不是委托人，不能进行此操作！!', type: 'warning'});
                    }
                },
                openDetailFn:function(row){//查看详情
                    if (this.$refs.wfHumanstatesList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.wfHumanstatesList.selections[0];
                    this.opType('detail',true);
                    this.$nextTick(function () {
                        this.$refs.wfHumanstatesForm.resetFields();
                        yufp.extend(this.$refs.wfHumanstatesForm.formModel, row);
                    });
                },
                opType:function(type,disabled){
                    this.dialogFormVisible = true;
                    this.dialogStatus = type;
                    this.formDisabled=disabled;
                },

                returnVicar:function(){//选取返回
                    if (this.$refs.vicarList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.vicarList.selections[0];
                    this.$nextTick(function () {
                        if(this.$refs.wfHumanstatesForm.formModel.userid==row.loginCode){
                            this.$message({message: '对不起，委托人与被委托人不能是同一人!', type: 'warning'});
                            this.dialogVisible_vicar = false;
                        }else{
                            this.$refs.wfHumanstatesForm.formModel.vicar=row.loginCode;
                            this.$refs.wfHumanstatesForm.formModel.vicarname=row.userName;
                            this.dialogVisible_vicar = false;
                        }
                    });
                },
                saveCreateFn: function () {//新增保存
                    var me = this;
                    var myform = me.$refs.wfHumanstatesForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.createSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    userId:myform.formModel.userid,
                                    beginTime:myform.formModel.begintime,
                                    endTime:myform.formModel.endtime,
                                    pKey:myform.formModel.pkey,
                                    appId:myform.formModel.appid,
                                    opType:'add'
                                })
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/joinagent/queryWfHumanstatsByTime',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    if(response.data.flag=='0') {
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                me.$message({message: response.data.message, type: response.data.flag});
                                                if (response.data.flag == "success") {
                                                    me.dialogFormVisible = false;
                                                    me.$refs.wfHumanstatesList.remoteData();
                                                }
                                            }
                                        });
                                    }else{
                                        var beginTime=response.data.beginTime;
                                        var endTime=response.data.endTime;
                                        var message='您已存在重叠的委托期限['+beginTime+']-['+endTime+']，请调整！'
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
                    var myform = me.$refs.wfHumanstatesForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.updateSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    userId:myform.formModel.userid,
                                    beginTime:myform.formModel.begintime,
                                    endTime:myform.formModel.endtime,
                                    pKey:myform.formModel.pkey,
                                    appId:myform.formModel.appid,
                                    opType:'update'
                                })
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/joinagent/queryWfHumanstatsByTime',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    if(response.data.flag=='0') {
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                me.$message({message: response.data.message, type: response.data.flag});
                                                if (response.data.flag == "success") {
                                                    me.dialogFormVisible = false;
                                                    me.$refs.wfHumanstatesList.remoteData();
                                                }
                                            }
                                        });
                                    }else{
                                        var beginTime=response.data.beginTime;
                                        var endTime=response.data.endTime;
                                        var message='您已存在重叠的委托期限['+beginTime+']-['+endTime+']，请调整！'
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
                    if (this.$refs.wfHumanstatesList.selections.length>0) {
                        var row =this.$refs.wfHumanstatesList.selections[0];
                        if(row.userid!=yufp.session.user.loginCode){
                            this.$message({message: '对不起，您不是委托人，不能进行此操作！!', type: 'warning'});
                        }else{
                            var id='';
                            for (var i=0;i< this.$refs.wfHumanstatesList.selections.length;i++) {
                                var row=this.$refs.wfHumanstatesList.selections[i];
                                id=id+row.pkey;
                            }
                            var me=this;
                            this.$confirm('是否确认要删除?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                center: true
                            }).then(function(){
                                yufp.service.request({
                                    method: 'POST',
                                    url: backend.echainService+"/api/joinagent/deleteWfHumanstates?pkey="+id,
                                    callback: function (code, message, response) {
                                        me.$message({message: response.data.message, type: response.data.flag});
                                        me.$refs.wfHumanstatesList.remoteData();
                                    }
                                });
                            })
                        }
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