
define(function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('WF_SIGNCONF_STATE');
        var vm =  yufp.custom.vue({
            el: "#WfiSignConfList",
            data: function(){
                var me=this;
                return {
                    height: yufp.custom.viewSize().height - 100,
                    urls:{
                        dataUrl:backend.echainService+ '/api/joinsign/queryWfiSignConfList',
                        createSaveUrl:backend.echainService+ '/api/joinsign/addWfiSignConf',
                        updateSaveUrl:backend.echainService+ '/api/joinsign/updateWfiSignConf',
                        deleteSaveUrl:backend.echainService+ '/api/joinsign/deleteWfiSignConf'
                    },
                    queryFileds: [
                        {placeholder: '会签策略ID', field: 'signId', type: 'input'},
                        {placeholder: '会签策略名', field: 'signName', type: 'input'}
                    ],
                    mainGrid:{
                        query: {
                            signId: '',
                            signName: ''
                        }
                    },
                    dataParams: {},
                    signParam:'',
                    tableColumns: [
                        { label: '会签策略ID', prop: 'signId',resizable: true },
                        { label: '会签策略名', prop: 'signName',resizable: true},
                        { label: '会签策略描述', prop: 'signDesc',resizable: true },
                        { label: '会签策略实现', prop: 'signClass',resizable: true },
                        { label: '会签策略状态', prop: 'signState',resizable: true,dataCode:'WF_SIGNCONF_STATE'}
                    ],
                    dialogFormVisible: false,
                    dialogStatus: '',
                    formDisabled:false,
                    textMap: {
                        update: '修改',
                        creat:'新增',
                        detail:'查看'
                    },
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'signId', label: '会签策略ID',type:'input',rules: [
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ] },
                            { field: 'signName', label: '会签策略名',type: 'input',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'signState', label: '会签策略状态',type: 'select',dataCode:'WF_SIGNCONF_STATE',rules: [
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ] }
                        ]},{
                        columnCount: 1,
                        fields: [
                            { field: 'signClass',label: '会签策略实现', type:'textarea',rows: 1,rules:[
                                    {max: 100, message: '最大长度不超过200个字符', trigger: 'blur' }
                                ]},
                            { field: 'signDesc',label: '会签策略描述', type:'textarea',rows: 1,rules:[
                                    {max: 100, message: '最大长度不超过200个字符', trigger: 'blur' }
                                ]}
                        ]
                    }],
                }
            },
            methods: {
                openCreateFn: function () {//打开新增页面
                    this.opType('creat',false);
                    this.$nextTick(function () {
                        this.$refs.WfiSignConfForm.resetFields();
                    });
                },
                openEditFn: function (row) {//打开修改页面
                    if (this.$refs.WfiSignconfList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.WfiSignconfList.selections[0];
                    this.signParam=row.signId;
                    this.opType('update',false);
                    this.$nextTick(function () {
                        this.$refs.WfiSignConfForm.resetFields();
                        yufp.extend(this.$refs.WfiSignConfForm.formModel, row);
                    });

                },
                openDetailFn:function(row){//查看详情
                    if (this.$refs.WfiSignconfList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.WfiSignconfList.selections[0];
                    this.opType('detail',true);
                    this.$nextTick(function () {
                        this.$refs.WfiSignConfForm.resetFields();
                        yufp.extend(this.$refs.WfiSignConfForm.formModel, row);
                    });
                },
                opType:function(type,disabled){
                    this.dialogFormVisible = true;
                    this.dialogStatus = type;
                    this.formDisabled=disabled;
                },
                saveCreateFn: function () {//新增保存
                    var me = this;
                    var myform = me.$refs.WfiSignConfForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.createSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    signId:myform.formModel.signId
                                })
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/joinsign/queryWfiSignConfList',
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
                                                    me.$refs.WfiSignconfList.remoteData();
                                                }
                                            }
                                        });
                                    }else{
                                        var message='会签策略编号不能重复，请重新输入！'
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
                    var myform = me.$refs.WfiSignConfForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            var saveUrl = me.urls.updateSaveUrl;
                            var params = {
                                condition:JSON.stringify({
                                    signId:myform.formModel.signId
                                })
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/joinsign/queryWfiSignConfList',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    if(me.signParam==myform.formModel.signId){//如果signId的值没有改变则直接修改
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                me.$message({message: response.data.message, type: response.data.flag});
                                                if (response.data.flag == "success") {
                                                    me.dialogFormVisible = false;
                                                    me.$refs.WfiSignconfList.remoteData();
                                                }
                                            }
                                        });
                                    }else{
                                        if(response.data.length==0) {//1.如果signId改变并且通过唯一性验证
                                            yufp.service.request({//2.则先将原数据删除
                                                url: me.urls.deleteSaveUrl+'?signId='+me.signParam,
                                                method: 'POST',
                                                callback: function (code, message, response) {
                                                    if(response.data==true){
                                                        yufp.service.request({//3.然后再添加
                                                            url: me.urls.createSaveUrl,
                                                            data: comitData,
                                                            method: 'POST',
                                                            callback: function (code, message, response) {
                                                                if (response.data.flag == "success") {
                                                                    me.$message({message: '修改成功', type: 'success'});
                                                                    me.dialogFormVisible = false;
                                                                    me.$refs.WfiSignconfList.remoteData();
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