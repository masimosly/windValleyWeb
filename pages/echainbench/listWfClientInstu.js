
define(function (require, exports) {

    var instuOptions = [];
    var clientsignOptions=[];
    //自定义字典（金融机构）
    yufp.service.request({
        method: 'GET',
        url: backend.echainService + "/api/bench/queryInstuOrgOption",
        callback: function (code, message, response) {
            var instu = response.data;
            for(var i=0;i<instu.length;i++){
                var option = {};
                option.key = instu[i].instuCde;
                option.value=instu[i].instuName;
                instuOptions.push(option);
            }
        }
    });
    //自定义字典（系统名称）
    yufp.service.request({
        method: 'GET',
        url: backend.echainService + "/api/bench/queryWfClientInstuOption",
        callback: function (code, message, response) {
            var wfcInstu = response.data;
            for(var i=0;i<wfcInstu.length;i++){
                var option = {};
                option.key = wfcInstu[i].clientsign;
                option.value=wfcInstu[i].clientname;
                clientsignOptions.push(option);
            }
        }
    });

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var vm =  yufp.custom.vue({
            el: "#listWfClientInstu",
            data: function(){
                var me=this;
                //自定义金融机构校验规则
                var validateInstuCde = function(rule, value, callback){
                    var params = {
                        condition:JSON.stringify({instuCde:value})
                    }
                    yufp.service.request({
                        url: backend.echainService+ '/api/bench/checkWfClientInstu',
                        data: params,
                        method: 'GET',
                        callback: function (code, message, response) {
                            if(response.data.flag=='ok'){
                                callback();
                            }else{
                                callback(new Error('金融机构已存在'));
                            }
                        }
                    });
                }
                return {
                    height: yufp.custom.viewSize().height - 100,
                    urls:{
                        dataUrl:backend.echainService+ '/api/bench/queryWfClientInstuList',
                        createSaveUrl:backend.echainService+ '/api/bench/addWfClientInstu',
                        updateSaveUrl:backend.echainService+ '/api/bench/updateWfClientInstu'
                    },
                    dataParams: {},
                    currentRow: null,
                    tableColumns: [
                        { label: '系统ID', prop: 'clientsign',resizable: true },
                        { label: '系统名称', prop: 'wfClient.clientName',resizable: true},
                        { label: '金融机构代码', prop: 'instuCde', resizable: true},
                        { label: '金融机构名称', prop: 'adminSmInstu.instuName', resizable: true},
                        { label: '校验码', prop: 'token',  resizable: true}
                    ],
                    dialogFormVisible: false,
                    dialogStatus: '',
                    formDisabled:false,
                    textMap: {
                        update: '修改',
                        create: '新增'
                    },
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'clientsign', label: '系统ID',type: 'select', options: clientsignOptions,rules: [
                                    {required: true, message: '必填项', trigger: 'change'}
                                ] },
                            { field: 'instuCde', label: '金融机构',type: 'select', options: instuOptions,rules:[
                                    {required: true, message: '必填项', trigger: 'change'},
                                    { validator: validateInstuCde, trigger: 'change' }
                                ]},
                            { field: 'token',label: '校验码', rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                                ]}

                        ]
                    }],
                }
            },
            methods: {
                createFn: function () {
                    this.opType('create');
                    this.updateFields[0].fields[0].disabled=false;
                },
                editFn: function (row) {
                    if (this.$refs.wfClientInstuList.selections.length!==1){
                        this.$message({message: '请选择一条数据!', type: 'warning'});
                        return false;
                    }
                    var row =this.$refs.wfClientInstuList.selections[0];
                    this.opType('update');
                    this.updateFields[0].fields[0].disabled=true;
                    this.$nextTick(function () {
                        this.$refs.instuForm.resetFields();
                        yufp.extend(this.$refs.instuForm.formModel, row);

                    });
                },
                opType:function(type){
                    this.dialogFormVisible = true;
                    this.dialogStatus = type;
                },

                saveCreateFn: function () {//新增保存
                    var me = this;
                    var myform = me.$refs.instuForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            delete comitData.wfClient;
                            delete comitData.adminSmInstu;
                            var saveUrl = me.urls.createSaveUrl;
                            var params = {
                                condition:JSON.stringify({clientsign:myform.formModel.clientsign})
                            }
                            yufp.service.request({
                                url: backend.echainService+ '/api/bench/checkWfClientInstu',
                                data: params,
                                method: 'GET',
                                callback: function (code, message, response) {
                                    if(response.data.flag=='ok'){
                                        yufp.service.request({
                                            url: saveUrl,
                                            data: comitData,
                                            method: 'POST',
                                            callback: function (code, message, response) {
                                                me.$message({message: response.data.message, type: response.data.flag});
                                                if(response.data.flag == "success"){
                                                    me.dialogFormVisible = false;
                                                    me.$refs.wfClientInstuList.remoteData();
                                                }
                                            }
                                        });
                                    }else{
                                        me.$message({message: '系统ID已存在', type: 'warning'});
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
                    var myform = me.$refs.instuForm;
                    myform.validate(function(valid) {
                        if (valid) {
                            var comitData = {};
                            yufp.extend(comitData, myform.formModel);
                            delete comitData.wfClient;
                            delete comitData.adminSmInstu;
                            var saveUrl = me.urls.updateSaveUrl;
                            yufp.service.request({
                                url: saveUrl,
                                data: comitData,
                                method: 'POST',
                                callback: function (code, message, response) {
                                    me.$message({message: response.data.message, type: response.data.flag});
                                    if (response.data.flag == "success") {
                                        me.dialogFormVisible = false;
                                        me.$refs.wfClientInstuList.remoteData();
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