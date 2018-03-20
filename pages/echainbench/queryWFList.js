
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var _typeOptions = [
            { key: 'wfSign', value: '流程标识' },
            { key: 'wfName', value: '流程名称' },
        ]
        var vm =  yufp.custom.vue({
            el: "#queryWFList",
            data: {
                query:{
                    input:'',
                    select: 'wfSign'
                },
                typeOptions: _typeOptions,
                urls:{
                    dataUrl: backend.echainService+'/api/bench/queryWfList',
                    reloadUrl:backend.echainService+'/api/bench/reloadWfCache'
                    //列表数据查询
                },
                mainGrid:{
                },
                dataParams: {
                    sessionOrgCode:yufp.session.org.code,
                    sessionLoginCode:yufp.session.user.loginCode
                },
                tableColumns: [
                    { label: '流程ID', prop: 'wfId' },
                    { label: '流程标识', prop: 'wfSign'},
                    { label: '流程名称', prop: 'wfName'},
                    { label: '版本', prop: 'wfVer' }
                ]
            },
            methods: {
                doSearchFn:function(){//查询
                    var wfSign;
                    var wfName;
                    if(this.query.input != ""){
                        if(this.query.select == "wfSign"){
                            wfSign=this.query.input
                        }else if(this.query.select == "wfName"){
                            wfName=this.query.input
                        }
                    }  //若为空字符串不参与查询

                    var param={
                        wfSign:wfSign,
                        wfName:wfName
                    }
                    var params = {
                        condition:JSON.stringify(param),
                        sessionOrgCode:yufp.session.org.code,
                        sessionLoginCode:yufp.session.user.loginCode
                    }
                    this.dataParams = params;
                    this.$refs.WFList.remoteData(params);
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