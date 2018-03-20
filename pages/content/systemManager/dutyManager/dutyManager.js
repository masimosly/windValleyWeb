/**
 * Created by chenlin on 2017/12/20.
 */
define([
        './custom/widgets/js/YufpUserSelector.js',
        './custom/widgets/js/yufpOrgTree.js'
    ],
    function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('DATA_STS');
        var belongOrgId ='';

        var vm =  yufp.custom.vue({
            el: "#dutyManager",
            data: function(){
                var me = this;
                return {
                    dataRoot:yufp.session.org.code,
                    orgTreeUrl: backend.adminService+"/api/util/getorg?userId="+yufp.session.userId+"&orgCode="+yufp.session.org.code,
                    dutyTableUrl: backend.adminService+"/api/adminsmduty/list",
                    dutyUserUrl: backend.adminService+"/api/adminsmduty/userlist",
                    addButton:!yufp.session.checkCtrl('add'),//新增按钮控制
					modifyButton:!yufp.session.checkCtrl('modify'),//修改按钮控制
					deleteButton:!yufp.session.checkCtrl('delete'),//删除按钮控制
					enableButton:!yufp.session.checkCtrl('enable'),//启用按钮控制
					disableButton:!yufp.session.checkCtrl('disable'),//停用按钮控制
					dutyUserButton:!yufp.session.checkCtrl('dutyUser'),//岗位用户按钮控制
                    expandCollapseName: ['base'],
                    queryFields : [
                        {placeholder: '岗位代码', field: 'dutyCde', type: 'input'},
                        {placeholder: '岗位名称', field: 'dutyName', type: 'input'},
                        {placeholder: '状态', field: 'dutySts', type: 'select', dataCode: 'DATA_STS'}//dataCode: 'NATIONALITY'
                    ],
                    queryButtons: [
                        {label: '搜索',op: 'submit',type: 'primary',icon: "search",
                            click: function (model, valid) {
                                if (valid) {
                                    var param = {condition: JSON.stringify(model)};
                                    me.$refs.dutyTable.remoteData(param);
                                }
                            }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2',
                            click: function () {
                                me.$refs.dutyQuery.fm.belongOrgId=undefined;
                            }
                        }
                    ],
                    tableColumns: [
                        {label: '所属机构', prop: 'orgName'},
                        {label: '岗位代码', prop: 'dutyCde'},
                        {label: '岗位名称', prop: 'dutyName', sortable: true, resizable: true, template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.dutyName }}</a>\
                            </template>';
                            }},
                        {label: '状态', prop: 'dutySts', width: 80, dataCode: 'DATA_STS'},
                        {label: '最新更新人', prop: 'userName'},
                        {label: '最新变更时间', prop: 'lastChgDt',formatter:function (row,me) {
                            return row.lastChgDt.substring(0,10);
                        }}
                    ],
                    updateFields: [{
                        columnCount: 1,
                        fields: [
                            { field: 'dutyCde',label: '岗位代码',
                                rules:[{required: true, message: '必填项',trigger: 'blur'},
                                	{max: 33, message: '输入值过长', trigger: 'blur' }] },
                            { field: 'dutyName', label: '岗位名称',
                                rules:[{ required: true, message: '必填项', trigger: 'blur' },
                                	{max: 33, message: '输入值过长', trigger: 'blur' }] },
                            {label: '所属机构', field: 'belongOrgId',type:'custom',is:'yufp-org-tree',
                                param:{needDpt:true,needCheckbox:false},
                                rules:[{ required: true, message: '必填项', trigger: 'blur' }] },
                            { field: 'dutySts', label: '状态', type: 'select', dataCode: 'DATA_STS',
                                rules:[{ required: true, message: '必填项', trigger: 'blur' }]},
                            { field: 'userName',label: '最新更新人'},
                            { field: 'lastChgDt',label: '最新更新时间'}

                        ]
                    }],
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', op: 'submit',icon: "check", hidden: false, click: function (model) {
                            me.saveCreateFn();
                        }},
                        {label: '保存', type: 'primary', op: 'submit',icon: "check", hidden: false, click: function (model) {
                            me.saveEditFn();
                        }}],
                    height: yufp.custom.viewSize().height-10,
                    dialogVisible: false,
                    formDisabled: false,
                    viewType: 'DETAIL',
                    viewTitle: yufp.lookup.find('CRUD_TYPE', false),
                    //岗位用户
                    dialogGridVisible: false,//编辑列表弹窗
                    textMap: {
                        dutyUser: '岗位用户'
                    },
                    userQueryFields: [
                        {placeholder: '登录代码', field: 'loginCode', type: 'input'},
                        {placeholder: '员工姓名', field: 'userName', type: 'input'},
                        {placeholder: '员工号', field: 'userCode', type: 'input'}
                    ],
                    userQueryButtons: [
                        {label: '搜索', op: 'submit', type: 'primary', icon: "search",
                            click: function (model, valid) {
                                if (valid) {
                                    var param = {condition: JSON.stringify({
                                        loginCode: me.$refs.userQuery.fm.loginCode ? me.$refs.userQuery.fm.loginCode : null,
                                        userName: me.$refs.userQuery.fm.userName ? me.$refs.userQuery.fm.userName : null,
                                        userCode: me.$refs.userQuery.fm.userCode ? me.$refs.userQuery.fm.userCode : null,
                                        userSts: me.$refs.userQuery.fm.userSts ? me.$refs.userQuery.fm.userSts : null,
                                        dutyId: me.$refs.dutyTable.selections[0].dutyId
                                    })};
                                    me.$refs.userTable.remoteData(param);
                                }
                            }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2',
                            click: function () {}
                        }
                    ],
                    userTableColumns: [
                        {label: '登录代码', prop: 'loginCode', width: 180},
                        {label: '员工姓名', prop: 'userName', sortable: true, resizable: true},
                        {label: '所属机构', prop: 'orgName', width: 180}
                    ]
                }
            },
            methods: {
                //主列表维护
                queryMainGridFn: function () {
                    var me = this;
                    var param = {
                        condition: JSON.stringify({
                            dutyCde: me.$refs.dutyQuery.fm.dutyCde?me.$refs.dutyQuery.fm.dutyCde:null,
                            dutyName: me.$refs.dutyQuery.fm.dutyName?me.$refs.dutyQuery.fm.dutyName:null,
                            dutySts: me.$refs.dutyQuery.fm.dutySts?me.$refs.dutyQuery.fm.dutySts:null,
                            belongOrgId:me.$refs.dutyQuery.fm.belongOrgId
                        })
                    }
                    me.$refs.dutyTable.remoteData(param);
                },
                switchStatus: function (viewType, editable) {
                    this.viewType = viewType;
                    this.dialogVisible = true;
                    this.formDisabled = !editable;
                    this.updateButtons[0].hidden = !editable;
                    if(viewType=='ADD'){
                        this.updateButtons[1].hidden = !editable;
                        this.updateButtons[2].hidden = editable;
                    }else if(viewType=='EDIT'){
                        this.updateButtons[1].hidden = editable;
                        this.updateButtons[2].hidden = !editable;
                    }else if(viewType=='DETAIL'){
                        this.updateButtons[1].hidden = !editable;
                        this.updateButtons[2].hidden = !editable;
                    }
                },
                nodeClickFn: function (nodeData, node, self) {
                    this.$refs.dutyQuery.fm.belongOrgId=nodeData.orgId;
                    belongOrgId = nodeData.orgId;
                    this.queryMainGridFn();
                },
                addFn: function(){
                    this.switchStatus('ADD', true);
                    this.$nextTick(function () {
                        this.$refs.dutyForm.resetFields();
                        this.$refs.dutyForm.formModel.dutySts = 'A';
                        this.$refs.dutyForm.formModel.belongOrgId=belongOrgId;
                        //设置编号可编辑
                        this.updateFields[0].fields[0].readonly = false;
                        //设置字段隐藏
                        this.updateFields[0].fields[4].hidden = true;
                        this.updateFields[0].fields[5].hidden = true;
                    });
                },
                modifyFn: function(){
                    if (this.$refs.dutyTable.selections.length != 1) {
                        this.$message({message: '请选择一条记录', type: 'warning'})
                        return;
                    }
                    if (this.$refs.dutyTable.selections[0].dutySts == 'A') {
                        this.$message({message: '只能选着失效和待生效的数据', type: 'warning'});
                        return;
                    }
                    this.switchStatus('EDIT', true);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.dutyForm.formModel, this.$refs.dutyTable.selections[0]);
                        //设置编号可编辑
                        this.updateFields[0].fields[0].readonly = true;
                        //设置字段隐藏
                        this.updateFields[0].fields[4].hidden = true;
                        this.updateFields[0].fields[5].hidden = true;
                    });
                },
                infoFn: function(row){
                    //设置字段显示
                    this.updateFields[0].fields[4].hidden = false;
                    this.updateFields[0].fields[5].hidden = false;
                    this.switchStatus('DETAIL', false);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.dutyForm.formModel, row.row);
                    });

                },
                saveCreateFn: function () {
                    var fields = this.$refs.dutyForm;
                    var vue = this;
                    delete fields.formModel.dutyId;
                    fields.formModel.lastChgUsr=yufp.session.userId;//最新更新人
                    this.$refs.dutyForm.validate(function (valid) {
                        if (valid) {
                            yufp.service.request({
                                method: 'GET',
                                url: backend.adminService + "/api/adminsmduty/checkdutycde",
                                data: {
                                    dutyCde: fields.formModel.dutyCde
                                },
                                callback: function (code, message, response) {
                                    if (response > 0) {
                                        vue.$message({message: '岗位编号重复！', type: 'warning'});
                                    }else{
                                        yufp.service.request({
                                            method: 'POST',
                                            url: backend.adminService+"/api/adminsmduty/",
                                            data: fields.formModel,
                                            callback: function (code, message, response) {
                                                vue.dialogVisible = false;
                                                vue.$message({message: '数据保存成功！'});
                                                vue.queryMainGridFn()
                                            }
                                        });
                                    }
                                }
                            })

                        }
                    });
                },
                saveEditFn: function () {
                    var fields = this.$refs.dutyForm;
                    var vue = this;
                    fields.formModel.lastChgUsr=yufp.session.userId;//最新更新人
                    this.$refs.dutyForm.validate(function (valid) {
                        if (valid) {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmduty/update",
                                data: fields.formModel,
                                callback: function (code, message, response) {
                                    vue.dialogVisible = false;
                                    vue.$message({message: '数据保存成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        }
                    });
                },
                useFn: function () {
                    var vue = this;
                    if (this.$refs.dutyTable.selections.length>0) {
                        var id = '';
                        for (var i = 0; i < this.$refs.dutyTable.selections.length; i++) {
                            var row = this.$refs.dutyTable.selections[i];
                            if (row.dutySts === 'W' || row.dutySts === 'I') {
                                id = id + ',' + row.dutyId
                            } else {
                                vue.$message({message: '只能选择失效或待生效的数据', type: 'warning'});
                                return;
                            }
                        }
                        this.$confirm('此操作将所选岗位生效, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/adminsmduty/usebatch",
                                data: {
                                    id: id,
                                    userId:yufp.session.userId
                                },
                                callback: function (code, message, response) {
                                    vue.$message({message: '数据操作成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        });
                    } else {
                        vue.$message({message: '请先选择要生效的数据', type: 'warning'});
                        return;
                    }

                },
                unUseFn: function () {//批量失效
                    var vue = this;
                    if (this.$refs.dutyTable.selections.length>0) {
                        var id = '';
                        for (var i = 0; i < this.$refs.dutyTable.selections.length; i++) {
                            var row = this.$refs.dutyTable.selections[i];
                            if (row.dutySts === 'A') {
                                id = id + ',' + row.dutyId
                            } else {
                                this.$message({message: '只能选择生效的数据', type: 'warning'});
                                return;
                            }
                        }
                        this.$confirm('此操作将所选岗位失效, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/adminsmduty/unusebatch",
                                data: {
                                    id: id,
                                    userId:yufp.session.userId
                                },
                                callback: function (code, message, response) {
                                    vue.$message({message: '数据操作成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        })
                    } else {
                        vue.$message({message: '请先选择要生效的数据', type: 'warning'});
                        return
                    }

                },
                deleteFn: function () {
                    var vue = this;
                    if (this.$refs.dutyTable.selections.length>0) {
                        var id = '';
                        for (var i = 0; i < this.$refs.dutyTable.selections.length; i++) {
                            var row = this.$refs.dutyTable.selections[i];
                            if (row.dutySts != 'A') {
                                id = id + ',' + row.dutyId
                            } else {
                                vue.$message({message: '只能删除待生效或失效的数据', type: 'warning'});
                                return;
                            }
                        }
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService + "/api/adminsmduty/checkhasuser",
                            data: {
                                dutyId: id
                            },
                            callback: function (code, message, response) {
                                if (response > 0) {
                                    vue.$message({message: '所选择的岗位下存在用户！', type: 'warning'});
                                } else {
                                    vue.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                        center: true
                                    }).then(function () {
                                        yufp.service.request({
                                            method: 'POST',
                                            url: backend.adminService+"/api/adminsmduty/deletebatch",
                                            data: {
                                                id: id
                                            },
                                            callback: function (code, message, response) {
                                                vue.$message({message: '数据删除成功！'});
                                                vue.queryMainGridFn()
                                            }
                                        });
                                    })
                                }
                            }
                        });

                    } else {
                        vue.$message({message: '请先选择要删除的数据', type: 'warning'});
                        return;
                    }
                },
                //岗位用户列表维护
                openDutyUserFn: function () {
                    if (this.$refs.dutyTable.selections.length != 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'});
                        return;
                    }
                    this.dialogDisabled = false;
                    this.dialogStatus = 'dutyUser';
                    this.dialogGridVisible = true;
                    this.queryUserGridFn();
                },
                queryUserGridFn: function () {
                    var me = this;
                    this.$nextTick(function () {
                        var param = {
                            condition: JSON.stringify({
                                loginCode: me.$refs.userQuery.fm.loginCode ? me.$refs.userQuery.fm.loginCode : null,
                                userName: me.$refs.userQuery.fm.userName ? me.$refs.userQuery.fm.userName : null,
                                userCode: me.$refs.userQuery.fm.userCode ? me.$refs.userQuery.fm.userCode : null,
                                userSts: me.$refs.userQuery.fm.userSts ? me.$refs.userQuery.fm.userSts : null,
                                dutyId: me.$refs.dutyTable.selections[0].dutyId
                            })
                        };
                        me.$refs.userTable.remoteData(param);
                    });
                }
            }
        });
    };

});