/**
 * created by helin3 2017-12-04
 */
define(function (require, exports) {
    exports.localLookup = {
        CRUD_TYPE: [
            {key: "ADD", value: '新增'},
            {key: "EDIT", value: '修改'},
            {key: "DETAIL", value: '详情'}
        ],
        GENDER: [
            {key: "01", value: '男'},
            {key: "02", value: '女'}
        ],

        YESNO: [
            {key: "01", value: '是'},
            {key: "02", value: '否'}
        ],

        HASNO: [
            {key: "01", value: '有'},
            {key: "02", value: '无'}
        ],
        OBJECT_TYPE:[
            {"key":'R',"value":'角色'},
            {"key":'U',"value":'用户'},
            {"key":'D',"value":'部门'},
            {"key":'G',"value":'机构'}
        ],
        RESOURCE_TYPE:[
            {"key":'M',"value":'菜单'},
            {"key":'C',"value":'控制点'},
            {"key":'D',"value":'数据权限'}
        ],
        RECIVE_TYPE:[
            {"key":'R',"value":'角色'},
            {"key":'G',"value":'机构'}
        ],
        PUB_STS:[
            {"key":'O',"value":'已发布'},
            {"key":'C',"value":'未发布'}
        ],
		NOTICE_LEVEL:[
            {"key":'I',"value":'重要'},
            {"key":'N',"value":'一般'}
        ],
        TOP_FLAG:[
            {"key":'I',"value":'是'},
            {"key":'N',"value":'否'}
        ]

    };
});