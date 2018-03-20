
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var _typeOptions = [
            { key: 'bizSeqNo', value: '业务流水号' }
        ]
        var vm =  yufp.custom.vue({
            el: "#WfiWorklistHang",
            data: {
                query:{
                    input:'',
                    select: 'bizSeqNo'
                },
                typeOptions: _typeOptions,
                urls:{
                    dataUrl: backend.echainService+'/api/bench/queryWfInstanceHang'
                    //列表数据查询
                },
                mainGrid:{
                },
                dataParams: {sessionInstuCde:yufp.session.instu.code},
                tableColumns: [
                    { label: '业务流水号', prop: 'bizseqno'},
                    { label: '流程实例号', prop: 'instanceid'},
                    { label: '前一节点', prop: 'prenodename' },
                    { label: '当前结点', prop: 'nodename' },
                    { label: '当前办理人', prop: 'currentnodeuser' },
                    { label: '节点开始时间', prop: 'nodestarttime' },
                    { label: '流程名称', prop: 'wfname'}
                ]
            },
            methods: {
                doSearchFn:function(){//查询
                    var bizSeqNo;
                    if(this.query.input != ""){
                        if(this.query.select == "bizSeqNo"){
                            bizSeqNo=this.query.input
                        }

                    }  //若为空字符串不参与查询

                    var param={
                        bizSeqNo:bizSeqNo,
                        sessionInstuCde:yufp.session.instu.code
                    }
                    var params = {
                        condition:JSON.stringify(param)
                    }
                    this.dataParams = params;
                    this.$refs.WfiWorklistHangList.remoteData(params);
                },
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