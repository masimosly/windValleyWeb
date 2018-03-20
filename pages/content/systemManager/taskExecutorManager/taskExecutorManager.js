/**
 * @Authoer: luodp
 * @Description: 执行器管理
 * @Date 2018/1/23 14:16
 * @Modified By:
 *
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        //注册该功能要用到的数据字典
        yufp.lookup.reg("DATA_STS","TRIGGER_REGTYPE");
        //创建virtual model
        var vm;
        vm = yufp.custom.vue({
            el: "#triggergroup_grid",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data:function() {
                var me=this;
                return {
                    height: yufp.custom.viewSize().height - 150,
                    createButton:!yufp.session.checkCtrl('addTriggerGroup'),//新增按钮控制
                    editButton:!yufp.session.checkCtrl('editTriggerGroup'),//修改按钮控制
                    deleteButton:!yufp.session.checkCtrl('deleteTriggerGroup'),//删除按钮控制
                    queryFileds: [
                        {placeholder: 'appName', field: 'appName', type: 'input'},
                        {placeholder: '名字', field: 'title', type: 'input'},
                        {placeholder: '注册方式', field: 'addressType', type: 'select', dataCode: 'TRIGGER_REGTYPE'}
                    ],
                    mainGrid:{
                        query: {
                            title: '',
                            appName: '',
                            addressType: ''
                        },
                        height: yufp.custom.viewSize().height - 220,
                        checkbox: true,
                        dataUrl: backend.adminService+'/api/triggergroup/querypage?sort=orderCode asc',
                        paging: {
                            page: 1,
                            size: 10
                        },
                        currentRow: null,
                        tableColumns: [
                            { label: 'appName', prop: 'appName', resizable: true, template: function () {
                                    return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.appName }}</a>\
                            </template>';
                                } },
                            { label: '名字', prop: 'title',resizable: true },
                            { label: '注册方式', prop: 'addressType',resizable: true, dataCode: 'TRIGGER_REGTYPE'},
                            { label: 'OnLine 机器', prop: 'addressList',type:'date', resizable: true},
                            { label: '顺序', prop: 'orderCode',type:'date', width: 50}
                        ]
                    },

                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'appName',label: 'appName', rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    {max: 100, message: '最大长度不超过50个汉字', trigger: 'blur' }
                                ]},
                            { field: 'title', label: '名字',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    {max: 10, message: '最大长度不超过10个字符', trigger: 'blur' }
                                ]},
                            { field: 'addressType', label: '注册方式' , type: 'select',dataCode: 'TRIGGER_REGTYPE',disabled:false },
                            { field: 'orderCode', label: '顺序',rules:[
                                    { validator: yufp.validator.number},
                                    {max: 3, message: '最大长度不超过3个字符', trigger: 'blur' }
                                ]},
                        ]
                    }],
                    updateOtherFields: [{
                        columnCount: 1,
                        fields: [
                            { field: 'addressList', label: 'OnLine 机器', type: 'textarea', rows: 1,rules:[
                                    {max: 200, message: '最大长度不超过100个汉字', trigger: 'blur' }
                                ] }
                        ]
                    }],
                    stsOptions:null,
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
                    this.$nextTick(function () {
                        this.$refs.form.resetFields();
                        this.$refs.otherForm.resetFields();
                        this.$refs.form.formModel.addressType='0';
                    });
                },
                openDetailFn: function (row) {
                    this.opType('detail',true,['1','2']);
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
                    this.opType('update',false,['1','2']);
                    // this.updateFields[0].fields[0].readonly=false;
                    var row=this.$refs.infotable.selections[0];
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
                            addressList: null
                        };
                        delete form.formModel.id;
                        yufp.extend(comitData, form.formModel);
                        comitData.addressList= otherForm.formModel.addressList;
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+"/api/triggergroup/",
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
                            addressList: null
                        };
                        yufp.extend(comitData, form.formModel);
                        comitData.addressList= otherForm.formModel.addressList;
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+"/api/triggergroup/update",
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
                deletestFn: function () {//删除
                    if (this.$refs.infotable.selections.length == 1) {
                        var id=this.$refs.infotable.selections[0].id;
                        var vue=this;
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+"/api/triggergroup/checkdelete/"+id,
                            callback: function (code, message, response) {
                                if(response.data == 0){
                                    vue.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                        center: true
                                    }).then(function(){
                                        yufp.service.request({
                                            method: 'POST',
                                            url: backend.adminService+"/api/triggergroup/delete/"+id,
                                            callback: function (code, message, response) {
                                                if(response.data < 1){
                                                    vm.$message({ message: response.message });
                                                    return;
                                                }
                                                vm.$message({ message: '删除成功!' });
                                                vue.queryFn()
                                            }
                                        });
                                    })
                                }else{
                                    vm.$message({ message: response.message });
                                    return;
                                }
                            }
                        });
                    } else {
                        this.$message({message: '请选择一条数据!', type: 'warning'});
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