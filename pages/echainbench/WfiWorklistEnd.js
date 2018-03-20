
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var _typeOptions = [
            { key: 'bizSeqNo', value: '业务流水号' },
            { key: 'author', value: '发起者' }
        ]
        var vm =  yufp.custom.vue({
            el: "#WfiWorklistEnd",
            data: {
                query:{
                    input:'',
                    select: 'bizSeqNo'
                },
                typeOptions: _typeOptions,
                urls:{
                    dataUrl: backend.echainService+'/api/bench/queryWfInstanceEnd'
                    //列表数据查询
                },
                mainGrid:{
                },
                dataParams: {sessionInstuCde:yufp.session.instu.code},
                tableColumns: [
                    { label: '业务流水号', prop: 'bizseqno'},
                    { label: '流程实例号', prop: 'instanceid'},
                    { label: '流程名称', prop: 'wfjobname' },
                    { label: '流程开始时间', prop: 'wfstarttime'},
                    { label: '流程结束时间', prop: 'wfendtime'},
                    { label: '花费时间', prop: 'costtimes' },
                    { label: '最后办理人', prop: 'lastuser' },
                    { label: '发起者', prop: 'author' }
                ]
            },
            methods: {
                doSearchFn:function(){//查询
                    var bizSeqNo;
                    var author;
                    if(this.query.input != ""){
                        if(this.query.select == "bizSeqNo"){
                            bizSeqNo=this.query.input
                        }else if(this.query.select == "author"){
                            author=this.query.input
                        }
                    }  //若为空字符串不参与查询

                    var param={
                        bizSeqNo:bizSeqNo,
                        author:author,
                        sessionInstuCde:yufp.session.instu.code
                    }
                    var params = {
                        condition:JSON.stringify(param)
                    }
                    this.dataParams = params;
                    this.$refs.WfiWorklistEndList.remoteData(params);
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