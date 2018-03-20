/**
 * Created by helin3 on 2017/11/17.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        // 本地数据字典
        var _typeOptions = [
            { key: 'CN', value: '中国' },
            { key: 'US', value: '美国' },
            { key: 'JP', value: '日本' },
            { key: 'EU', value: '欧元区' }
        ]
        // arr to obj
        var typeKeyValue = _typeOptions.reduce(function(acc, cur){
            acc[cur.key] = cur.value
            return acc
        }, {})
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
        var _AllHeaders = {
            CN: [
                { label: '编码', prop: 'id' },
                { label: '名称', prop: 'title', width: 260 },
                { label: '分组一', children: [
                    { label: '时间', prop: 'create_at', width: 110 },
                    { label: '类型', prop: 'type', width: 120, filter: 'typeFilter' }
                ] },
                { label: '分组二', children: [
                    { label: '参与人', children: [
                        { label: '作者', prop: 'author', width: 120 },
                        { label: '审核人', prop: 'auditor', width: 120 }
                    ] },
                    { label: '子组', children: [
                        { label: '阅读数', prop: 'pageviews', width: 130 },
                        { label: '状态', prop: 'status', width: 230 }
                    ] }
                ] }
            ],
            US: [
                { label: '编码', prop: 'id' },
                { label: '名称', prop: 'title', width: 260 },
                { label: '一级表头', children: [
                    { label: '参与人', children: [
                        { label: '作者', prop: 'author', width: 110 },
                        { label: '审核人', prop: 'auditor', width: 110 }
                    ] },
                    { label: '二级表头', children: [
                        { label: '阅读数', prop: 'pageviews', width: 100 },
                        { label: '状态', prop: 'status', width: 300 }
                    ] }
                ] }
            ],
            JP: [
                { label: '编码', prop: 'id' },
                { label: '名称', prop: 'title', width: 260 },
                { label: '作者', prop: 'author', width: 110 },
                { label: '审核人', prop: 'auditor', width: 110 },
                { label: '阅读数', prop: 'pageviews', width: 100 },
                { label: '状态', prop: 'status', width: 300 }
            ],
            EU: [
                { label: '编码', prop: 'id' },
                { label: '名称', prop: 'title', width: 260 },
                { label: '作者', prop: 'author', width: 110 },
                { label: '审核人', prop: 'auditor', width: 110 },
                { label: '阅读数', prop: 'pageviews', width: 100 },
                { label: '状态', prop: 'status', width: 300 }
            ]
        }
        //创建virtual model
        var vm =  yufp.custom.vue({
            el: "#dynamic_multiple_grid",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data: {
                height: yufp.custom.viewSize().height - 120,
                mainGrid: {
                    data: null,
                    total: null,
                    loading: false,
                    multipleSelection: [],
                    paging: {
                        page: 1,
                        size: 10
                    },
                    query: {
                        title: '',
                        create_at: '',
                        type: 'CN'
                    },
                    rules: {
                        type: [
                            { required: true, message: '请选择类型', trigger: 'change' }
                        ]
                        // ,
                        // create_at: [
                        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                        // ]
                    }
                },
                typeOptions: _typeOptions,
                statusOptions: ['published', 'draft', 'deleted'],
                tableKey: 0,
                // 仅最叶子层表头需要宽度,不设置的话，默认100
                currentHeaders: _AllHeaders.CN,
                AllHeaders: _AllHeaders
            },
            mounted: function(){

            },
            methods: {
                startChangeFn: function(val) {
                    this.mainGrid.paging.page = val
                    this.queryMainGridFn()
                },
                sizeChangeFn: function(val) {
                    this.mainGrid.paging.page = 1
                    this.mainGrid.paging.size = val
                    this.queryMainGridFn()
                },
                queryMainGridFn: function() {
                    var me = this;
                    this.$refs.queryForm.validate(function(valid){
                        if (valid) {
                            me.mainGrid.loading = true
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
                        } else {
                            return false
                        }
                    })
                },
                resetQueryCondFn: function() {
                    this.$refs.queryForm.resetFields()
                    this.mainGrid.paging = {
                        page: 1,
                        size: 10
                    }
                    const h = this.$createElement
                    this.$msgbox({
                        title: '提示',
                        message: h('span', { style: 'color:red' }, '你的提示')
                    })
                },
                changeHeaderFn: function() {
                    this.tableKey += 1
                    this.currentHeaders = this.AllHeaders[this.mainGrid.query.type]
                    this.mainGrid.data = null
                    this.mainGrid.total = null
                }
            },
            filters: {
                statusFilter: function(status) {
                    const statusMap = {
                        published: 'success',
                        draft: 'gray',
                        deleted: 'danger'
                    }
                    return statusMap[status]
                },
                typeFilter: function(type) {
                    return typeKeyValue[type]
                }
            },
        });
    };

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }

});