define(function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg("LOG_TYPE");
        // 日志类型下拉框
        var logvm = yufp.custom.vue({
            el: "#logManager",
            data: function () {
                var me = this;
                return {
                    exportCheck: !yufp.session.checkCtrl('export'),
                    deleteCheck: !yufp.session.checkCtrl('batchdelete'),
                    queryFileds: [{
                        placeholder: '日志类型',
                        field: 'logTypeId',
                        type: 'select',
                        options: []
                    }, {
                        placeholder: '操作用户',
                        field: 'user',
                        type: 'input'
                    }, {
                        placeholder: '操作对象',
                        field: 'operObjId',
                        type: 'input'
                    }, {
                        placeholder: '操作时间从',
                        field: 'beginTime',
                        type: 'date'
                    }, {
                        placeholder: '操作时间至',
                        field: 'endTime',
                        type: 'date'
                    }],
                    dialogVisible: false,
                    checkbox: true,
                    height: yufp.custom.viewSize().height - 140,
                    dataUrl: backend.adminService + "/api/log/getlog",
                    dataParams: {},
                    tableColumns: [{
                        label: '用户代码',
                        prop: 'userCode',
                        width: 110
                    }, {
                        label: '用户名称',
                        prop: 'userName',
                        width: 110
                    }, {
                        label: '操作时间',
                        prop: 'operTime',
                        width: 100,
                        formatter: function (row, column) {
                            var date = row[column.property];
                            if(date!=null&&date!=undefined&&date!=""){
                                return date.substring(0, 10);
                            }
                            return date;
                        }
                    }, {
                        label: '操作对象',
                        prop: 'operObjId',
                        headerAlign: 'center',
                        width: 110
                    }, {
                        label: '操作前值',
                        prop: 'beforeValue',
                        headerAlign: 'center',
                        width: 110
                    }, {
                        label: '操作后值',
                        prop: 'afterValue',
                        headerAlign: 'center',
                        width: 110
                    }, {
                        label: '操作标志',
                        headerAlign: 'center',
                        prop: 'operFlag',
                        width: 100
                    }, {
                        label: '日志类型',
                        headerAlign: 'center',
                        prop: 'logTypeId',
                        width: 100,
                        type: "select",
                        dataCode: "LOG_TYPE",
                    }, {
                        label: '日志内容',
                        prop: 'content',
                        headerAlign: 'center',
                        width: 160
                    }, {
                        label: '操作者机构',
                        prop: 'orgId',
                        headerAlign: 'center',
                        width: 110
                    }, {
                        label: '登录IP',
                        prop: 'loginIp',
                        headerAlign: 'center',
                        width: 110
                    }]
                };
            },
            methods: {
                queryMainGridFn: function (params) {
                    var me = this;
                    me.$refs.logtable.remoteData(params);
                },
                queryLogFn: function () {
                    var con = this.$refs.queryCon.fm;
                    var param = {
                        condition: JSON.stringify(con)
                    }
                    this.queryMainGridFn(param);
                },
                getSelection: function () {
                    this.$alert(this.$refs.logtable.selections, '提示');
                },
                getSelectedRow: function (row) {
                    // 获取选中行
                },
                deleteLogInfo: function () { //删除日志信息
                    var me = this;

                    var selects = this.$refs.logtable.selections;
                    if (selects.length == 0) {
                        me.$message("请至少选择一条数据", "警告");
                        return false;
                    }
                    me.$confirm('是否确定删除所选数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        var params = "";
                        for (var i = 0; i < selects.length; i++) {
                            if (i == 0) {
                                params += selects[i].logId;
                            } else {
                                params += "," + selects[i].logId;
                            }
                        }
                        yufp.service.request({
                            url: backend.adminService + "/api/log/batchdelete/" + params,
                            method: 'post',
                            callback: function (code, message, response) {
                                me.$message("删除记录成功!", "提示");
                                me.queryMainGridFn();
                            }
                        });
                    }).catch(function () {
                    });
                },
                exportLog: function () {
                    var me = this;
                    var con = me.$refs.queryCon.fm;
                    var url = backend.adminService + "/api/log/export?" + "condition=" + JSON.stringify(con);
                    yufp.util.download(url);
                    me.dialogVisible = false;
                }
            },
            mounted: function () {
                var me = this;
                yufp.lookup.bind("LOG_TYPE", function (lookup) {
                    me.queryFileds[0].options = lookup;
                });
            }
        });
    };

    exports.onmessage = function (type, message) {

    };
    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }
})