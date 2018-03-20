define(function (require, exports) {
    var List = [];
    var count = 97;

    for (var i = 0; i < count; i++) {
        List.push(Mock.mock({
            code: '@natural',
            prodName: '@ctitle(4, 10)',
            qwhkrq: '@date',
            fkzf: '@natural',
            'type|1': ['CN', 'US', 'JP', 'EU'],
            zh: '@natural',
            money: '@float(60, 1000)',
            createUser: '@cname',
            commitTime: '@date',
            'status|1': ['published', 'draft', 'deleted']
        }))
    }

    function paramUrl2Obj(url) {
        var search = url.split('?')[1]
        if (!search) {
            return {}
        }
        return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\n/g, '\\n') + '"}')
    }

    function paramBody2Obj(body) {
        if (!body) {
            return {}
        }
        return JSON.parse('{"' + decodeURIComponent(body).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/\n/g, '\\n') + '"}')
    }

    exports.getList = function (config) {
        var reqData = paramBody2Obj(config.body)
        var page = reqData.page;
        var size = reqData.size;
        var condi = reqData.condition ? JSON.parse(reqData.condition) : {};

        var mockList = List.filter(function (item) {
            if(condi.prodName && item.prodName.indexOf(condi.prodName) < 0) return false
            return true
        });

        var pageList = [];
        if (page && size) {
            pageList = mockList.filter(function(item, index){
                return index < size * page && index >= size * (page - 1)
            });
        } else {
            pageList = mockList;
        }

        return {
            total: mockList.length,
            data: pageList
        }
    }

})