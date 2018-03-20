/**
 * @Authoer: dusong
 * @Description: 逻辑系统管理
 * @Date 2017/12/7
 * @Modified By:
 *
 */
define(function (require, exports) {

    exports.ready = function (hashCode, data, cite){

        //注册该功能要用到的数据字典
        yufp.lookup.reg('DATA_STS,YESNO,SYS_TYPE');

        var vm;
        vm = yufp.custom.vue({
            el: "#logicSys",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data:function() {
                var me = this;
                //在线用户策略启用状态下，最大在线数输入校验
                var validateLoginUsernum = function(rule,value,callback){
                	if(me.crel.loginUsernumRule.flag){
                		if(me.crel.loginUsernumRule.maxUserNum==''){
                			rule.required = true;
                			callback(new Error("必填项"));
                			return;
                		}
                		var reg=/^[1-9]\d{0,4}$/;
                		if(!reg.test(me.crel.loginUsernumRule.maxUserNum)){
                			callback(new Error("最大在线数应小于99999"));
                			return;
                		}
                	}
                	callback();
                };
                //强制修改口令策略启用状态下，密码有效期输入校验
                var validatePasswdValidDay = function(rule,value,callback){
                	if(me.crel.passwdChangeRule.flag){
                		if(me.crel.passwdChangeRule.passwdValidDay==''){
                			rule.required = true;
                			callback(new Error("必填项"));
                			return;
                		}
                		var reg=/^[1-9]\d{0,2}$/;
                		if(!reg.test(me.crel.passwdChangeRule.passwdValidDay)){
                			callback(new Error("密码有效期不能大于999天"));
                			return;
                		}
                	}
                	callback();
                };
                //口令复杂策略启用状态下，策略选择校验
                var validatePasswdComplexRule = function(rule,value,callback){
                	if(me.crel.passwdComplexRule.flag){
                		if(me.crel.passwdComplexRule.needFlag.length<1){
                			callback(new Error(rule.message));
                			return;
                		}
                	}
                	callback();
                };
                //口令错误策略启用状态下，最大错误次数输入校验
                var validatePasswdErrorRule = function(rule,value,callback){
                	if(me.crel.passwdErrorRule.flag){
                		if(me.crel.passwdErrorRule.passwdTryMax==''){
                			rule.required = true;
                			callback(new Error("必填项"));
                			return;
                		}
                		var reg=/^(?:10|[1-9])$/;
                		if(!reg.test(me.crel.passwdErrorRule.passwdTryMax)){
                			callback(new Error("请输入不大于10的正整数"));
                			return;
                		}
                	}
                	callback();
                };
                //口令长度策略启用状态下，口令最短长度输入校验
                var validatePasswdLengthMin = function(rule,value,callback){
                	if(me.crel.passwdLengthRule.flag){
                		if(me.crel.passwdLengthRule.passwdLengthMin==''){
                			rule.required = true;
                			callback(new Error("必填项"));
                			return;
                		}
                		var reg=/^(?:10|[1-9])$/;
                		if(!reg.test(me.crel.passwdLengthRule.passwdLengthMin)){
                			callback(new Error("请输入不大于10的正整数"));
                			return;
                		}
                	}
                	callback();
                };
                //口令重复历史策略启用状态下，最近重复次数输入校验
                var validatePasswdRepetchgRule = function(rule,value,callback){
                	if(me.crel.passwdRepetchgRule.flag){
                		if(me.crel.passwdRepetchgRule.passwdRepetchgLastTimes==''){
                			rule.required = true;
                			callback(new Error("必填项"));
                			return;
                		}
                		var reg=/^(?:10|[1-9])$/;
                		if(!reg.test(me.crel.passwdRepetchgRule.passwdRepetchgLastTimes)){
                			callback(new Error("请输入不大于10的正整数"));
                			return;
                		}
                	}
                	callback();
                };
                //口令不重复长度启用状态下，口令禁止重复字符数输入校验
                var validatePasswdRepetnumberRule = function(rule,value,callback){
                	if(me.crel.passwdRepetnumberRule.flag){
                		if(me.crel.passwdRepetnumberRule.passwdRepetnumber==''){
                			rule.required = true;
                			callback(new Error("必填项"));
                			return;
                		}
                		var reg=/^(?:10|[1-9])$/;
                		if(!reg.test(me.crel.passwdRepetnumberRule.passwdRepetnumber)){
                			callback(new Error("请输入不大于10的正整数"));
                			return;
                		}
                	}
                	callback();
                };
                //口令连续长度策略启用状态下，口令禁止连续字符数输入校验
                var validatePasswdSequnnumberRule = function(rule,value,callback){
                	if(me.crel.passwdSequnnumberRule.flag){
                		if(me.crel.passwdSequnnumberRule.passwdSequnnumber==''){
                			rule.required = true;
                			callback(new Error("必填项"));
                			return;
                		}
                		var reg=/^(?:10|[1-9])$/;
                		if(!reg.test(me.crel.passwdSequnnumberRule.passwdSequnnumber)){
                			callback(new Error("请输入不大于10的正整数"));
                			return;
                		}
                	}
                	callback();
                };
                return {
                    mainGrid: {
                        currentRow: null,
                        data: null,
                        total: null,
                        dataUrl: backend.adminService+'/api/adminsmlogicsys/',
                        height: yufp.custom.viewSize().height - 140,
                        queryFileds: [
                            {placeholder: '逻辑系统名称', field: 'sysName', type: 'input'}
                        ],
                        queryButtons: [
                            {
                                label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                                    if (valid) {
                                        var param = {
                                            condition: JSON.stringify({
                                                sysName: model.sysName?model.sysName:null
                                            })
                                        };
                                        me.$refs.mytable.remoteData(param);
                                    }
                                }
                            },
                            {label: '重置', op: 'reset', type: 'primary', icon: 'information'}
                        ],
                        paging: {
                            page: 1,
                            size: 10
                        },
                        tableColumns: [
                            { label: '逻辑系统名称', prop: 'sysName', sortable: 'custom', resizable: true },
                            { label: '状态', prop: 'sysSts',type:'date',sortable: true, width:100, resizable: true, dataCode: 'DATA_STS'},
                            { label: '是否单点登录', prop: 'isSso',sortable: true,  resizable: true,width:120, dataCode: "YESNO"},
                            { label: '认证类型', prop: 'authId', type:'date',sortable: true, resizable: true ,dataCode:"AUTH_TYPE" },
                            { label: '版本号', prop: 'sysVersion', type:'date', sortable: true,width:100,  resizable: true},
                            { label: '逻辑系统描述', prop: 'sysDesc',sortable: true, resizable: true}
                        ],
                    },
                    updateFields: [{
                        columnCount: 2,
                        fields: [
                            { field: 'sysName', label: '逻辑系统名称',width: 120,rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    {max:30,message:'输入值过长',trigger:'blur'}
                                ]},
                            { field: 'sysSts', label: '状态',type: 'select', dataCode: 'DATA_STS',rules: [
                                    {required: true, message: '必填项', trigger: 'change'}
                                ] },
                            { field: 'isSso',label: '是否单点登录', type: 'select',dataCode: "YESNO", rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'authId',label: '认证类型',type: 'select',dataCode:"AUTH_TYPE" , rules:[
                                    {required: true, message: '必填项', trigger: 'blur'}
                                ]},
                            { field: 'sysVersion', label: '版本号',rules:[
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    {max:10,message:'输入值过长',trigger:'blur'}
                                ]},
                            { field: 'sysDesc', label: '逻辑系统描述' , rules:[
                                {required: true, message: '必填项', trigger: 'blur'},
                                {max:100,message:'输入值过长',trigger:'blur'}
                        ]},
                        ]
                    }],
                    authGrid: {
                        height: yufp.custom.viewSize().height - 140,
                        data: null,
                        total: null,
                        dataParams: {},
                        dataUrl: backend.adminService+'/api/adminsmauthinfo/',
                        paging: {
                            page: 1,
                            size: 10
                        },
                        queryFileds: [
                            {placeholder: '认证类型名称', field: 'authName', type: 'input'},
                            {placeholder: '实现类名称', field: 'beanName', type: 'input'},
                            {placeholder: '备注', field: 'authRemark', type: 'input'} //options
                        ],
                        queryButtons: [
                            {
                                label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                                    if (valid){
                                        var param = {
                                            condition: JSON.stringify({
                                                authName: model.authName?model.authName:null,
                                                beanName:model.beanName?model.beanName:null,
                                                authRemark:model.authRemark?model.authRemark:null
                                            })
                                        };
                                        me.$refs.mytableAuth.remoteData(param);
                                    }
                                }
                            },
                            {label: '重置', op: 'reset', type: 'primary', icon: 'information'}
                        ],
                        tableColumns: [
                            //{ label: '逻辑系统ID', prop: 'sysId', width: 140,resizable: true ,hidden: true},
                            { label: '认证类型名称', prop: 'authName',  resizable: true },
                            { label: '实现类名称', prop: 'beanName', resizable: true},
                            { label: '备注', prop: 'authRemark',resizable: true}
                        ],
                        updateFields: [{
                            columnCount: 2,
                            fields: [
                               { field: 'authName', label: '认证类型名称',rules:[
                                        {required: true, message: '必填项', trigger: 'blur'},
                                        {max:45,message:'输入值过长',trigger:'blur'}
                                    ]},
                                { field: 'beanName', label: '实现类名称',rules: [
                                        {required: true, message: '必填项', trigger: 'blur'},
                                        {max:45,message:'输入值过长',trigger:'blur'}
                                    ] }
                            ]
                        },{
                            columnCount: 1,
                            fields: [

                                { field: 'authRemark',label: '备注',type: 'textarea', rows: 3 , rules:[
                                        {required: true, message: '必填项', trigger: 'blur'},
                                        {max:100,message:'输入值过长',trigger:'blur'}
                                    ]}
                            ]
                        }]
                    },
                    crel: {

                        loginFirstRule: {
                            flag: false,
                            passwdChgFlag: ''
                        },
                        loginIpRule: {
                            flag: false,
                            actionType: ''
                        },
                        loginUsernumRule: {
                            flag: false,
                            maxUserNum: '',
                            actionType: ''
                        },
                        loginTimeRule: {
                            flag: false,
                            workDayFlag: '',
                            timeRule1: '',
                            timeRule2: ''
                        },
                        passwdChangeRule: {
                            flag: false,
                            passwdValidDay: '',
                            actionType: ''
                        },
                        passwdComplexRule: {
                            flag: false,
                            needFlag: ['number', 'upperchar', 'lowerchar']
                        },
                        passwdErrorRule: {
                            flag: false,
                            passwdTryMax: '',
                            actionType: ''
                        },
                        passwdLengthRule: {
                            flag: false,
                            passwdLengthMin: ''
                        },
                        passwdRepetchgRule: {
                            flag: false,
                            passwdRepetchgLastTimes: ''
                        },
                        passwdRepetnumberRule: {
                            flag: false,
                            passwdRepetnumber: ''
                        },
                        passwdSequnnumberRule: {
                            flag: false,
                            passwdSequnnumber: ''
                        },
                        loginTimeMore:{
                            flag: false,
                            timesFlag: ''
                        }
                    },
                    crelTabs: 'loginTab',
                    authOptions: [],
                    actionTypeOptions: [],
                    yesnoOptions: [],
                    dataParams: {},
                    formDisabled: false,
                    dialogAuthVisible: false,
                    dialogAuthEditVisible: false,
                    dialogFormVisible: false,
                    dialogCrelVisible: false,
                    enableCrelValue: "1",
                    disEnableCrelValue: "2",
                    dialogStatus: '',
                    textMap: {
                        update: '修改',
                        create: '新增',
                        crel: '设置认证策略',
                        auth: '配置认证信息'
                    },
                    rules: {
                    	maxUserNum:[
                    		{required: false,validator: validateLoginUsernum, trigger: 'blur' }
                    	],
                    	passwdValidDay:[
                    		{required: false,validator: validatePasswdValidDay, trigger: 'blur' }
                    	],
						passwdLengthMin:[
							{ required: false,validator: validatePasswdLengthMin, trigger: 'blur' }
						],
   						type:[
   							{ type: 'array',validator: validatePasswdComplexRule, message: '请至少选择一个策略', trigger: 'change' }
   						],
   						passwdTryMax:[
   							{ required: false,validator: validatePasswdErrorRule, trigger: 'blur' }
   						],
   						passwdRepetchgLastTimes:[
   							{ required: false,validator: validatePasswdRepetchgRule, trigger: 'blur' }
   						],
   						passwdRepetnumber:[
   							{ required: false,validator: validatePasswdRepetnumberRule, trigger: 'blur' }
   						],
   						passwdSequnnumber:[
   							{ required: false,validator: validatePasswdSequnnumberRule, trigger: 'blur' }
   						]
                    }
                }
            },
            mounted: function () {
                this.queryAuthDirectoryFn();
                var me = this;
                yufp.lookup.bind('ACTION_TYPE', function (data) {
                    me.actionTypeOptions = data;
                });
                yufp.lookup.bind('YESNO', function (data) {
                    me.yesnoOptions = data;
                });
                yufp.lookup.lookupMgr["AUTH_TYPE"] = [];

            },
            methods: {
                rowClickFn: function (row,index) {
                    this.mainGrid.currentRow = this.$refs.mytable.selections[0];
                },
                queryMainGridFn: function () {
                    var me = this;
                    me.$refs.mytable.remoteData();
                },
                openCreateFn: function () {
                    this.dialogStatus = 'create';

                    this.dialogFormVisible = true;
                    this.formDisabled=false;
                    this.$nextTick(function () {
                        this.$refs.myform.resetFields();
                    });
                },
                openEditFn: function (row) {
                    this.dialogStatus = 'update';
                    this.dialogFormVisible = true;
                    this.formDisabled=false;

                    this.$nextTick(function () {
                        this.$refs.myform.resetFields();
                        yufp.extend(this.$refs.myform.formModel, row);
                    });
                },
                saveCreateFn: function (formName) {
                    var vue=this;
                    var myform = vue.$refs.myform;
                    var formFlag=true;

                    myform.validate(function (valid) {
                        formFlag=valid;
                    });

                    if (formFlag) {
                        var comitData = {
                            sysName: null,
                            sysSts: null,
                            isSso: null,
                            authId: null,
                            sysVersion: null,
                            sysDesc: null};
                        delete myform.formModel.sysId;
                        yufp.extend(comitData, myform.formModel);
                        comitData.sysName= myform.formModel.sysName;
                        comitData.sysSts=myform.formModel.sysSts;
                        comitData.isSso=myform.formModel.isSso;
                        comitData.authId=myform.formModel.authId;
                        comitData.sysVersion=myform.formModel.sysVersion;
                        comitData.sysDesc=myform.formModel.sysDesc;
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+'/api/adminsmlogicsys/',
                            data: comitData,
                            callback: function (code, message, response) {
                                vue.dialogFormVisible = false;
                                vue.$message({message: '数据保存成功！'});
                                vue.queryMainGridFn();
                            }
                        });

                    }else {
                        this.$message({message: '请检查输入项是否合法', type: 'warning'});
                        return false;
                    }

                },
                saveEditFn: function (formName) {
                    var vue=this;
                    var myform = vue.$refs.myform;
                    var formFlag=true;
                    myform.validate(function (valid) {
                        formFlag=valid;
                    });
                    if (!formFlag) {
                        this.$message({message: '请检查输入项是否合法', type: 'warning'});
                        return false;
                    }

                    var comitData = {
                        sysId: null,
                        sysName: null,
                        sysSts: null,
                        isSso: null,
                        authId: null,
                        sysVersion: null,
                        sysDesc: null};
                    delete myform.formModel.sysId;
                    yufp.extend(comitData, myform.formModel);
                    comitData.sysId = vue.mainGrid.currentRow.sysId;
                    comitData.sysName= myform.formModel.sysName;
                    comitData.sysSts=myform.formModel.sysSts;
                    comitData.isSso=myform.formModel.isSso;
                    comitData.authId=myform.formModel.authId;
                    comitData.sysVersion=myform.formModel.sysVersion;
                    comitData.sysDesc=myform.formModel.sysDesc;
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+'/api/adminsmlogicsys/update',
                            data: comitData,
                            callback: function (code, message, response) {
                                vue.dialogFormVisible = false;
                                vue.$message({message: '数据保存成功！'});
                                vue.queryMainGridFn();
                            }
                        });
                },
                handleModify: function (status) {
                    var row;
                    if (this.$refs.mytable.selections.length !== 1) {
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
                    }else {
                        row = this.$refs.mytable.selections[0];
                    }
                    if (status === 'edit') {
                        this.mainGrid.currentRow = row;
                        this.openEditFn(row);
                    }else if (status === 'delete') {
                        this.deletePost(row);
                    }
                },
                deletePost: function (row, status) {
                    if (row.sysSts === 'A'){
                        this.$message({message: '生效状态，无法删除', type: 'warning'});
                        return;
                    }
                    var id='';
                    id = row.sysId;
                    var vue=this;
                    vue.$confirm('确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function(){
                            yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+'/api/adminsmlogicsys/delete/' + id,
                            callback: function (code, message, response) {
                                vue.$message({message: '数据删除成功！'});
                                vue.queryMainGridFn();
                            }
                        });
                    });
                },
                //认证信息维护
                setAuthInfo : function(row, status){
                    this.dialogStatus = 'auth';
                    this.dialogAuthVisible = true;
                    this.formDisabled=false;
                },
                //认证信息,读取字典 DONZELL
                queryAuthDirectoryFn: function () {
                    var me = this;
                    var param = {
                    }
                    //发起请求
                    yufp.service.request({
                        method: 'GET',
                        url: backend.adminService+'/api/adminsmauthinfo/authkv',
                        data: param,
                        callback: function (code, message, response) {
                            //me.mainGrid.queryFileds[2].options = response.data;
                            yufp.lookup.lookupMgr["AUTH_TYPE"] = response.data;
                        }
                    });
                },
                queryAuthGridFn: function () {
                    var me = this;
                    me.$refs.mytableAuth.remoteData();
                },
                //关闭配置认证信息页面,的时候刷新主页面数据
                closeAuthViewFn:function() {
                    this.dialogAuthVisible = false;
                    this.queryAuthDirectoryFn();
                    this.queryMainGridFn();
                },
                handleAuthModify: function ( status) {
                    var row;
                    if (this.$refs.mytableAuth.selections.length !== 1) {
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
                    }else {
                        row = this.$refs.mytableAuth.selections[0];
                    }

                    if (status === 'edit') {
                        this.openAuthEditFn(row);
                    }else if (status === 'delete') {
                        this.deleteAuthPost(row);
                    }
                },
                openAuthCreateFn: function () {
                    this.dialogStatus = 'create';
                    this.dialogAuthEditVisible = true;
                    this.formDisabled=false;
                    this.$nextTick(function () {
                        this.$refs.authDialogform.resetFields();
                    });
                },
                openAuthEditFn: function (row) {
                    this.dialogStatus = 'update';
                    this.dialogAuthEditVisible = true;
                    this.formDisabled=false;

                    this.$nextTick(function () {

                        this.$refs.authDialogform.resetFields();
                        yufp.extend(this.$refs.authDialogform.formModel, row);
                    });
                },
                saveAuthEditFn:function() {
                    var url;
                    var comitData = {
                        authId: null,
                        authName: null,
                        beanName: null,
                        authRemark: null};
                    var vue=this;
                    var myform = vue.$refs.authDialogform;
                    var formFlag=true;

                    if(typeof(myform.formModel.authId) === "undefined"){
                        url = backend.adminService+'/api/adminsmauthinfo/';
                    }else{
                        url = backend.adminService+'/api/adminsmauthinfo/update';
                        comitData.authId = myform.formModel.authId;
                    }

                    myform.validate(function (valid) {
                        formFlag=valid;
                    });

                    if (!formFlag) {
                        this.$message({message: '请检查输入项是否合法', type: 'warning'});
                        return false;
                    }

                    delete myform.formModel.authId;
                    yufp.extend(comitData, myform.formModel);
                    comitData.authName= myform.formModel.authName;
                    comitData.beanName=myform.formModel.beanName;
                    comitData.authRemark=myform.formModel.authRemark;
                    yufp.service.request({
                        method: 'POST',
                        url: url,
                        data: comitData,
                        callback: function (code, message, response) {
                            vue.dialogAuthEditVisible = false;
                            var data = response;
                            if (data.code === 0) {
                                vue.$message({message: '数据保存成功！', type: 'success'});
                                vue.queryAuthGridFn();
                            }else{
                                vue.$message({message: data.messge, type: 'error'});
                            }
                        }
                    });
                },
                deleteAuthPost: function (row, status) {
                    var id='';
                    id = row.authId;
                    var vue=this;
                    vue.$confirm('确认删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function(){
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+'/api/adminsmauthinfo/delete/' + id,
                            callback: function (code, message, response) {
                                vue.$message({message: '数据删除成功！'});
                                vue.queryAuthGridFn();
                            }
                        });
                    });
                },

                //认证策略维护
                setCrelStra : function(row, status){
                    //alert(actionTypeOptions[0].key);
                    if (this.$refs.mytable.selections.length !== 1) {
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
                    }
                    this.queryCrelInfo();
                },
                queryCrelInfo: function(){
                    this.crel = {
                        loginFirstRule: {
                            flag: false,
                            passwdChgFlag: '1'
                        },
                        loginIpRule: {
                            flag: false,
                            actionType: '1'
                        },
                        loginUsernumRule: {
                            flag: false,
                            maxUserNum: '99999',
                            actionType: '1'
                        },
                        loginTimeRule: {
                            flag: false,
                            workDayFlag: '01',
                            timeRule1: '08:00',
                            timeRule2: '18:00'
                        },
                        passwdChangeRule: {
                            flag: false,
                            passwdValidDay: '30',
                            actionType: '1'
                        },
                        passwdComplexRule: {
                            flag: false,
                            needFlag: ['number', 'upperchar', 'lowerchar']
                        },
                        passwdErrorRule: {
                            flag: false,
                            passwdTryMax: '4',
                            actionType: '1'
                        },
                        passwdLengthRule: {
                            flag: false,
                            passwdLengthMin: '6'
                        },
                        passwdRepetchgRule: {
                            flag: false,
                            passwdRepetchgLastTimes: '10'
                        },
                        passwdRepetnumberRule: {
                            flag: false,
                            passwdRepetnumber: '0'
                        },
                        passwdSequnnumberRule: {
                            flag: false,
                            passwdSequnnumber: '0'
                        },
                        loginTimeMore:{
                            flag: false,
                            timesFlag: '01'
                        }
                    };
                    var sysId = this.mainGrid.currentRow.sysId;
                    var param={
                        "condition":JSON.stringify({
                            "sysId":sysId,

                        }),
                        "page": 1,
                        "size": 0
                    };
                    //发起请求
                    var me = this;
                    yufp.service.request({
                        method: 'GET',
                        url: backend.adminService+'/api/adminsmcrelstra/',
                        data: param,
                        callback: function (code, message, response) {
                            me.loadCrelInfo(response.data);
                            me.dialogStatus = 'crel';
                            me.dialogCrelVisible = true;
                            me.crelTabs = 'loginTab';
                        }
                    });
                },
                loadCrelInfo: function(data){
                	
                    for (var i=0,ilen=data.length;i<ilen;i++) {
                    	//修改为boolean型值
                    	if(data[i].enableFlag === this.enableCrelValue){
                    		data[i].enableFlag = true;
                    	}else{
                    		data[i].enableFlag = false;
                    	}
                        //l 1//12
                        if (data[i].cerlName ==="LOGIN_FIRST_RULE"){
                            this.crel.loginFirstRule.flag = Boolean(data[i].enableFlag);
                            this.crel.loginFirstRule.passwdChgFlag = data[i].crelDetail;
                            this.crel.loginFirstRule.actionType = data[i].actionType;
                        }
                        //l 2//12
                        if (data[i].cerlName ==="LOGIN_IP_RULE"){
                            this.crel.loginIpRule.flag = Boolean(data[i].enableFlag);
                            //this.crel.loginIpRule. = data[i].crelDetail;
                            this.crel.loginIpRule.actionType = data[i].actionType;
                        }
                        //l 3//12
                        if (data[i].cerlName ==="LOGIN_USERNUM_RULE"){
                            this.crel.loginUsernumRule.flag = Boolean(data[i].enableFlag);
                            this.crel.loginUsernumRule.maxUserNum = data[i].crelDetail;
                            this.crel.loginUsernumRule.actionType = data[i].actionType;
                        }
                        //l 4//12
                        if (data[i].cerlName ==="LOGIN_TIME_RULE"){
                            this.crel.loginTimeRule.flag = Boolean(data[i].enableFlag);
                            if (data[i].crelDetail.replace(/(^s*)|(s*$)/g, "").length !== 0 &&  data[i].crelDetail.indexOf('|') >= 0){
                                var subString = data[i].crelDetail.split("|");
                                this.crel.loginTimeRule.workDayFlag =  subString[0];
                                if (subString[1].replace(/(^s*)|(s*$)/g, "").length !== 0 &&  subString[1].indexOf(',') >= 0){
                                    var myTiles = subString[1].split(",");
                                    this.crel.loginTimeRule.timeRule1 = myTiles[0];
                                    this.crel.loginTimeRule.timeRule2 = myTiles[1];
                                }
                            }
                            this.crel.loginTimeRule.actionType = data[i].actionType;
                            //todo
                        }
                        //l 5//12
                        if (data[i].cerlName ==="PASSWD_CHANGE_RULE"){
                            this.crel.passwdChangeRule.flag = Boolean(data[i].enableFlag);
                            this.crel.passwdChangeRule.passwdValidDay = data[i].crelDetail;
                            this.crel.passwdChangeRule.actionType = data[i].actionType;
                        }
                        //l 6//12
                        if (data[i].cerlName ==="PASSWD_COMPLEX_RULE"){
                            this.crel.passwdComplexRule.flag = Boolean(data[i].enableFlag);
                            if (data[i].crelDetail.replace(/(^s*)|(s*$)/g, "").length == 0){
                                this.crel.passwdComplexRule.needFlag = [];
                            }else{
                                this.crel.passwdComplexRule.needFlag = data[i].crelDetail.split(",");
                            }
                            this.crel.passwdComplexRule.actionType =  data[i].actionType;
                        }
                        //l 7//12
                        if (data[i].cerlName ==="PASSWD_ERROR_RULE"){
                            this.crel.passwdErrorRule.flag = Boolean(data[i].enableFlag);
                            this.crel.passwdErrorRule.passwdTryMax = data[i].crelDetail;
                            this.crel.passwdErrorRule.actionType =  data[i].actionType;
                        }
                        //l 8//12
                        if (data[i].cerlName ==="PASSWD_LENGTH_RULE"){
                            this.crel.passwdLengthRule.flag = Boolean(data[i].enableFlag);
                            this.crel.passwdLengthRule.passwdLengthMin = data[i].crelDetail;
                            this.crel.passwdLengthRule.actionType =  data[i].actionType;
                        }
                        //l 9//12
                        if (data[i].cerlName ==="PASSWD_REPETCHG_RULE"){
                            this.crel.passwdRepetchgRule.flag = Boolean(data[i].enableFlag);
                            this.crel.passwdRepetchgRule.passwdRepetchgLastTimes = data[i].crelDetail;
                            this.crel.passwdRepetchgRule.actionType =  data[i].actionType;
                        }
                        //l 10//12
                        if (data[i].cerlName ==="PASSWD_REPETNUMBER_RULE"){
                            this.crel.passwdRepetnumberRule.flag = Boolean(data[i].enableFlag);
                            this.crel.passwdRepetnumberRule.passwdRepetnumber = data[i].crelDetail;
                            this.crel.passwdRepetnumberRule.actionType =  data[i].actionType;
                        }
                        //l 11//12
                        if (data[i].cerlName ==="PASSWD_SEQUNNUMBER_RULE"){
                            this.crel.passwdSequnnumberRule.flag = Boolean(data[i].enableFlag);
                            this.crel.passwdSequnnumberRule.passwdSequnnumber = data[i].crelDetail;
                            this.crel.passwdSequnnumberRule.actionType =  data[i].actionType;
                        }
                        //l 12//12
                        if (data[i].cerlName ==="LOGIN_TIME_MORE"){
                            this.crel.loginTimeMore.flag = Boolean(data[i].enableFlag);
                            this.crel.loginTimeMore.timesFlag = data[i].crelDetail;
                            this.crel.loginTimeMore.actionType =  data[i].actionType;
                        }
                    }
                },
                getArrayContent: function (array) { //获取数组内容
                    var result = '';
                    for(var i=0;i< array.length;i++){
                        result += array[i];
                        if(i<array.length - 1){
                            result += ',';
                        }
                    }
                    return result;
                },
                saveCrelEditFn: function (formName) {
                    var sysId = this.mainGrid.currentRow.sysId;
                    var fields=this.$refs[formName];
                    var mode  = fields.model;
                    var dataList  = {crelList:[]};
                    var defualtActionType = "3";
                    var enableFlagValue = this.enableCrelValue; //1 启用 2 不启用
                    var validate1 = false;
                    fields.validate(function (valid) {
                        validate1 = valid;
                    });
                    if(!validate1){
                        return;
                    }

                    //1/12loginFirstRule
                    if (mode.loginFirstRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "LOGIN_FIRST_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.loginFirstRule.passwdChgFlag,
                            actionType: defualtActionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //2/12 loginIpRule
                    if (mode.loginIpRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "LOGIN_IP_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.loginIpRule.actionType,
                            actionType: mode.loginIpRule.actionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //3/12 loginUsernumRule
                    if (mode.loginUsernumRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "LOGIN_USERNUM_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.loginUsernumRule.maxUserNum,
                            actionType: mode.loginUsernumRule.actionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //4/12 loginTimeRule
                    if (mode.loginTimeRule.flag){
                            var workDayFlag = mode.loginTimeRule.workDayFlag;
                            var data     = {
                                sysId: sysId,
                                cerlName: "LOGIN_TIME_RULE",
                                enableFlag: enableFlagValue,
                                crelDetail:  workDayFlag +"|"+mode.loginTimeRule.timeRule1+ "," +mode.loginTimeRule.timeRule2,
                                actionType: defualtActionType,
                                lastChgUsr: yufp.session.userId
                            };
                            dataList.crelList.push(data);
                    }
                    //5/12 passwdChangeRule
                    if (mode.passwdChangeRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "PASSWD_CHANGE_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.passwdChangeRule.passwdValidDay,
                            actionType: mode.passwdChangeRule.actionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //6/12 passwdComplexRule
                    if (mode.passwdComplexRule.flag) {
                        if (mode.passwdComplexRule.needFlag.length > 0) {
                            var data = {
                                sysId: sysId,
                                cerlName: "PASSWD_COMPLEX_RULE",
                                enableFlag: enableFlagValue,
                                crelDetail: this.getArrayContent(mode.passwdComplexRule.needFlag),
                                actionType: defualtActionType,
                                lastChgUsr: yufp.session.userId
                            };
                            dataList.crelList.push(data);
                        }
                    }
                    //7/12 passwdErrorRule
                    if (mode.passwdErrorRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "PASSWD_ERROR_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.passwdErrorRule.passwdTryMax,
                            actionType: mode.passwdErrorRule.actionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //8/12 passwdLengthRule
                    if (mode.passwdLengthRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "PASSWD_LENGTH_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.passwdLengthRule.passwdLengthMin,
                            actionType: defualtActionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //9/12 passwdRepetchgRule
                    if (mode.passwdLengthRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "PASSWD_REPETCHG_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.passwdRepetchgRule.passwdRepetchgLastTimes,
                            actionType: defualtActionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //10/12 passwdRepetnumberRule
                    if (mode.passwdRepetnumberRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "PASSWD_REPETNUMBER_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.passwdRepetnumberRule.passwdRepetnumber,
                            actionType: defualtActionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //11/12 passwdSequnnumberRule
                    if (mode.passwdSequnnumberRule.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "PASSWD_SEQUNNUMBER_RULE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.passwdSequnnumberRule.passwdSequnnumber,
                            actionType: defualtActionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }
                    //12/12 loginTimeMore
                    if (mode.loginTimeMore.flag){
                        var data     = {
                            sysId: sysId,
                            cerlName: "LOGIN_TIME_MORE",
                            enableFlag: enableFlagValue,
                            crelDetail: mode.loginTimeMore.timesFlag,
                            actionType: defualtActionType,
                            lastChgUsr: yufp.session.userId
                        };
                        dataList.crelList.push(data);
                    }

                    if (dataList.crelList.length === 0){
                        this.$message({message: '请设置认证策略！', type: 'warning'});
                        return;
                    }
                    var vue = this;
                    var url = backend.adminService+'/api/adminsmcrelstra/batchupdate';
                    yufp.service.request({
                        method: 'POST',
                        url: url,
                        data: dataList,
                        callback: function (code, message, response) {
                            var data = response;
                            if (data.code === 0) {
                                vue.$message({message: '数据保存成功！', type: 'success'});
                                vue.queryMainGridFn();
                            }else{
                                vue.$message({message: data.messge, type: 'error'});
                            }
                        }
                    });
                    this.dialogCrelVisible = false;
                }
            }
        });
    };

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    };
});