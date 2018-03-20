/**
 * Created by yumeng on 2017/11/17.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        //创建virtual model
        var vm = yufp.custom.vue({
            el: "#exampleSteps1",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data: function () {
                var me = this;
                return {
                    active: 0,
                    step:true,
                    step1:false,
                    step2:false,
                    editFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'name', label: '姓名',placeholder:'2到10个字符', type: 'input',
                                rules:[{ required: true, message: '请输入姓名', trigger: 'blur' },
                                    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }]
                            },
                            { field: 'education', label: '学历', type: 'select', dataCode: 'EDUCATION_TYPE' ,
                                rules:[{ required: true, message: '请选择学历', trigger: 'change' }]
                            },
                            { field: 'sex', label: '性别', type: 'radio', dataCode: 'GENDER',
                                rules:[{ required: true, message: '请选择性别', trigger: 'change' }]
                            },
                            { field: 'idCard', label: '证件类型', type: 'select', dataCode: 'IDENT_TYPE',
                                rules:[{required: true, message: '请选择证件类型', trigger: 'change'}]
                            },
                            { field:'birthday',label:'出生日期',type:'date',placeholder:'出生日期',
                                rules:[{type: 'date', required: true, message: '请选择出生日期', trigger: 'blur'}]
                            },
                            { field: 'idNumber',label: '证件号码', type: 'input',placeholder:' 证件号码',
                                rules:[{ required: true, message: '请输入证件号码', trigger: 'blur' }]
                            },
                            { field: 'company',label: '所在公司', type: 'input',placeholder:' 公司名称'},
                            { field: 'mobileNumber',label: '手机号码',type: 'input',placeholder:' 手机号码'}
                        ]
                    },{
                        columnCount: 1,
                        fields: [
                            { field: 'remark', label: '备注',placeholder:'2000个字符以内',  type: 'textarea', rows: 6 }
                        ]
                    }],
                    buttons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", click: function () {
                            //do something
                        }},
                        {label: '下一步', type: 'primary', icon: "check", op:'submit', click: function (model,valid) {
                            if(valid){
                                me.$msgbox.alert(model, '提示');
                                //do something
                                me.step=false;
                                me.step1=true;
                                me.active++;
                            }
                        }},
                        {label: '重置', type: 'primary', icon: "yx-loop2" ,op:'reset', click: function (model) {
                            //do something
                        }}
                    ],

                    //setp1 form
                    editFields1: [{
                        columnCount: 2,
                        fields: [
                            { field: 'address', label: '居住地址',placeholder:'5到30个字符', type: 'input',
                                rules:[{ required: true, message: '请输入居住地址', trigger: 'blur' },
                                    { min: 5, max: 30, message: '5到30个字符', trigger: 'blur' }]
                            },
                            { field: 'status', label: '户籍状态', type: 'radio', dataCode: 'USER_STATUS',
                                rules:[{ required: true, message: '户籍状态', trigger: 'change' }]
                            },
                            { field:'date',label:'更新日期',type:'date',placeholder:'最后一次更新日期',
                                rules:[{type: 'date', required: true, message: '请选择更新日期', trigger: 'blur'}]
                            },
                            { field: 'number',label: '人口数量', type: 'input',placeholder:' 人口数量',
                                rules:[{ required: true, message: '请输入人口数量', trigger: 'blur' }]
                            },
                            { field: 'telNumber',label: '联系电话',type: 'input',placeholder:' 联系电话'},
                            { field: 'postalCode',label: '邮政编码', type: 'input',placeholder:' 邮政编码'}
                        ]
                    }],
                    buttons1: [
                        {label: '上一步', type: 'primary', icon: "yx-undo2", click: function () {
                            //do something
                            me.step=true;
                            me.step1=false;
                            me.active--;
                        }},
                        {label: '下一步', type: 'primary', icon: "check", op:'submit', click: function (model,valid) {
                            if(valid){
                                me.$msgbox.alert(model, '提示');
                                //do something
                                me.step1=false;
                                me.step2=true;
                                me.active++;
                            }
                        }},
                        {label: '重置', type: 'primary', icon: "yx-loop2" ,op:'reset', click: function (model) {
                            //do something
                        }}
                    ],

                    //setp2 form
                    editFields2: [{
                        columnCount: 2,
                        fields: [
                            { field: 'comAddress', label: '公司地址',placeholder:'5到30个字符', type: 'input',
                                rules:[{ required: true, message: '请输入公司地址', trigger: 'blur' },
                                    { min: 5, max: 30, message: '5到30个字符', trigger: 'blur' }]
                            },
                            { field: 'comStatus', label: '公司类型', type: 'radio', dataCode: 'CUST_TYPE',
                                rules:[{ required: true, message: '公司类型', trigger: 'change' }]
                            },
                            { field: 'comTelNumber',label: '联系电话',type: 'input',placeholder:' 联系电话'},
                            { field: 'comPostalCode',label: '邮政编码', type: 'input',placeholder:' 邮政编码'}
                        ]
                    }],
                    buttons2: [
                        {label: '上一步', type: 'primary', icon: "yx-undo2", click: function () {
                            //do something
                            //do something
                            me.step1=true;
                            me.step2=false;
                            me.active--;
                        }},
                        {label: '提交', type: 'primary', icon: "check", op:'submit', click: function (model,valid) {
                            if(valid){
                                me.$msgbox.alert(model, '提示');
                                //do something
                                me.active++;
                            }
                        }},
                        {label: '重置', type: 'primary', icon: "yx-loop2" ,op:'reset', click: function (model) {
                            //do something
                        }}
                    ]
                }
            },
            mounted: function () {

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