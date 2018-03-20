/**
 * Created by yumeng on 2017/11/17.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('NATIONALITY,YESNO');
        //创建virtual model
        var  vm =  yufp.custom.vue({
            el: "#exampleForm",
            data: function(){
                var me = this;
                return {
                    editFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'title', label: '信息标题',placeholder:'5到25个字符', type: 'input',
                                rules:[{ required: true, message: '请输入信息标题', trigger: 'blur' },
                                { min: 5, max: 25, message: '长度在5到25个字符', trigger: 'blur' }]
                            },
                            { field: 'type', label: '类型', type: 'select', dataCode: 'NATIONALITY' ,
                                rules:[{ required: true, message: '请选择类型', trigger: 'blur' }]
                            },
                            { field: 'status', label: '状态', type: 'select', dataCode: 'PUBLISH_STATUS' },
                            { field: 'author',label: '作者', type: 'input',placeholder:' 编辑人姓名'},
                            { field: 'telNumber',label: '联系电话',type: 'input',placeholder:' 编辑人联系电话'},
                            { field:'time',label:'发布时间',type:'daterange',placeholder:'设置自动发布时间'},
                            { field: 'tags', label: '所属标签', type: 'checkbox', dataCode: 'NATIONALITY', 
                                change:function (val) {
                                    console.log(val)
                            }},
                            { field: 'isTop', label: '是否置顶', type: 'radio', dataCode: 'YESNO',
                                change:function (val) {
                                    console.log(val)
                                }
                            }
                        ]
                    },{
                        columnCount: 1,
                        fields: [
                            { field: 'remark', label: '内容',placeholder:'2000个字符以内',  type: 'textarea', rows: 6 }
                        ]
                    }],
                    buttons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", click: function () {
                            //do something
                        }},
                        {label: '保存', type: 'primary', icon: "check", op:'submit', click: function (model,valid) {
                            if(valid){
                                me.$msgbox.alert(model, '提示');
                                //do something
                            }
                        }},
                        {label: '重置', type: 'primary', icon: "yx-loop2" ,op:'reset', click: function (model) {
                            //do something
                        }}
                    ]
                }
            },
            methods: {

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