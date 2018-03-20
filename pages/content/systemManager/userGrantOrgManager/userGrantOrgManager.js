/**
 * @Authoer: hujun
 * @Description: 用户授权机构管理
 * @Date 2017/12/5 10:41
 * @Modified By:
 *
 */
define(
    [
        './custom/widgets/js/yufpOrgTree.js',//机构放大镜
        './custom/widgets/js/yufpUserSelector.js'//用户放大镜
    ],
    function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        //注册该功能要用到的数据字典
        yufp.lookup.reg("DATA_STS",'SYS_TYPE');
        //创建virtual model
        var vm= yufp.custom.vue({
            el: "#userGrantOrg",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data:function() {
                var me=this;
                return {
                    height: yufp.custom.viewSize().height - 150,
                    queryFileds: [
                           {placeholder: '机构代码', field: 'orgId',type: 'custom', is: "yufp-org-tree"},
                          {placeholder: '用户名称', field: 'userId',type: "custom", is: "yufp-user-selector"},
                        {placeholder: '状态', field: 'relSts', type: 'select', dataCode: 'DATA_STS'}
                    ],
                    queryButtons: [
                        {
                            label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if(valid){
                                var param = { condition: JSON.stringify(model) };
                                me.$refs.grantTable.remoteData(param);
                            }
                        }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'information'}
                    ],
                    mainGrid:{
                        query: {
                            orgId: '',
                            userId: '',
                            relSts: ''
                        },
                        height: yufp.custom.viewSize().height - 220,
                        checkbox: true,
                        dataUrl: backend.adminService+'/api/adminsmusermgrorg/querypage',
                        paging: {
                            page: 1,
                            size: 10
                        },
                        currentRow: null,
                        tableColumns: [
                            { label: '用户名称', prop: 'userName', width: 200,  resizable: true, template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.instuName }}</a>\
                            </template>';
                            } },
                            { label: '机构名称', prop: 'orgName', width: 180,resizable: true },
                            { label: '状态', prop: 'relSts', width: 120,resizable: true, dataCode: 'DATA_STS'},
                            { label: '最新变更用户', prop: 'lastChgName',width: 150,  resizable: true},
                            { label: '最新变更时间', prop: 'lastChgDt', type:'date',  resizable: true}
                        ]
                    },
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'userId',type: "custom", is: "yufp-user-selector", label: '用户名称',rules:[
                                {required: true, message: '必填项', trigger: 'change'}
                            ]},
                            { field: 'orgId',type: 'custom',label: '机构名称', is: "yufp-org-tree",param: {needCheckbox:true},
                                rules: [
                                {required: true, message: '必填项', trigger: 'change'}
                            ] },
                            { field: 'relSts', label: '状态' , type: 'select',dataCode: 'DATA_STS',disabled:true }
                        ]
                    }],
                    dialogFormVisible: false,
                    dialogStatus: '',
                    formDisabled:false,
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
                    me.$refs.grantTable.remoteData();
                },
                openCreateFn: function () {
                    this.opType('create',false);
                    this.$nextTick(function () {
                        this.$refs.grantInfoform.resetFields();
                        this.$refs.grantInfoform.formModel.relSts='W';

                    });

                },
                openDetailFn: function (row) {
                    this.opType('detail',true);
                    this.$nextTick(function () {
                        this.$refs.grantInfoform.resetFields();
                        yufp.extend(this.$refs.grantInfoform.formModel, row.row);

                    });
                },
                openEditFn: function () {
                    if (this.$refs.grantTable.selections.length!==1){
                        this.$message({message: '请选着一条数据!', type: 'warning'});
                        return false;
                    }
                    var row=this.$refs.grantTable.selections[0];
                    if ( row.instuSts === 'A') {
                        this.$message({message: '只能选着停用和待启用的数据', type: 'warning'});
                        return;
                    }
                    this.opType('update',false);
                    this.$nextTick(function () {
                        this.$refs.grantInfoform.resetFields();
                        yufp.extend(this.$refs.grantInfoform.formModel, row);
                    });
                },
                opType:function(type,disabled){
                    this.dialogFormVisible = true;
                    this.dialogStatus = type;
                    this.formDisabled=disabled;

                },
                saveCreateFn: function () {
                    var em=this;
                    var form = em.$refs.grantInfoform;
                    form.validate(function (valid) {
                        if (valid) {
                           var comitData={};
                            delete form.formModel.instuId;
                            yufp.extend(comitData, form.formModel);
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+'/api/adminsmusermgrorg/addusermgrorg',
                                data: comitData,
                                callback: function (code, message, response) {
                                    em.dialogFormVisible = false;
                                    em.$message({message: '数据保存成功！'});
                                    em.queryFn();
                                }
                            });

                        }else {
                            em.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    });

                },
                saveEditFn:function() {
                    var vue=this;
                    var form = vue.$refs.grantInfoform;
                    form.validate(function (valid) {
                        if (valid) {
                            yufp.extend(comitData, form.formModel);
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+'/api/adminsmusermgrorg/update',
                                data: comitData,
                                callback: function (code, message, response) {
                                    vue.dialogFormVisible = false;
                                    vue.$message({message: '数据保存成功！'});
                                    vue.queryFn();
                                }
                            });

                        }else {
                            this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    });

                },
                useFn: function () {//启用
                    if (this.$refs.grantTable.selections.length>0) {
                        var id='';
                        for (var i=0;i< this.$refs.grantTable.selections.length;i++)
                        {
                            var row=this.$refs.grantTable.selections[i];
                            if(row.relSts!=='A'){
                                id=id+','+row.userMgrOrgId
                            }else {
                                this.$message({message: '只能选择停用或者待生效的数据', type: 'warning'});
                                return false;
                            }
                        }
                        var vue=this;
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+"/api/adminsmusermgrorg/usebatch",
                            data: {
                                id:id
                            },
                            callback: function (code, message, response) {
                                vue.$message({message: '数据操作成功！'});
                                vue.queryFn()
                            }
                        });

                    } else {
                        this.$message({message: '请先选择要生效的数据', type: 'warning'});
                        return;
                    }

                },
                unUseFn: function () {//停用
                    if (this.$refs.grantTable.selections.length>0) {
                        var id='';
                        for (var i=0;i< this.$refs.grantTable.selections.length;i++)
                        {
                            var row=this.$refs.grantTable.selections[i];
                            if(row.relSts==='A'){
                                id=id+','+row.userMgrOrgId
                            }else {
                                this.$message({message: '只能选择生效的数据', type: 'warning'});
                                return false;
                            }
                        }
                        var vue=this;
                        yufp.service.request({
                            method: 'POST',
                            url:backend.adminService+"/api/api/adminsmusermgrorg/unusebatch",
                            data: {
                                id:id
                            },
                            callback: function (code, message, response) {
                                vue.$message({message: '数据操作成功！'});
                                vue.queryFn()
                            }
                        });

                    } else {
                        this.$message({message: '请先选择要失效的数据', type: 'warning'});
                        return false;
                    }

                },
                deletestFn: function () {//删除
                    if (this.$refs.grantTable.selections.length>0) {
                        var id='';
                        for (var i=0;i< this.$refs.grantTable.selections.length;i++)
                        {
                            var row=this.$refs.grantTable.selections[i];
                            if(row.relSts!=='A'){
                                id=id+','+row.userMgrOrgId
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
                                url: backend.adminService+"/api/adminsmusermgrorg/deletebatch",
                                data: {
                                    id:id
                                },
                                callback: function (code, message, response) {
                                    vue.$message({message: '数据删除成功！'});
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