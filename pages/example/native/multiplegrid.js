/**
 * Created by helin3 on 2017/11/16.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg("NATIONALITY");
        // // 本地数据字典
        // var _typeOptions = [
        //     { key: 'CN', value: '中国' },
        //     { key: 'US', value: '美国' },
        //     { key: 'JP', value: '日本' },
        //     { key: 'EU', value: '欧元区' }
        // ]
        // var typeKeyValue = _typeOptions.reduce(function(acc, cur){
        //     acc[cur.key] = cur.value
        //     return acc
        // }, {});
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
            el: "#example_multiplegrid",
            mounted: function() {
                var me = this;
                yufp.lookup.bind("NATIONALITY", function (options) {
                    me.typeOptions = options;
                });
                this.queryMainGridFn()
            },
            data: {
                height: yufp.custom.viewSize().height - 120,
                mainGrid: {
                    data: null,
                    total: null,
                    loading: true,
                    multipleSelection: [],
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
                statusOptions: ['published', 'draft', 'deleted']
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
                typeFilter: function(key) {
                    return yufp.lookup.convertKey("NATIONALITY", key);
                }
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
                selectionChangeFn: function(val) {
                    this.mainGrid.multipleSelection = val
                },
                queryMainGridFn: function() {
                    var me = this
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
                },
                resetQueryCondFn: function() {
                    this.mainGrid.paging = {
                        page: 1,
                        size: 10
                    }
                    this.mainGrid.query = {
                        title: '',
                        create_at: '',
                        type: ''
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