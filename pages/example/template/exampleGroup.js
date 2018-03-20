/**
 * Created by yumeng on 2017/11/17.
 */
define(function (require, exports) {

    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('GENDER,EDUCATION_TYPE,IDENT_TYPE');
        var vm =  yufp.custom.vue({
            el: "#exampleGroup",
            data: function(){
                var _this = this;
                return {
                    expandCollapseName: ['base'],
                    //未分组表单数据格式
                    baseFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'name', label: '姓名' },
                            { field: 'gender', label: '性别', type: 'select', dataCode: 'GENDER' },
                            { field: 'education', label: '学历', type: 'select', dataCode: 'EDUCATION_TYPE' },
                            { field: 'cardType', label: '证件类型', type: 'select', dataCode: 'IDENT_TYPE' },
                            { field: 'barthday',label: '出生日期',type: 'date' },
                            { field: 'cardNo', label: '证件号码' },
                            { field: 'company', label: '公司' },
                            { field: 'email', label: '邮箱' }
                        ]
                    }],
                    familyFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'peopleNum', label: '成员数', rules: [
                                {required: true, message: '必填项', trigger: 'blur' },
                                { validator: yufp.validator.number}
                            ] },
                            { field: 'home', label: '房屋情况'},
                            { field: 'address', label: '家庭地址' },
                            { field: 'postcode', label: '邮政编码'}
                        ]
                    }],
                    otherFields: [{
                        columnCount: 1,
                        fields: [
                            { field: 'desc', label: '备注', type: 'textarea'}
                        ]
                    }],
                    //分组表单数据格式
                    // totalFields:[
                    //     {
                    //             title: '基本信息',
                    //             name: 'base',
                    //             columnCount: 2,
                    //             fields: [
                    //                 { field: 'name', label: '姓名' },
                    //                 { field: 'gender', label: '性别', type: 'select', dataCode: 'GENDER' },
                    //                 { field: 'education', label: '学历', type: 'select', dataCode: 'EDUCATION_TYPE' },
                    //                 { field: 'cardType', label: '证件类型', type: 'select', dataCode: 'IDENT_TYPE' },
                    //                 { field: 'barthday',label: '出生日期',type: 'date' },
                    //                 { field: 'cardNo', label: '证件号码' },
                    //                 { field: 'company', label: '公司' },
                    //                 { field: 'email', label: '邮箱' }
                    //             ]
                    //     },
                    //     {
                    //             title: '家庭信息',
                    //             name: 'family',
                    //             columnCount: 2,
                    //             fields: [
                    //                 { field: 'peopleNum', label: '成员数', rules: [
                    //                     {required: true, message: '必填项', trigger: 'blur' },
                    //                     { validator: yufp.validator.number}
                    //                 ] },
                    //                 { field: 'home', label: '房屋情况'},
                    //                 { field: 'address', label: '家庭地址' },
                    //                 { field: 'postcode', label: '邮政编码'}
                    //             ]
                    //     },
                    //     {
                    //             title: '其他信息',
                    //             name: 'other',
                    //             columnCount: 1,
                    //             fields: [
                    //                 { field: 'desc', label: '备注', type: 'textarea'}
                    //             ]
                    //     }
                    // ],
                    baseRules: {
                        name:[
                            {required: true, message: '必填项', trigger: 'blur' }
                        ],
                        gender: [
                            { required: true, message: '必填项', trigger: 'change'}
                        ],
                        education: [
                            { required: true, message: '必填项', trigger: 'change' }
                        ],
                        email: [
                            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                        ],
                        barthday: [
                            { type: 'date', required: true, message: '必填项', trigger: 'change' }
                        ],
                        cardType: [
                            {required: true, message: '必填项', trigger: 'change' }
                        ]
                    }
                }
            },
            methods: {
                submitForm: function() {
                    var me = this;
                    var base = me.$refs.baseRef, family = me.$refs.familyRef, other = me.$refs.otherRef;
                    var baseFlag = true;
                    var familyFlag = true;
                    var otherFlag = true;
                    base.validate(function (valid) {
                        baseFlag = valid;
                    });
                    family.validate(function (valid) {
                        familyFlag = valid;
                    });
                    other.validate(function (valid) {
                        otherFlag = valid;
                    });
                    if (baseFlag && familyFlag && otherFlag){
                        var comitData = {};
                        yufp.extend(comitData, base.formModel);
                        yufp.extend(comitData, family.formModel);
                        yufp.extend(comitData, other.formModel);
                        this.$msgbox.alert(comitData, '提示');
                    }
                },
                resetForm: function() {
                    this.$refs.baseRef.resetFields();
                    this.$refs.familyRef.resetFields();
                    this.$refs.otherRef.resetFields();
                }
            }
        });
    };

});