/* 
* Created by zhangkun on 2017/12/06
*/
define( function(require, exports) {
    exports.ready = function(hashCode, data, cite){
        yufp.lookup.reg('NATIONALITY');
        var vm = yufp.custom.vue({
          el: "#template_tabsearch",
          data: function() {
              var me = this;
              return {
                  queryFields: [
                      {placeholder: '关键字', field: 'id', type: 'input'},
                      {placeholder: '消息类型', field: 'type', type: 'select', dataCode: 'NATIONALITY'}
                  ],
                  tableColumns: [
                      { label: '编码', prop: 'id', width: 110 },
                      { label: '名称', prop: 'title', width: 200, sortable: true, resizable: true },
                      { label: '类型', prop: 'type', width: 110, dataCode: 'NATIONALITY' },
                      { label: '作者', prop: 'author', width: 110 },
                      { label: '审核人', prop: 'auditor', width: 110 },
                      { label: '阅读数', prop: 'pageviews', width: 100 },
                      { label: '状态', prop: 'status', width: 120, dataCode: 'PUBLISH_STATUS' },
                      { label: '时间', prop: 'create_at'}
                  ],
                  dataUrl: "/trade/example/list",
                  activeName: 'first'
            };
          },
          methods: {
              handleClick:function(tab, event) {

              }
          }
        });
      }
});