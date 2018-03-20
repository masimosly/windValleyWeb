/**
 * Created by helin3 on 2017/11/16.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        // yufp.lookup.reg("CUST_TYPE,IDENT_TYPE,NATIONALITY");
        yufp.lookup.reg("NATIONALITY");
        var parseTime = function(time, cFormat) {
            if (arguments.length === 0) {
                return null
            }
            var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
            var date
            if (typeof time === 'object') {
                date = time
            } else {
                if (('' + time).length === 10) time = parseInt(time) * 1000
                date = new Date(time)
            }
            var formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
            }
            var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function(result, key){
                    var value = formatObj[key]
                    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                if (result.length > 0 && value < 10) {
                    value = '0' + value
                }
                return value || 0
            })
            return time_str
        }
        //创建virtual model
        var vm =  yufp.custom.vue({
            el: "#example_gridcrud",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data: {
                height: yufp.custom.viewSize().height - 160,
                mainGrid: {
                    data: null,
                    total: null,
                    loading: false,
                    currentRow: null,
                    paging: {
                        page: 1,
                        size: 10
                    },
                    query: {
                        title: '',
                        create_at: '',
                        type: ''
                    }
                },
                typeOptions: [],
                statusOptions: ['published', 'draft', 'deleted'],
                dialogFormVisible: false,
                dialogStatus: '',
                dialogDisabled: true,
                temp: {
                    id: undefined,
                    importance: 0,
                    remark: '',
                    create_at: 0,
                    title: '',
                    type: '',
                    status: 'published'
                },
                textMap: {
                    update: '修改',
                    create: '新增',
                    detail: '详情'
                }
            },
            mounted: function(){
                var me = this;
                yufp.lookup.bind("NATIONALITY", function (options) {
                    me.typeOptions = options;
                });
                this.queryMainGridFn()
            },
            filters: {
                statusFilter: function(status) {
                    var statusMap = {
                        published: 'success',
                        draft: 'gray',
                        deleted: 'danger'
                    };
                    return statusMap[status];
                },
                typeFilter: function(key) {
                    return yufp.lookup.convertKey("NATIONALITY", key);
                }
            },
            methods: {
                startChangeFn: function (val) {
                    this.mainGrid.paging.page = val
                    this.queryMainGridFn()
                },
                sizeChangeFn: function (val) {
                    this.mainGrid.paging.page = 1
                    this.mainGrid.paging.size = val
                    this.queryMainGridFn()
                },
                rowClickFn: function (row) {
                    this.mainGrid.currentRow = row
                },
                queryMainGridFn: function () {
                    var me = this;
                    me.mainGrid.loading = false
                    var param = {
                        page: me.mainGrid.paging.page,
                        size: me.mainGrid.paging.size,
                        condition: JSON.stringify({
                            title: me.mainGrid.query.title,
                            create_at: me.mainGrid.query.create_at ? parseTime(me.mainGrid.query.create_at, '{y}-{m}-{d}') : '',
                            type: me.mainGrid.query.type
                        })
                    }
                    //发起请求
                    yufp.service.request({
                        method: 'GET',
                        url: "/trade/example/list",
                        data: param,
                        callback: function (code, message, response) {
                            me.mainGrid.data = response.data;
                            me.mainGrid.total = response.total;
                            me.mainGrid.loading = false;
                        }
                    });
                },
                resetQueryCondFn: function () {
                    this.mainGrid.paging = {
                        page: 1,
                        size: 10
                    }
                    this.mainGrid.query = {
                        title: '',
                        create_at: '',
                        type: ''
                    }
                },
                resetTempFn: function () {
                    this.temp = {
                        id: undefined,
                        importance: 0,
                        remark: '',
                        create_at: 0,
                        title: '',
                        status: 'published',
                        type: ''
                    }
                },
                openCreateFn: function () {
                    this.resetTempFn()
                    this.dialogDisabled = false
                    this.dialogStatus = 'create'
                    this.dialogFormVisible = true
                },
                saveCreateFn: function () {
                    this.temp.id = parseInt(Math.random() * 100) + 1024
                    this.temp.create_at = parseTime(new Date(), '{y}-{m}-{d}')
                    this.temp.author = '原创作者'
                    this.dialogFormVisible = false
                    // fetchSave(this.temp).then(response => {
                    //         this.$notify({ title: '提示', message: '保存成功', type: 'success' })
                    //     this.queryMainGridFn()
                    // })
                    // this.list.unshift(this.temp)
                },
                openEditFn: function () {
                    if (!this.mainGrid.currentRow) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return
                    }
                    this.temp = Object.assign({}, this.mainGrid.currentRow)
                    this.dialogDisabled = false
                    this.dialogStatus = 'update'
                    this.dialogFormVisible = true
                },
                saveEditFn: function () {
                    this.temp.create_at = parseTime(new Date(), '{y}-{m}-{d}')
                    this.dialogFormVisible = false
                    // fetchSave(this.temp).then(response => {
                    //         this.$notify({ title: '提示', message: '保存成功', type: 'success', duration: 2000 })
                    //     this.queryMainGridFn()
                    // })
                },
                openDetailFn: function () {
                    if (!this.mainGrid.currentRow) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return
                    }
                    this.temp = Object.assign({}, this.mainGrid.currentRow)
                    this.dialogDisabled = true
                    this.dialogStatus = 'detail'
                    this.dialogFormVisible = true
                },
                handleExportFn: function () {

                },
                handleModifyStatus: function (row, status) {
                    if (status === 'deleted') {
                        // fetchDel({
                        //         ids: row.id
                        //     }).then(() => {
                        //         this.$message({ message: '操作成功', type: 'success' })
                        //     this.queryMainGridFn()
                        // })
                    } else {
                        this.$message({message: '操作成功', type: 'success'})
                        row.status = status
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