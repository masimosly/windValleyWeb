/**
 * 部门管理
 * Created by chenlin on 2017/12/20.
 */
define([
        './custom/widgets/js/YufpUserSelector.js',
        './custom/widgets/js/yufpOrgTree.js',
        './custom/widgets/js/yufpDptTree.js'
    ],
    function (require, exports) {
        //page加载完成后调用ready方法
        exports.ready = function (hashCode, data, cite) {
            //注册数据字典
            yufp.lookup.reg('DATA_STS');
            //所属机构
            var belongOrgId = '';

            var vm = yufp.custom.vue({
                el: "#dptManager",
                data: function () {
                    var me = this;
                    return {
                        dataRoot:yufp.session.org.code,
                        orgTreeUrl: backend.adminService + "/api/util/getorg?userId="+yufp.session.userId+"&orgCode="+yufp.session.org.code,
                        dptTableUrl: backend.adminService + "/api/adminsmdpt/list",
                        dptUserUrl: backend.adminService + "/api/adminsmdpt/userlist",
                        addButton:!yufp.session.checkCtrl('add'),//新增按钮控制
						modifyButton:!yufp.session.checkCtrl('modify'),//修改按钮控制
						deleteButton:!yufp.session.checkCtrl('delete'),//删除按钮控制
						enableButton:!yufp.session.checkCtrl('enable'),//启用按钮控制
						disableButton:!yufp.session.checkCtrl('disable'),//停用按钮控制
						dptUserButton:!yufp.session.checkCtrl('dptUser'),//部门用户按钮控制
                        expandCollapseName: ['base'],
                        queryFields: [
                            {placeholder: '部门代码', field: 'dptCde', type: 'input'},
                            {placeholder: '部门名称', field: 'dptName', type: 'input'},
                            {placeholder: '状态', field: 'dptSts', type: 'select', dataCode: 'DATA_STS'}
                        ],
                        queryButtons: [
                            {
                                label: '搜索', op: 'submit', type: 'primary', icon: "search",
                                click: function (model, valid) {
                                    if (valid) {
                                        var param = {condition: JSON.stringify(model)};
                                        me.$refs.dptTable.remoteData(param);
                                    }
                                }
                            },
                            {
                                label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2',
                                click: function () {
                                    me.$refs.dptQuery.fm.belongOrgId = undefined;
                                }
                            }
                        ],
                        tableColumns: [
                            {label: '所属机构', prop: 'orgName'},
                            {label: '部门代码', prop: 'dptCde'},
                            {label: '部门名称', prop: 'dptName', sortable: true, resizable: true, template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.dptName }}</a>\
                            </template>';
                            } },
                            {label: '状态', prop: 'dptSts', width: 80, dataCode: 'DATA_STS'},
                            {label: '上级部门', prop: 'upDptName'},
                            {label: '最新更新人', prop: 'userName'},
                            {
                                label: '最新变更时间', prop: 'lastChgDt', width: 110, formatter: function (row, me) {
                                return row.lastChgDt.substring(0, 10);
                            }
                            }
                        ],
                        updateFields: [{
                            columnCount: 1,
                            fields: [
                                {
                                    label: '部门代码', field: 'dptCde',
                                    rules: [{required: true, message: '必填项',trigger: 'blur'},
                                	{max: 33, message: '输入值过长', trigger: 'blur' }]
                                },
                                {
                                    label: '部门名称', field: 'dptName',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'},
                                	{max: 33, message: '输入值过长', trigger: 'blur' }]
                                },
                                {
                                    label: '所属机构', field: 'belongOrgId', type: 'custom', is: 'yufp-org-tree',
                                    param: {needCheckbox: false},
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}],
                                    selectFn: function (code, data, arry) {
                                        var temp = yufp.clone(me.updateFields[0].fields[3].params);
                                        temp.dataParams={
                                            orgCode:code
                                        }
                                        me.updateFields[0].fields[3].params = yufp.clone(temp);
                                    }
                                },
                                {
                                    label: '上级部门', field: 'upDptId', type: 'custom', is: 'yufp-dpt-tree',
                                    params: {
                                        dataUrl: backend.adminService + "/api/util/getdpt",
                                        // dataRoot: '10000001',
                                        dataId:"orgCode",
                                        needCheckbox: false
                                    },//
                                    selectFn: function (code, data, arry) {
                                    }
                                },
                                {
                                    label: '状态', field: 'dptSts', type: 'select', dataCode: 'DATA_STS',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}]
                                },
                                { field: 'userName',label: '最新更新人'},
                                { field: 'lastChgDt',label: '最新更新时间'}
                            ]
                        }],
                        updateButtons: [
                            {
                                label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                                me.dialogVisible = false;
                            }
                            },
                            {
                                label: '保存', type: 'primary', op: 'submit', icon: "check", hidden: false,
                                click: function (model) {
                                    me.saveCreateFn();
                                }
                            },
                            {
                                label: '保存', type: 'primary', op: 'submit', icon: "check", hidden: false,
                                click: function (model) {
                                    me.saveEditFn();
                                }
                            }],
                        height: yufp.custom.viewSize().height-10,
                        dialogVisible: false,
                        formDisabled: false,
                        viewType: 'DETAIL',
                        viewTitle: yufp.lookup.find('CRUD_TYPE', false),
                        //用户列表弹窗
                        dialogGridVisible: false,//列表弹窗
                        textMap: {
                            dptUser: '部门用户'
                        },
                        userQueryFields: [
                            {placeholder: '登录代码', field: 'loginCode', type: 'input'},
                            {placeholder: '员工姓名', field: 'userName', type: 'input'},
                            {placeholder: '员工号', field: 'userCode', type: 'input'}
                        ],
                        userQueryButtons: [
                            {
                                label: '搜索', op: 'submit', type: 'primary', icon: "search",
                                click: function (model, valid) {
                                    if (valid) {
                                        var param = {
                                            condition: JSON.stringify({
                                                loginCode: me.$refs.userQuery.fm.loginCode ? me.$refs.userQuery.fm.loginCode : null,
                                                userName: me.$refs.userQuery.fm.userName ? me.$refs.userQuery.fm.userName : null,
                                                userCode: me.$refs.userQuery.fm.userCode ? me.$refs.userQuery.fm.userCode : null,
                                                userSts: me.$refs.userQuery.fm.userSts ? me.$refs.userQuery.fm.userSts : null,
                                                dptId: me.$refs.dptTable.selections[0].dptId
                                            })
                                        };
                                        me.$refs.userTable.remoteData(param);
                                    }
                                }
                            },
                            {
                                label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2',
                                click: function () {
                                }
                            }
                        ],
                        userTableColumns: [
                            {label: '登录代码', prop: 'loginCode'},
                            {label: '员工姓名', prop: 'userName', sortable: true, resizable: true}
                        ]
                    }
                },
                methods: {
                    //主列表
                    queryMainGridFn: function () {//列表查询
                        var me = this;
                        var param = {
                            condition: JSON.stringify({
                                dptCde: me.$refs.dptQuery.fm.dptCde ? me.$refs.dptQuery.fm.dptCde : null,
                                dptName: me.$refs.dptQuery.fm.dptName ? me.$refs.dptQuery.fm.dptName : null,
                                dptSts: me.$refs.dptQuery.fm.dptSts ? me.$refs.dptQuery.fm.dptSts : null,
                                belongOrgId: me.$refs.dptQuery.fm.belongOrgId
                            })
                        }
                        me.$refs.dptTable.remoteData(param);
                    },
                    switchStatus: function (viewType, editable) {//初始面板标题、按钮等信息
                        this.viewType = viewType;
                        this.dialogVisible = true;
                        this.formDisabled = !editable;
                        this.updateButtons[0].hidden = !editable;
                        if (viewType == 'ADD') {
                            this.updateButtons[1].hidden = !editable;
                            this.updateButtons[2].hidden = editable;
                        } else if (viewType == 'EDIT') {
                            this.updateButtons[1].hidden = editable;
                            this.updateButtons[2].hidden = !editable;
                        } else if (viewType == 'DETAIL') {
                            this.updateButtons[1].hidden = !editable;
                            this.updateButtons[2].hidden = !editable;
                        }
                    },
                    nodeClickFn: function (nodeData, node, self) {//树点击事件
                        /*初始化部门数据*/
                        var temp = yufp.clone(this.updateFields[0].fields[3].params);
                        temp.dataParams={
                            orgCode:nodeData.orgId
                        }
                        this.updateFields[0].fields[3].params = yufp.clone(temp);
                        //查询
                        this.$refs.dptQuery.fm.belongOrgId = nodeData.orgId;
                        belongOrgId = nodeData.orgId;
                        this.queryMainGridFn();
                    },
                    addFn: function () {//新增弹出方法
                        this.switchStatus('ADD', true);
                        this.$nextTick(function () {
                            this.$refs.dptForm.resetFields();//重置form
                            this.$refs.dptForm.formModel.dptSts = 'A';//设置默认值
                            this.$refs.dptForm.formModel.belongOrgId = belongOrgId;
                            //初始化部门树
                            var temp = yufp.clone(this.updateFields[0].fields[3].params);
                            temp.dataParams={
                                orgCode:belongOrgId
                            }
                            this.updateFields[0].fields[3].params = yufp.clone(temp);
                            //设置编号可编辑
                            this.updateFields[0].fields[0].readonly = false;
                            //设置字段隐藏
                            this.updateFields[0].fields[5].hidden = true;
                            this.updateFields[0].fields[6].hidden = true;
                        });
                    },
                    modifyFn: function () {//修改弹出方法
                        if (this.$refs.dptTable.selections.length != 1) {
                            this.$message({message: '请选择一条记录', type: 'warning'})
                            return;
                        }
                        if (this.$refs.dptTable.selections[0].dptSts == 'A') {
                            this.$message({message: '只能选择失效和待生效的数据', type: 'warning'});
                            return;
                        }
                        this.switchStatus('EDIT', true);
                        this.$nextTick(function () {
                            yufp.extend(this.$refs.dptForm.formModel, this.$refs.dptTable.selections[0]);
                            //设置编号不可编辑
                            this.updateFields[0].fields[0].readonly = true;
                            //设置字段隐藏
                            this.updateFields[0].fields[5].hidden = true;
                            this.updateFields[0].fields[6].hidden = true;
                        });
                    },
                    infoFn: function (row) {//详情弹出方法
                        //设置字段隐藏
                        this.updateFields[0].fields[5].hidden = false;
                        this.updateFields[0].fields[6].hidden = false;
                        this.switchStatus('DETAIL', false);
                        this.$nextTick(function () {
                            yufp.extend(this.$refs.dptForm.formModel,row.row);
                        });
                    },
                    saveCreateFn: function () {//新增保存方法
                        var vue = this;
                        var fields = vue.$refs.dptForm;
                        delete fields.formModel.dptId;
                        fields.formModel.lastChgUsr=yufp.session.userId;//最新更新人
                        this.$refs.dptForm.validate(function (valid) {
                            if (valid) {
                                yufp.service.request({
                                    method: 'GET',
                                    url: backend.adminService + "/api/adminsmdpt/checkdptcde",
                                    data: {
                                        dptCde: fields.formModel.dptCde
                                    },
                                    callback: function (code, message, response) {
                                        if (response > 0) {
                                            vue.$message({message: '部门编号重复！', type: 'warning'});
                                        }else{
                                            yufp.service.request({
                                                method: 'POST',
                                                url: backend.adminService + "/api/adminsmdpt/",
                                                data: fields.formModel,
                                                callback: function (code, message, response) {
                                                    vue.dialogVisible = false;
                                                    vue.$message({message: '数据保存成功！'});
                                                    vue.queryMainGridFn();
                                                }
                                            });
                                        }
                                    }
                                })
                            }
                        });
                    },
                    saveEditFn: function () {//修改保存方法
                        var fields = this.$refs.dptForm;
                        var vue = this;
                        fields.formModel.lastChgUsr=yufp.session.userId;//最新更新人
                        this.$refs.dptForm.validate(function (valid) {
                            if (valid) {
                                yufp.service.request({
                                    method: 'POST',
                                    url: backend.adminService + "/api/adminsmdpt/update",
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
                    useFn: function () {//批量启用
                        var vue = this;
                        if (this.$refs.dptTable.selections.length > 0) {
                            var id = '';
                            for (var i = 0; i < this.$refs.dptTable.selections.length; i++) {
                                var row = this.$refs.dptTable.selections[i];
                                if (row.dptSts === 'W' || row.dptSts === 'I') {
                                    id = id + ',' + row.dptId
                                } else {
                                    this.$message({message: '只能选择失效或待生效的数据', type: 'warning'});
                                    return;
                                }
                            }
                            this.$confirm('此操作将所选部门生效, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                center: true
                            }).then(function () {
                                yufp.service.request({
                                    method: 'POST',
                                    url: backend.adminService + "/api/adminsmdpt/usebatch",
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
                            return;
                        }
                    },
                    unUseFn: function () {//批量失效
                        var vue = this;
                        if (this.$refs.dptTable.selections.length > 0) {
                            var id = '';
                            for (var i = 0; i < this.$refs.dptTable.selections.length; i++) {
                                var row = this.$refs.dptTable.selections[i];
                                if (row.dptSts === 'A') {
                                    id = id + ',' + row.dptId
                                } else {
                                    this.$message({message: '只能选择生效的数据', type: 'warning'});
                                    return;
                                }
                            }
                            this.$confirm('此操作将所选部门失效, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                center: true
                            }).then(function () {
                                yufp.service.request({
                                    method: 'POST',
                                    url: backend.adminService + "/api/adminsmdpt/unusebatch",
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
                            return
                        }
                    },
                    deleteFn: function () {//批量删除
                        var vue = this;
                        if (this.$refs.dptTable.selections.length > 0) {
                            var id = '';
                            for (var i = 0; i < this.$refs.dptTable.selections.length; i++) {
                                var row = this.$refs.dptTable.selections[i];
                                if (row.dptSts != 'A') {
                                    id = id + ',' + row.dptId
                                } else {
                                    this.$message({message: '只能删除待生效或失效的数据', type: 'warning'});
                                    return;
                                }
                            }
                            yufp.service.request({
                                method: 'GET',
                                url: backend.adminService + "/api/adminsmdpt/checkhasuser",
                                data: {
                                    dptId: id
                                },
                                callback: function (code, message, response) {
                                    if (response > 0) {
                                        vue.$message({message: '所选择的部门下存在用户！', type: 'warning'});
                                    } else {
                                        vue.$confirm('此操作将删除该部门信息, 是否继续?', '提示', {
                                            confirmButtonText: '确定',
                                            cancelButtonText: '取消',
                                            type: 'warning',
                                            center: true
                                        }).then(function () {
                                            yufp.service.request({
                                                method: 'POST',
                                                url: backend.adminService + "/api/adminsmdpt/deletebatch",
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
                    //部门用户列表弹窗
                    openDptUserFn: function () {//打开部门用户列表
                        if (this.$refs.dptTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        this.dialogDisabled = false;
                        this.dialogStatus = 'dptUser';
                        this.dialogGridVisible = true;
                        this.queryUserGridFn();
                    },
                    queryUserGridFn: function () {//部门用户列表
                        var me = this;
                        this.$nextTick(function () {
                            var param = {
                                condition: JSON.stringify({
                                    loginCode: me.$refs.userQuery.fm.loginCode ? me.$refs.userQuery.fm.loginCode : null,
                                    userName: me.$refs.userQuery.fm.userName ? me.$refs.userQuery.fm.userName : null,
                                    userCode: me.$refs.userQuery.fm.userCode ? me.$refs.userQuery.fm.userCode : null,
                                    userSts: me.$refs.userQuery.fm.userSts ? me.$refs.userQuery.fm.userSts : null,
                                    dptId: me.$refs.dptTable.selections[0].dptId
                                })
                            };
                            me.$refs.userTable.remoteData(param);
                        });
                    }
                }
            });
        };
    });