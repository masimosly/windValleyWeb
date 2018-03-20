/**
 * Created by yumeng on 2017/11/26.
 */
define([
    './custom/widgets/js/YufpDemoSelector.js',
    './libs/js-xlsx/xlsx.full.min.js'
],function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('CRUD_TYPE,NATIONALITY,PUBLISH_STATUS');
        var vm = yufp.custom.vue({
            el: cite.el,
            data: function () {
                var _self = this;
                return {
                    queryFields: [
                        {placeholder: '标题', field: 'title', type: 'input'},
                        {placeholder: '时间', field: 'create_at', type: 'date'},
                        {placeholder: '类型', field: 'type', type: 'select', dataCode: 'NATIONALITY'}
                    ],
                    forceColumn:true,//强制列紧随
                    thrift:false,//按钮是否是紧凑按钮，只显示图标
                    resetButton:true,//是否有重置按钮
                    displayMode:false,//高级搜索是否浮动
                    moreQueryFields:[
                        {placeholder: '标题2', field: 'title2', type: 'input'},
                        {placeholder: '时间2', field: 'create_at2', type: 'date'},
                        {placeholder: '时间3', field: 'create_at3', type: 'date'},
                        {placeholder: '时间4', field: 'create_at4', type: 'date'},
                        {placeholder: '时间5', field: 'create_at5', type: 'date'},
                        {placeholder: '时间6', field: 'create_at6', type: 'date'},
                        {placeholder: '时间7', field: 'create_at7', type: 'date'},
                        {placeholder: '类型2', field: 'type2', type: 'select', dataCode: 'NATIONALITY'}
                    ],
                    queryButtons: [
                        {label: '搜索', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if (valid) {
                                var param = {condition: JSON.stringify(model)};
                                _self.$refs.reftable.remoteData(param);
                            }
                        }},
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                    ],
                    tableColumns: [
                        {label: '编码', prop: 'id', width: 110},
                        {label: '名称', prop: 'title', width: 200, sortable: true, resizable: true},
                        {label: '类型', prop: 'type', width: 110, dataCode: 'NATIONALITY'},
                        {label: '参与人', headerAlign: 'center', children: [
                            {label: '作者', prop: 'author', width: 110},
                            {label: '审核人', prop: 'auditor', width: 110}
                        ]},
                        {label: '阅读数', prop: 'pageviews', width: 100},
                        {label: '状态', prop: 'status', width: 120, dataCode: 'PUBLISH_STATUS'},
                        {label: '时间', prop: 'create_at'}
                    ],
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'title', label: '名称',disabled: true,rules:[
                                { required: true, message: '必填项', trigger: 'blur' }
                            ]},
                            { field: 'create_at', label: '时间', type: 'date' },
                            { field: 'author',label: '作者', hidden:true},
                            { field: 'auditor', label: '审核人',disabled: true},
                            { field: 'type', label: '类型', type: 'select',  dataCode: 'YESNO',
                            	change:function(isOuter){
                                    _self.status = isOuter;
                                    if (isOuter == "01") {
                                      _self.updateFields[0].fields[2].hidden = false;
                                      _self.updateFields[0].fields[0].disabled = false;
                                      _self.updateFields[0].fields[3].disabled = false;
                                      _self.$refs.reform.preTreat();
                                    }
                                    if (isOuter == "02") {
                                      _self.updateFields[0].fields[2].hidden = true;
                                      _self.updateFields[0].fields[0].disabled = true;
                                      _self.updateFields[0].fields[3].disabled = true;
                                      _self.$refs.reform.preTreat();
                                    }
	                            }
                            },
                            { field: 'status', label: '状态', type: 'select', dataCode: 'PUBLISH_STATUS'},
                            { field: 'pageviews', label: '自定义', type: 'custom', is: 'yufp-demo-selector'}
                        ]
                    }, {
                        columnCount: 1,
                        fields: [
                            {field: 'remark', label: '点评', type: 'textarea', rows: 3}
                        ]
                    }
                ],
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            _self.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, click: function (model) {
                            var validate = false;
                            _self.$refs.reform.validate(function (valid) {
                                validate = valid;
                            });
                            if(!validate){
                                return;
                            }
                            yufp.service.request({
                                method: 'POST',
                                url: "/trade/example/save",
                                data: model,
                                callback: function (code, message, response) {
                                    if (code==0) {
                                        _self.$refs.reftable.remoteData();
                                        _self.$message('操作成功');
                                        _self.dialogVisible = false;
                                    }
                                }
                            });
                        }}
                    ],
                    height: yufp.frame.size().height - 103,
                    dialogVisible: false,
                    formDisabled: false,
                    viewType: 'DETAIL',
                    viewTitle: yufp.lookup.find('CRUD_TYPE', false)
                }
            },
            methods: {
                /**
                 * @param viewType 表单类型
                 * @param editable 可编辑,默认false
                 */
                switchStatus: function (viewType, editable) {
                    var _self = this;
                    _self.viewType = viewType;
                    //_self.updateButtons[0].hidden = !editable;
                    _self.updateButtons[1].hidden = !editable;
                    _self.formDisabled = !editable;
                    _self.dialogVisible = true;
                },
                addFn: function () {
                    var _self = this;
                    _self.switchStatus('ADD', true);
                    _self.$nextTick(function () {
						_self.$refs.reform.formModel.status = 'draft';
                    });
                },
                searchClick:function(){
                	alert('搜索');
                },
                modifyFn: function () {
                    if (this.$refs.reftable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'});
                        return;
                    }
                    this.switchStatus('EDIT', true);
                    this.$nextTick(function () {
                        // this.updateFields[0].fields[0].disabled = false;
                        // this.updateFields[0].fields[3].disabled = false;
                        // this.$refs.reform.preTreat();
                        yufp.extend(this.$refs.reform.formModel, this.$refs.reftable.selections[0]);
                    });
                },
                infoFn: function () {
                    if (this.$refs.reftable.selections.length != 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'});
                        return;
                    }
                    this.switchStatus('DETAIL', false);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.reform.formModel, this.$refs.reftable.selections[0]);
                    });
                },
                deleteFn: function () {
                    var _self = this;
                    var selections=_self.$refs.reftable.selections;
                    if (selections.length < 1) {
                        _self.$message({message: '请先选择一条记录', type: 'warning'});
                        return;
                    }
                    var len=selections.length,arr=[];
                    for(var i=0;i<len;i++){
                        arr.push(selections[i].id);
                    }
                    yufp.service.request({
                        method: 'POST',
                        url: "/trade/example/delete",
                        data: {
                            ids: arr.join(',')
                        },
                        callback: function (code, message, response) {
                            if (code==0) {
                                _self.$refs.reftable.remoteData();
                                _self.$message('操作成功');
                            }
                        }
                    });
                },
                exportFn: function () {
                    yufp.util.exportExcelByTable({
                        fileName:'下载文件',
                        importType: 'service',//page当前页 selected 选中的数据  service 后端数据
                        ref: this.$refs.reftable,
                        url: '/trade/example/list',
                        param:{}
                    });
                }
            }
        });
    };

});