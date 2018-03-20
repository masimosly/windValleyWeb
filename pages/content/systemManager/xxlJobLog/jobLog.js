/**
 * Created by zhanghan on 2017/12/8
 * 调度日志
 */
define(
    [
        './custom/widgets/js/YufpUserSelector.js',
        './custom/widgets/js/yufpOrgTree.js',
        './custom/widgets/js/yufpTemplateSelector.js'//数据权限模板选择器  add by chenlin
    ],
    function (require, exports) {
        //page加载完成后调用ready方法
        exports.ready = function (hashCode, data, cite) {
            yufp.lookup.reg('TRIGGER_CODE','HANDLE_CODE');
            var vm = yufp.custom.vue({
                el: cite.el,
                data: function() {
                    var me = this;
                    return {
                        userId:yufp.session.userId,
                        dataRoot:yufp.session.org.code,
                        height: yufp.custom.viewSize().height - 20,
                        orgRootId:yufp.session.org.code,
                        viewTitle: yufp.lookup.find('CRUD_TYPE', false),
                        formDisabled: false,
                        queryFileds: [
                            {placeholder: '任务描述', field: 'jobName', type: 'input' },
                            {placeholder: '调度结果', field: 'triggerCode', type: 'select',  dataCode: 'TRIGGER_CODE'},
                            {placeholder: '执行结果', field: 'handleCode', type: 'select' ,dataCode: 'HANDLE_CODE'}
                        ],
                        queryButtons: [
                            {
                                label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                                me.mainGrid.query.triggerCode=model.triggerCode;
                                me.mainGrid.query.jobName=model.jobName;
                                me.mainGrid.query.handleCode=model.handleCode;
                                me.mainGrid.query.jobId=data;
                                me.mainGrid.dataUrl = backend.adminService+"/api/adminjoblog/querypage",
                                me.queryMainGridFn();
                            }
                            },
                            {label: '重置', op: 'reset', type: 'primary', icon: 'information'}
                        ],
                        styleObj: {height: yufp.custom.viewSize().height + 'px', overflow: 'auto'},
                        mainGrid: {
                            data: null,
                            total: null,
                            loading: false,
                            multipleSelection: [],
                            query: {
                                jobId: '',
                                triggerCode: '',
                                handleCode: '',
                                jobName:''
                            },
                            height: yufp.custom.viewSize().height - 150,
                            checkbox: true,
                            dataUrl: backend.adminService+'/api/adminjoblog/querypagebyid?jobId='+data,
                            currentRow: null,
                            dataParams:{},
                            tableColumns: [
                                { label: '调度名称', prop: 'jobDesc',resizable: true ,width: 150,},
                                { label: '调度时间', prop: 'triggerTime',resizable: true ,width: 150,},
                                { label: '调度地址', prop: 'executorAddress', width: 150,resizable: true },
                                { label: '调度结果', prop: 'triggerCode', type:'select',dataCode:'TRIGGER_CODE', resizable: true },
                                { label: '执行结果', prop: 'handleCode', width: 90,resizable: true, type: 'select' ,dataCode: 'HANDLE_CODE'},
                                { label: '调度备注', prop: 'triggerMsg', resizable: true, width: 600 , template: function () {
                                    return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.triggerMsg }}</a>\
                                </template>';
                                }},
                                { label: '执行时间', prop: 'handleTime',resizable: true},
                                { label: '执行备注', prop: 'handleMsg', type:'date', resizable: true},
                            ]
                        },
                        updateFields: [{
                            columnCount: 1,
                            fields: [
                                { field: 'userName',label: '最新更新人'},
                                { field: 'lastChgDt',label: '最新更新时间'}
                            ]
                        }],
                        textMap: {
                            update: '修改',
                            detail: '详情',
                            create: '新增'
                        },
                        dialogFormVisible: false,
                        checkDetil: false,
                        dialogStatus: '',
                    }
                },
                filters: {
                    statusFilter: function (status) {
                        return stsKeyValue[status];
                    },
                    dateFilter: function(d) {
                        return parseTime(d, '{y}-{m}-{d}');
                    }
                },
                mounted: function(){
                    var me = this;
                },
                methods: {
                    queryMainGridFn: function () {
                        var me = this;
                        jobId = data;
                        var param = {
                            condition: JSON.stringify({
                                triggerCode: this.mainGrid.query.triggerCode?this.mainGrid.query.triggerCode:null,
                                jobName: this.mainGrid.query.jobName?this.mainGrid.query.jobName:null,
                                handleCode: this.mainGrid.query.handleCode?this.mainGrid.query.handleCode:null
                            })
                        };
                        me.$refs.logtable.remoteData(param);
                    },
                    openDetailFn: function (row) {
                        var me = this;
                        if (this.$refs.logtable.selections.length != 1) {
                            this.$message({message: '请选择一条记录', type: 'warning'})
                            return;
                        }
                        if (this.$refs.logtable.selections[0].roleSts == 'A') {
                            this.$message({message: '只能选择失效和待生效的数据', type: 'warning'});
                            return;
                        }
                        var logContent = '';
                        var fromLineNum = 1;
                        var executorAddress = me.$refs.logtable.selections[0].executorAddress;
                        var triggerTime = me.$refs.logtable.selections[0].triggerTime;
                        var logId = me.$refs.logtable.selections[0].id;
                        var triggerCode =  me.$refs.logtable.selections[0].triggerCode;
                        if(typeof(executorAddress)=="undefined"){
                            this.$message({message: '未发现调度地址无法查看！', type: 'warning'});
                            return;
                        }
                        if(typeof(triggerCode)=="undefined"){
                            this.$message({message: '未调度无法查看！', type: 'warning'});
                            return;
                        }
                        if(typeof(triggerTime)=="undefined" || triggerCode != 200){
                            this.$message({message: '未调度成功无法查看！', type: 'warning'});
                            return;
                        }
                        yufp.service.request({
                            method: 'get',
                            url: backend.adminService + "/api/adminjoblog/logDetailCat",
                            data: {
                                executorAddress: executorAddress,
                                triggerTime : triggerTime,
                                logId : logId,
                                fromLineNum : fromLineNum
                            },
                            callback: function (code, message, response) {
                                logContent = response.data.logContent;
                                me.detailFn(logContent);
                            }
                        });
                    },
                    detailFn: function (logContent) {
                        var me = this;
                        me.checkDetil = true;
                        this.$nextTick(function () {
                            var xx = me.$refs.checkDetil
                            xx.innerHTML =  logContent;
                        });
                    },
                    checkLogFn: function (row) {
                        var me = this;
                        me.dialogFormVisible = true;
                        this.$nextTick(function () {
                            var xx = me.$refs.ideEditor
                            xx.innerHTML =  row.row.triggerMsg;
                        });

                    },
                    deleteFn: function () {
                        var vue = this;
                        if (this.$refs.logtable.selections.length > 0) {
                            var id = '';
                            for (var i = 0; i < this.$refs.logtable.selections.length; i++) {
                                var row = this.$refs.logtable.selections[i];
                                id = id + ',' + row.id;
                            }
                            this.$confirm('此操作将删除该日志, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                center: true
                            }).then(function () {
                                yufp.service.request({
                                    method: 'POST',
                                    url: backend.adminService+"/api/adminjoblog/deletebatch",
                                    data: {
                                        id: id
                                    },
                                    callback: function (code, message, response) {
                                        vue.$message({message: '数据删除成功！'});
                                        vue.queryMainGridFn()
                                    }
                                });
                            })
                        } else {
                            this.$message({message: '请先选择要删除的数据', type: 'warning'});
                            return;
                        }
                    },
                    //终止任务
                    logKill: function () {
                        var vue = this;
                        if (this.$refs.logtable.selections.length != 1) {
                            this.$message({message: '请选择一条记录！', type: 'warning'})
                            return;
                        }
                        var row = this.$refs.logtable.selections[0];
                        if(row.triggerCode != 200 || row.handleCode != 0 ){
                            this.$message({message: '只能终止调度成功且未执行完毕的任务！', type: 'warning'})
                            return;
                        }
                        var id = row.id;
                        this.$confirm('此操作将终止该任务, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/adminjoblog/logKill",
                                data: {
                                    idStr: id
                                },
                                callback: function (code, message, response) {
                                    vue.$message({message: '任务终止成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        })
                    }
                }
            });
        };
    });