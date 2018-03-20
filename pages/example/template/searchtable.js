/* 
* Created by zhangkun on 2017/12/07
*/
define( function(require, exports) {
    exports.ready = function(hashCode, data, cite){
        var vm = yufp.custom.vue({
            el: "#template_searchtable",
            data: function(){
                var me = this;
                return {
                    queryFields: [
                        {placeholder: '角色名称', field: 'title', type: 'input'}
                    ],
                    height: yufp.frame.size().height - 103-92,//默认103+两行标题36*2
                    tableColumns: [
                        { label: '编码', prop: 'id',width:80 },
                        { label: '角色名称', prop: 'title', sortable: true, resizable: true}
                    ],
                }
            },
            methods: {
                search: function(row, event){
                    var params = {
                        id: row.id
                    }
                    this.$refs.mytable1.remoteData(params);
                }
            }
        })
    }
});