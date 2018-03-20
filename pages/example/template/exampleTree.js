/**
 * Created by yumeng on 2017/11/26.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('CRUD_TYPE,NATIONALITY,PUBLISH_STATUS');

        var parseTime = yufp.util.dateFormat;
        var vm =  yufp.custom.vue({
            el: "#exampleTree",
            data: function(){
                var me = this;
                return {
                    async:false,
                    param:{UNITID:"0000",LEVELUNIT:"1"},
                    queryFields: [
                        {placeholder: '标题', field: 'title', type: 'input'},
                        {placeholder: '类型', field: 'type', type: 'select', dataCode: 'NATIONALITY' }
                    ],
                    tableColumns: [
                        { label: '编码', prop: 'id', width: 80 },
                        { label: '名称', prop: 'title', width: 250, sortable: true, resizable: true },
                        { label: '类型', prop: 'type', width: 110, dataCode: 'NATIONALITY' },
                        { label: '阅读数', prop: 'pageviews', width: 100 },
                        { label: '状态', prop: 'status', width: 120, dataCode: 'PUBLISH_STATUS' },
                        { label: '时间', prop: 'create_at'}
                    ],

                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'title', label: '名称' },
                            { field: 'create_at', label: '时间', type: 'date' },
                            { field: 'author',label: '作者' },
                            { field: 'auditor', label: '审核人' },
                            { field: 'type', label: '类型', type: 'select', dataCode: 'NATIONALITY' },
                            { field: 'status', label: '状态', type: 'select', dataCode: 'PUBLISH_STATUS' }
                        ]
                    },{
                        columnCount: 1,
                        fields: [
                            { field: 'remark', label: '点评', type: 'textarea', rows: 3 }
                        ]
                    }],
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                            me.$msgbox.alert(model, '提示');
                            //请调用服务进行后台保存
                        }}
                    ],
                    height: yufp.frame.size().height,
                    dialogVisible: false,
                    formDisabled: false,
                    viewType: 'DETAIL',
                    viewTitle: yufp.lookup.find('CRUD_TYPE', false)
                }
            },
            methods: {
                switchStatus: function (viewType, editable) {
                    this.viewType = viewType;
                    this.dialogVisible = true;
                    this.formDisabled = !editable;
                    this.updateButtons[0].hidden = !editable;
                    this.updateButtons[1].hidden = !editable;
                },
                nodeClickFn: function (nodeData, node, self) {
                    vm.$refs.mytable.remoteData();
                },
                addFn: function(){
                    var me = this;
                    this.switchStatus('ADD', true);
                    this.$nextTick(function () {
                        this.$refs.myform.resetFields();
                    });
                },
                modifyFn: function(){
                    if (this.$refs.mytable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
                    this.switchStatus('EDIT', true);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.myform.formModel, this.$refs.mytable.selections[0]);
                    });
                },
                infoFn: function(){
                    if (this.$refs.mytable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
                    this.switchStatus('DETAIL', false);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.myform.formModel, this.$refs.mytable.selections[0]);
                    });
                }
            }
        });
    };

});