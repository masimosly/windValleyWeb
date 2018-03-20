/**
 * Created by jiangcheng on 2017/11/15.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var vm =  yufp.custom.vue({
            el: "#seqconfig_seqconfigAdmin",
            data:function(){
                var me = this;
                var validateNum09 = function(rule, value, callback){
                    if(value){
                        if(!isNaN(value)){
                            if(value < 0 || value > 999999999){
                                callback(new Error('请输入0-999999999的数字'));
                            }else{
                                callback();
                            }
                        }else{
                            callback(new Error('请输入数字'));
                        }
                    }else{
                        callback(new Error('请输入数字'));
                    }
                };
                var validateNum19 = function(rule, value, callback){
                    if(value){
                        if(!isNaN(value)){
                            if(value < 1 || value > 999999999){
                                callback(new Error('请输入1-999999999的数字'));
                            }else{
                                callback();
                            }
                        }else{
                            callback(new Error('请输入数字'));
                        }
                    }else{
                        callback(new Error('请输入数字'));
                    }
                };
                var validateNum099 = function(rule, value, callback){
                    if(value){
                        if(!isNaN(value)){
                            if(value < 0 || value > 99){
                                callback(new Error('请输入0-99的数字'));
                            }else{
                                callback();
                            }
                        }else{
                            callback(new Error('请输入数字'));
                        }
                    }else{
                        callback(new Error('请输入数字'));
                    }
                };
                var validateNum199 = function(rule, value, callback){
                    if(value){
                        if(!isNaN(value)){
                            if(value < 1 || value > 99){
                                callback(new Error('请输入1-99的数字'));
                            }else{
                                callback();
                            }
                        }else{
                            callback(new Error('请输入数字'));
                        }
                    }else{
                        callback(new Error('请输入数字'));
                    }
                };
                return {
                    dialogTitle:"新增配置模板页面",
                    dialogFormVisible:false,
                    formDisabled:false,
                    formAllDisabled:false,
                    activeName:['1','2'],
                    queryFileds:[
                        {
                            placeholder: '序列名称',
                            field: 'seqName',
                            type: 'input'
                        },
                        {
                            placeholder: '序列ID',
                            field: 'seqId',
                            type: 'input'
                        }
                    ],
                    queryButtons: [
                        {
                            label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                                if(valid){
                                    var param = { condition: JSON.stringify(model) };
                                    me.$refs.seqconfigTable.remoteData(param);
                                }
                            }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'information'}
                    ],
                    mainGrid:{
                        height: yufp.custom.viewSize().height - 220,
                        checkbox: true,
                        dataUrl: backend.seqService+'/api/sequenceconfig/',
                        tableColumns:[
                            { label: '序列ID', prop: 'seqId',resizable: true,template: function () {
                                    return '<template scope="scope">\
                                            <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.seqId }}</a>\
                                        </template>';
                                }},
                            { label: '序列名称', prop: 'seqName',resizable: true },
                            { label: '开始值', prop: 'startvalue',resizable: true },
                            { label: '最大值', prop: 'maximumvalue',resizable: true },
                            { label: '自增值', prop: 'incrementvalue',resizable: true },
                            { label: '是否循环', prop: 'isCycle',resizable: true  ,dataCode: 'YESNO'},
                            { label: '缓存值', prop: 'cachevalue',resizable: true },
                            { label: '序列模板', prop: 'seqTemplet',resizable: true },
                            { label: '序列用的位数', prop: 'seqPlace',resizable: true },
                            { label: '不足位数是否用0补全', prop: 'zeroFill',resizable: true ,dataCode: 'YESNO'},
                            /*{ label: '当前序列值', prop: 'currentValue',resizable: true },*/
                        ]
                    },
                    updateFields:[{
                        columnCount: 2,
                        fields: [
                            { field: 'id', label: 'id' ,hidden:true},
                            { field: 'seqId',label: '序列ID',readonly:false ,maxlength:25,rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'seqName',label: '序列名称',maxlength:25, rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'startvalue',label: '开始值',readonly:false , rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    { validator: validateNum09,trigger: 'blur' }
                                ]},
                            { field: 'maximumvalue',label: '最大值',readonly:false , rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    { validator: validateNum19, trigger: 'blur' }
                                ]},
                            { field: 'incrementvalue',label: '自增值',readonly:false , rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    { validator: validateNum19, trigger: 'blur' }
                                ]},
                            { field: 'zeroFill', label: '是否循环' , calcDisabled:false ,type: 'select',dataCode: 'YESNO'},
                            { field: 'cachevalue',label: '缓存值',readonly:false , rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    { validator: validateNum199, trigger: 'blur' }
                                ]}
                        ]
                    }],
                    updateOtherFields:[{
                        columnCount: 1,
                        fields: [
                            { field: 'seqTemplet',label: '序列模板',type:"textarea",row:1, maxlength:100,placeholder:"双击变量表格实现快速序列模板格式配置",rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]}
                        ]
                    },{
                        columnCount: 2,
                        fields: [
                            { field: 'seqPlace',label: '序列用的位数', rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    { validator: validateNum099, trigger: 'blur' }
                                ]},
                            { field: 'isCycle', label: '不足位数是否用0补全' , type: 'select',dataCode: 'YESNO'}
                        ]
                    }],
                    tableData:[
                        {variateName:"年份",variateValue:"yyyy",variateDes:"年份，eg:2016"},
                        {variateName:"月份",variateValue:"MM",variateDes:"月份，eg:2016"},
                        {variateName:"月份天",variateValue:"dd",variateDes:"月份天，eg:15"},
                        {variateName:"序列数",variateValue:"SEQUENCE",variateDes:"序列数，eg:1526"}
                    ]
                }
            },
            methods:{
                queryFn: function () {//重新加载数据
                    this.$refs.seqconfigTable.remoteData();
                },
                deleteFn:function(){//删除
                    if (this.$refs.seqconfigTable.selections.length == 1) {
                        var id= this.$refs.seqconfigTable.selections[0].id;
                        var vue=this;
                        this.$confirm('此操作将删除该数据记录, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                            yufp.service.request({
                                method: 'POST',
                                url: backend.seqService+"/api/sequenceconfig/delete/"+id,
                                callback: function (code, message, response) {
                                    vue.$message({message: '数据删除成功！'});
                                    vue.queryFn()
                                }
                            });
                        })
                    } else {
                        this.$message({message: '请选择一条要删除的数据', type: 'warning'});
                        return false;
                    }
                },
                createSeqFn:function(){//创建序列
                    if (this.$refs.seqconfigTable.selections.length == 1) {
                        var seqId= this.$refs.seqconfigTable.selections[0].seqId;
                        var vue=this;
                        yufp.service.request({
                            method: 'GET',
                            url: backend.seqService+"/api/sequenceconfig/createSequence/"+seqId,
                            callback: function (code, message, response) {
                                vue.$message({message:response.message});
                            }
                        });
                    } else {
                        this.$message({message: '请选择一条要创建序列的序列数据', type: 'warning'});
                        return false;
                    }
                },
                deleteSeqFn:function(){//删除序列
                    if (this.$refs.seqconfigTable.selections.length == 1) {
                        var seqId= this.$refs.seqconfigTable.selections[0].seqId;
                        var vue=this;
                        yufp.service.request({
                            method: 'GET',
                            url: backend.seqService+"/api/sequenceconfig/deleteSequence/"+seqId,
                            callback: function (code, message, response) {
                                vue.$message({message:response.message});
                            }
                        });
                    } else {
                        this.$message({message: '请选择一条要删除的序列数据', type: 'warning'});
                        return false;
                    }
                },
                resetSeqFn:function(){//重置序列
                    if (this.$refs.seqconfigTable.selections.length == 1) {
                        var seqId= this.$refs.seqconfigTable.selections[0].seqId;
                        var vue=this;
                        yufp.service.request({
                            method: 'GET',
                            url: backend.seqService+"/api/sequenceconfig/reCreateSequence/"+seqId,
                            callback: function (code, message, response) {
                                vue.$message({message:response.message});
                            }
                        });
                    } else {
                        this.$message({message: '请选择一条要重置的序列数据', type: 'warning'});
                        return false;
                    }
                },
                createSeqTestFn:function(){//序列生成示例
                    if (this.$refs.seqconfigTable.selections.length == 1) {
                        var seqId= this.$refs.seqconfigTable.selections[0].seqId;
                        var vue=this;
                        yufp.service.request({
                            method: 'POST',
                            url: backend.seqService+"/api/sequenceconfig/getSequenceOfTemplate/"+seqId,
                            callback: function (code, message, response) {
                                vue.$message({message:response.data});
                            }
                        });
                    } else {
                        this.$message({message: '请选择一条要作为示例的序列数据', type: 'warning'});
                        return false;
                    }
                },
                openDetailFn:function(row){//查看
                    this.formAllDisabled=true;
                    this.dialogFormVisible = true;
                    this.dialogTitle = "模板查看页面";
                    this.$nextTick(function () {
                        var form = this.$refs.form, otherForm = this.$refs.otherForm;
                        this.$refs.form.resetFields();
                        this.$refs.otherForm.resetFields();

                        yufp.extend(form.formModel, row.row);
                        yufp.extend(otherForm.formModel, row.row);
                    });
                },
                openAddFn:function(){//新增
                    this.dialogTitle = "模板新增页面";
                    this.formDisabled = false;
                    this.formAllDisabled=false;
                    this.dialogFormVisible = true;

                    this.updateFields[0].fields[1].readonly=this.formDisabled;
                    this.updateFields[0].fields[3].readonly=this.formDisabled;
                    this.updateFields[0].fields[4].readonly=this.formDisabled;
                    this.updateFields[0].fields[5].readonly=this.formDisabled;
                    this.updateFields[0].fields[6].calcDisabled=this.formDisabled;
                    this.updateFields[0].fields[7].readonly=this.formDisabled;
                },
                openUpdateFn:function(){//打开修改页面
                    if (this.$refs.seqconfigTable.selections.length == 1){
                        this.dialogTitle = "模板修改页面";
                        this.formDisabled = true;
                        this.formAllDisabled=false;
                        this.dialogFormVisible = true;

                        var row = this.$refs.seqconfigTable.selections[0];
                        this.$nextTick(function () {
                            var form = this.$refs.form, otherForm = this.$refs.otherForm;
                            this.$refs.form.resetFields();
                            this.$refs.otherForm.resetFields();

                            yufp.extend(form.formModel, row);
                            yufp.extend(otherForm.formModel, row);

                            this.updateFields[0].fields[1].readonly=this.formDisabled;
                            this.updateFields[0].fields[3].readonly=this.formDisabled;
                            this.updateFields[0].fields[4].readonly=this.formDisabled;
                            this.updateFields[0].fields[5].readonly=this.formDisabled;
                            this.updateFields[0].fields[6].calcDisabled=this.formDisabled;
                            this.updateFields[0].fields[7].readonly=this.formDisabled;

                            form.formModel.startvalue = String(row.startvalue);
                            form.formModel.maximumvalue = String(row.maximumvalue);
                            form.formModel.incrementvalue = String(row.incrementvalue);
                            form.formModel.cachevalue = String(row.cachevalue);
                            otherForm.formModel.seqPlace = String(row.seqPlace);
                        });
                    }else{
                        this.$message({message: '请选择一条序列数据', type: 'warning'});
                        return false;
                    }
                },
                dbClickFn:function(row){//双击
                    var otherForm = this.$refs.otherForm;
                    otherForm.formModel.seqTemplet = otherForm.formModel.seqTemplet + "{"+ row.variateValue +"}";
                },
                saveFn:function(){//保存
                    var vue=this;
                    var form = vue.$refs.form, otherForm = vue.$refs.otherForm;
                    var formFlag=true;
                    form.validate(function (valid) {
                        formFlag=valid;
                    });
                    var otherFormFlag=true;
                    otherForm.validate(function (valid) {
                        otherFormFlag=valid;
                    });

                    if(formFlag && otherFormFlag){
                        var comitData = {};

                        var url = "";
                        if(this.formDisabled){
                            url = backend.seqService+"/api/sequenceconfig/update";
                            yufp.extend(comitData, otherForm.formModel);
                            comitData.seqName = form.formModel.seqName;
                        }else{
                            url = this.mainGrid.dataUrl;
                            yufp.extend(comitData, form.formModel);
                            yufp.extend(comitData, otherForm.formModel);
                        }
                        yufp.service.request({
                            method: 'POST',
                            url: url,
                            data: comitData,
                            callback: function (code, message, response) {
                                vue.dialogFormVisible = false;
                                form.resetFields();
                                otherForm.resetFields();
                                vue.$message({message: '数据保存成功！'});
                                vue.queryFn();
                            }
                        });
                    }
                },
                cancelFn:function(){//取消
                    var form = this.$refs.form, otherForm = this.$refs.otherForm;
                    form.resetFields();
                    otherForm.resetFields();
                    this.dialogFormVisible = false;
                }


            }
        })
    };

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }

});