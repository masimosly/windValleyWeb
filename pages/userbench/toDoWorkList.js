
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg("WF_NODE_STATUS");
        var _typeOptions = [
            { key: 'bizSeqNo', value: '申请流水号' },
            { key: 'wfJobName', value: '客户名称' }
        ]
        var vm =  yufp.custom.vue({
            el: "#toDoWorkList",
            data: {
                query:{
                    input:'',
                    select: 'bizSeqNo'
                },
                typeOptions: _typeOptions,
                urls:{
                    dataUrl: backend.echainService+'/api/joinbeanch/getUserTodos'
                    //列表数据查询
                },
                mainGrid:{
                },
                dataParams: {sessionLoginCode:yufp.session.user.loginCode},
                tableColumns: [
                    { label: '申请流水号', prop: 'bizSeqNo'},
                    { label: '流程实例号', prop: 'instanceId'},
                    { label: '流程标识', prop: 'wfSign'},
                    { label: '客户名称', prop: 'wfJobName' },
                    { label: '前一结点', prop: 'preNodeName' },
                    { label: '当前结点', prop: 'nodeName' },
                    { label: '当前办理人', prop: 'currentNodeUser' },
                    { label: '节点状态', prop: 'nodeStatus' , dataCode: 'WF_NODE_STATUS'},
                    { label: '节点开始时间', prop: 'nodeStartTime' },
                    { label: '流程名称', prop: 'wfName'}
                ]
            },
            methods: {
                doSearchFn:function(){//查询
                    var bizSeqNo;
                    var wfJobName;
                    if(this.query.input != ""){
                        if(this.query.select == "bizSeqNo"){
                            bizSeqNo=this.query.input
                        }else if(this.query.select == "wfJobName"){
                            wfJobName=this.query.input
                        }
                    }  //若为空字符串不参与查询

                    var param={
                        bizSeqNo:bizSeqNo,
                        wfJobName:wfJobName,
                        sessionLoginCode:yufp.session.user.loginCode
                    }
                    var params = {
                        condition:JSON.stringify(param)
                    }
                    this.dataParams = params;
                    this.$refs.WorkListTodoList.remoteData(params);
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