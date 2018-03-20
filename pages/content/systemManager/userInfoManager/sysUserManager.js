/**
 * hujun -用户管理 2017-12-22
 */
define([
    './custom/widgets/js/yufpOrgTree.js',
    './custom/widgets/js/yufpRoleSelector.js',
    './libs/jsencrypt/jsencrypt.min.js',
    './custom/widgets/js/yufpDptTree.js'
],function (require, exports) {
    yufp.lookup.reg('DATA_STS','SEX_TYPE','IDENT_TYPE','HIGHEST_EDU','RANK_LEVEL');
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var parseTime = function(time, cFormat) {
            if (arguments.length === 0) {
                return null
            }
            var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
            var date
            if (typeof time === 'object') {
                date = time
            } else {
                if (('' + time).length === 10) time = parseInt(time) * 1000
                date = new Date(time)
            }
            var formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
            }
            var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function(result, key){
                var value = formatObj[key]
                if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                if (result.length > 0 && value < 10) {
                    value = '0' + value
                }
                return value || 0
            })
            return time_str
        };
        var stsKeyValue = null;
        var vm=yufp.custom.vue({
            el: "#userInfo",
            data:function(){
                var em=this;
                return{
                	addUserButton:!yufp.session.checkCtrl('addUser'),//新增按钮控制
                	editUserButton:!yufp.session.checkCtrl('updateUser'),//修改按钮控制
                	deleteUserButton:!yufp.session.checkCtrl('deleteUser'),//删除按钮控制
                	useUserButton:!yufp.session.checkCtrl('useUser'),//启用按钮控制
                	unuseUserButton:!yufp.session.checkCtrl('unuseUser'),//停用按钮控制
                	userRelButton:!yufp.session.checkCtrl('userRel'),//用户管理信息按钮控制
                	resetPwsButton:!yufp.session.checkCtrl('resetPwsUser'),//密码重置按钮控制
                    height: yufp.custom.viewSize().height - 150,
                    height_org:yufp.custom.viewSize().height-20,
                    height_ot: yufp.custom.viewSize().height - 200,
                    treeUrl_rel:backend.adminService+'/api/adminsmorg/orgtreequery?orgSts=A&&orgCode='+yufp.session.org.code,
                    uploadAction:yufp.service.getUrl({url:backend.adminService+'/api/adminfileuploadinfo/uploadfile?access_token=' + yufp.service.getToken()}),
                    userIdInfo:null,
                    orgRootId:yufp.session.org.code,//根据节点ID
                    dialogVisibleImage:false,
                    userForm:{
                        userName:'',
                        loginCode:'',
                        deadline:'',
                        userSts:'',
                        userAvatar:''

                    },
                    queryFileds: [
                        {placeholder: '登录代码/姓名/员工号', field: 'userInfo', type: 'input'},

                        {placeholder: '状态', field: 'userSts', type: 'select',  dataCode: 'DATA_STS'},
                        {placeholder: '有效期', field: 'deadline', type: 'date'}
                    ],
                    queryButtons: [
                        {
                            label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            em.mainGrid.query.userInfo=model.userInfo;
//                          em.mainGrid.query.userName=model.userName;
//                          em.mainGrid.query.userCode=model.userCode;
//                          em.mainGrid.query.userSts=model.userSts;
                            em.mainGrid.query.deadline=model.deadline;
                            em.queryMainGridFn();
                        }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'information'}
                    ],
                    mainGrid:{
                        query: {
                            userInfo: '',
                            orgId:''
                        },
                        height: yufp.custom.viewSize().height - 150,
                        checkbox: true,
                        dataUrl: backend.adminService+'/api/adminsmuser/querypage',
                        paging: {
                            page: 1,
                            size: 10
                        },
                        currentRow: null,
                        dataParams:{},
                        tableColumns: [
                            { label: '用户名称', prop: 'userName',width:'130',   resizable: true, template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.userName }}</a>\
                            </template>';
                            } },
                            { label: '登录代码', prop: 'loginCode',resizable: true,width:'130' },
                            { label: '所属部门', prop: 'dptName', resizable: true ,width:'130'},
                            { label: '状态', prop: 'userSts',resizable: true, dataCode: 'DATA_STS'},
                            { label: '性别', prop: 'userSex',resizable: true,dataCode: 'SEX_TYPE'},
                            { label: '员工号', prop: 'userCode',resizable: true },
                            { label: '有效期', prop: 'deadline', resizable: true ,width:'130'},
                            { label: '最新变更用户', prop: 'lastChgName', resizable: true,width:'130'},
                            { label: '最新变更时间', prop: 'lastChgDt', type:'date', resizable: true,width:'130'}
                        ]
                    },
                    userFields: [{
                        columnCount: 2,
                        fields: [

                            { field: 'orgId',label: '所属机构',type:'custom',is:'yufp-org-tree',param:{needCheckbox:false},
                                rules:[
                                    {required: true, message: '必填项', trigger: 'change'}
                                ],selectFn:function (code,data,arry){
                                        var temp = yufp.clone(em.userFields[0].fields[1].params);
                                        temp.dataParams={
                                            orgCode:code
                                        }
                                        em.userFields[0].fields[1].params = yufp.clone(temp);
                                    }},
                            { field: 'dptId',label: '所属部门',type:'custom',is:'yufp-org-tree',
                            		params: {
                                        dataUrl: backend.adminService + "/api/util/getdpt",
                                        // dataRoot: '10000001',
                                        dataId:"orgCode",
                                        needCheckbox: false
                                    },//
                                    selectFn: function (code, data, arry) {
                                    }},
                            { field: 'userPassword', label: '密码' , type: 'password',rules:[
                                    {required: true, message: '必填项', trigger: 'change'},
                                    {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                                ]},
                            { field: 'userPassword1', label: '确认密码' , type: 'password',rules:[
                                    {required: true, message: '必填项', trigger: 'change'},
                                    {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                                ]}

                        ]
                    }],
                    userOtherFields: [{
                        columnCount: 2,
                        fields: [
                            {label:'性别',field:'userSex',type:'radio', dataCode:'SEX_TYPE',
                                change:function (model,val,e) {
                                }
                            },
                            { field: 'userBirthday', label: '生日',type: 'date',format:'yyyy-MM-dd' },
                            { field: 'certType', label: '证件类型' , type: 'select', dataCode: 'IDENT_TYPE'},
                            { field: 'certNo', label: '证件号码', rules:[
                                {validator: yufp.validator.IDCard,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                            { field: 'userCode',label: '员工号' ,rules:[
                            	{max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                            ]},
                            { field: 'userEmail', label: '邮箱', rules:[
                                {validator: yufp.validator.email,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                            { field: 'userMobilephone', label: '移动电话', rules:[
                                {validator: yufp.validator.mobile,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                            { field: 'userOfficetel', label: '办公电话', rules:[
                                {validator: yufp.validator.telephone,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                            { field: 'userEducation', label: '最高学历' , type: 'select', dataCode: 'HIGHEST_EDU'},
                            { field: 'positionDegree', label: '职级' , type: 'select', dataCode: 'RANK_LEVEL'},
                            { field: 'userCertificate',label: '资格证书' ,rules:[
                            	{max: 200, message: '最大长度不超过200个字符', trigger: 'blur' }
                            ]},
                            { field: 'entrantsDate', label: '入职时间',type: 'date',format:'yyyy-MM-dd' },
                            { field: 'financialJobTime', label: '从业时间', rules:[
                                {validator: yufp.validator.number,message: '请输入正确信息', trigger: 'blur'},
                                {max: 20, message: '最大长度不超过20个字符', trigger: 'blur' }
                            ]},
                            { field: 'positionTime', label: '任职时间', rules:[
                                {validator: yufp.validator.number,message: '请输入正确信息', trigger: 'blur'},
                                {max: 20, message: '最大长度不超过20个字符', trigger: 'blur' }
                            ]},
                            { field: 'offenIp', label: '常用IP', rules:[
                                {validator: yufp.validator.ip,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                             { field: 'lastChgUsr',label: '最近更新人' ,hidden:true},
                             { field: 'lastChgDt',label: '最近更新时间' ,hidden:true},

                        ]
                    }],
                    userDetailFields: [{
                        columnCount: 2,
                        fields: [

                            { field: 'orgId',label: '所属机构',type:'custom',is:'yufp-org-tree'},
                            { field: 'dptName',label: '所属部门'}
                        ]
                    }],
                    userDetailOtherFields: [{
                        columnCount: 2,
                        fields: [
                            {label:'性别',field:'userSex',type:'radio', dataCode:'SEX_TYPE',
                                change:function (model,val) {
                                    console.log(val)
                                }
                            },
                            { field: 'userBirthday', label: '生日',type: 'date',format:'yyyy-MM-dd' },
                            { field: 'certType', label: '证件类型' , type: 'select', dataCode: 'DATA_STS'},
                            { field: 'certNo', label: '证件号码'},
                            { field: 'userCode',label: '员工号' },
                            { field: 'userEmail', label: '邮箱'},
                            { field: 'userMobilephone', label: '移动电话'},
                            { field: 'userOfficetel', label: '办公电话'},
                            { field: 'userEducation', label: '最高学历' , type: 'select', dataCode: 'HIGHEST_EDU'},
                            { field: 'positionDegree', label: '职级' , type: 'select', dataCode: 'RANK_LEVEL'},
                            { field: 'userCertificate',label: '资格证书' },
                            { field: 'entrantsDate', label: '入职时间',type: 'date',format:'yyyy-MM-dd' },
                            { field: 'financialJobTime', label: '从业时间'},
                            { field: 'positionTime', label: '任职时间'},
                            { field: 'offenIp', label: '常用IP'},
                            { label: '最新变更用户', field: 'lastChgName',},
                            { label: '最新变更时间', field: 'lastChgDt', type:'date', format:'yyyy-MM-dd'}

                        ]
                    }],
                    activeFlag:'first',
                    mainGrid_role: {
                        height: 270,
                        checkbox:true,
						dataUrl:backend.adminService+"/api/adminsmrole/querybyrolests",
                        tableColumns: [
                            { label: '角色代码', prop: 'roleCode', width: 140,resizable: true },
                            { label: '角色名称', prop: 'roleName', width: 150,resizable: true }
                        ]
                    },
                    mainGrid_post: {
                        height: 270,
                        checkbox:true,
                        dataUrl:backend.adminService+"/api/adminsmduty/list",
                        tableColumns: [
                            { label: '岗位代码', prop: 'dutyCde', width: 140,resizable: true },
                            { label: '岗位名称', prop: 'dutyName', width: 150,resizable: true }
                        ]
                    },
                    stsOptions:null,
                    dialogFormVisible: false,//新增，修改页面是否显示
                    dialogDetailVisible:false,//详情页面是否显示
                    nowNode:'',//当前选中节点数据
                    rootId:'root',//根节点ID
                    rootName:'组织机构树',//根节点名称
                    dialogStatus: '',
                    readonly:false,//维护信息是否只读
                    dialogVisible_relInfo:false,//用户关联信息是否显示
                    dialogVisible_role:false,//用户角色是否显示
                    activeName:['1'],//默认显示name为1的
                    rules: {
                        userName: [
                            {required: true, message: '必填项', trigger: 'blur'},
                            {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                        ],
                        loginCode: [
                            {required: true, message: '必填项', trigger: 'blur'},
                          {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                        ]
                    },
                    textMap: {
                        update: '修改',
                        create: '新增',
                        detail: '详情',
                        relInfo:'用户关联信息',
                        role:'用户角色'
                    },
                    pwdform:{
                        dialogVisible:false,
                        pwdFields:[{
                            columnCount:1,
                            fields: [{
                                field: "password",
                                label: "密码",
                                type: "password",
                                rules: [{required: true, message: '必填项',trigger: 'blur'}]
                            },{
                               field: "confirmPwd",
                                label: "确认密码",
                                type: "password",
                                rules: [{required: true, message: '必填项',trigger: 'blur'}]
                            }]
                        }],
                        pwdButtons:[],
                        tempUserId:yufp.session.userId
                    }
                };
            },
            filters: {
                statusFilter: function (status) {

                    return stsKeyValue[status];
                },
                dateFilter: function(d) {

                    return parseTime(d, '{y}-{m}-{d}');
                }
            },
            methods: {
                handleAvatarSuccess:function(res, file) {
                    this.userForm.userAvatar="http://192.168.251.151:80/"+res.data.filePath;
                    // this.userForm.userAvatar = URL.createObjectURL(file.raw);
                },
                beforeAvatarUpload:function(file) {
                	var type=file.type;
                	var size=file.size / 1024 / 1024 ;
                    if (type!=='image/jpeg'&&type!=='image/png'&&type!=='image/jpg') {
                        this.$message.error('上传头像图片只能是 JPG 格式!');
                    }
                    if (size>2) {
                        this.$message.error('上传头像图片大小不能超过 2MB!');
                    }
                    return type && size;
                },
                queryMainGridFn:function() {
                    var me =this;
                    var param = {
                        condition: JSON.stringify({
                            userInfo: this.mainGrid.query.userInfo?this.mainGrid.query.userInfo:null,
                            orgId: this.mainGrid.query.orgId?this.mainGrid.query.orgId:null
                        })
                    };
                    me.$refs.mytable.remoteData(param);
                },
                nodeClickFn:function(node, obj, nodeComp) {
                    if(node !=''){
                        this.nowNode=node;
                        /*初始化部门数据*/
                        var temp = yufp.clone(this.userFields[0].fields[1].params);
                        temp.dataParams={
                            orgCode:node.orgId
                        }
                        this.userFields[0].fields[1].params = yufp.clone(temp);
                        this.mainGrid.query.orgId=node.orgCode;
                        this.mainGrid.query.orgType=node.orgType;
                        this.queryMainGridFn()
                    }
                },
                resetTempFn: function () {
                    this.$refs.userInfo.resetFields();
                    this.$refs.userOtherInfo.resetFields();
                    this.userForm={
                        userName:'',
                        loginCode:'',
                        userSts:'',
                        deadline:'',
                        userAvatar:'',
                    };
                },
                openCreateFn: function () {
                    this.dialogStatus = 'create';

                    this.activeName=['1'];
                    this.dialogFormVisible = true;
                    this.dialogDetailVisible = false;
                    this.readonly=false;
                    
                    this.$nextTick(function () {
                        this.$refs.userInfo.resetFields();
                        this.$refs.userOtherInfo.resetFields();
                        this.userForm={
	                         userName:'',
	                        loginCode:'',
	                        userSts:'A',
	                        deadline:'',
	                        userAvatar:'',
                        };
                        this.$refs.userInfo.formModel.lastChgUsr=yufp.session.userId
                        this.$refs.userInfo.formModel.userSts='A';
                        if(this.nowNode !=null){
                          this.$refs.userInfo.formModel.orgId=this.nowNode.orgId;
                        }
                        this.userFields[0].fields[2].hidden=false;
                    	this.userFields[0].fields[3].hidden=false;
                             //初始化部门树
                        var temp = yufp.clone(this.userFields[0].fields[1].params);
                        if(this.nowNode !=null){
                          	temp.dataParams={
                                orgCode:yufp.session.org.code
                            }
                        }else{
                        	temp.dataParams={
                               orgCode:this.nowNode.orgId
                          	}
                        }
                        this.userFields[0].fields[1].params = yufp.clone(temp);
                    });
                },
                openDetailFn: function (row) {
                    this.mainGrid.currentRow=row;
                    this.activeName=['1','2'];
                    this.dialogFormVisible = false;
                    this.dialogDetailVisible = true;
                    this.userForm={
                        userName: row.row.userName,
                        loginCode:row.row.loginCode,
                      	userSts:row.row.userSts?row.row.userSts:null,
	                    deadline:row.row.deadline?row.row.deadline:null,
                        userAvatar:row.row.userAvatar?row.row.userAvatar:null,
                    };
                    this.$nextTick(function () {
                        this.$refs.userDetailInfo.resetFields();
                        this.$refs.userDetailOtherInfo.resetFields();
                        yufp.extend(this.$refs.userDetailInfo.formModel, row.row);
                        yufp.extend(this.$refs.userDetailOtherInfo.formModel, row.row);
                        
                    });
                },
                openEditFn: function (row) {
                    if (this.$refs.mytable.selections.length!==1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'});
                        return;
                    }
                    var row=this.$refs.mytable.selections[0];
                    if(row.userSts ==='A'){
                        this.$message({message: '只能选择失效或者待生效的数据', type: 'warning'});
                        return;
                    }
                    this.dialogStatus = 'update';
                    this.activeName=['1'];
                    this.dialogFormVisible = true;
                    this.dialogDetailVisible = false;
                    this.readonly=true;
                    this.userForm={
                       	userName: row.userName,
                        loginCode:row.loginCode,
                      	userSts:row.userSts?row.userSts:null,
	                    deadline:row.deadline?row.deadline:null,
                        userAvatar:row.userAvatar?row.userAvatar:null,
                    };
                    
                    this.$nextTick(function () {
                        this.$refs.userInfo.resetFields();
                        this.$refs.userOtherInfo.resetFields();
                        yufp.extend(this.$refs.userInfo.formModel, row);
                        yufp.extend(this.$refs.userOtherInfo.formModel, row);
                            //初始化部门树
                        var temp = yufp.clone(this.userFields[0].fields[1].params);
                        
                         temp.dataParams={
                            orgCode:row.orgId
                        }
                        this.userFields[0].fields[1].params = yufp.clone(temp);
                        this.userFields[0].fields[2].hidden=true;
                    	this.userFields[0].fields[3].hidden=true;
                    });
                },
                 openRoleFn:function () {

                },
                openRelInfoFn:function(){
                	  var row=this.$refs.mytable.selections;
                    if(row.length !=1){
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
                    }
                    this.dialogStatus='relInfo';
                    this.dialogVisible_relInfo=true;
                   var em=this;
                   var param_role = {
                        condition: JSON.stringify({
                           roleSts:'A'
                        })
                    };
                    var param_duty = {
                        condition: JSON.stringify({
                           roleSts:'A'
                        })
                    };
                     var param_org = {
                        condition: JSON.stringify({
                           orgSts:'A'
                        })
                    };
                   this.$nextTick(function () {

                    em.$refs.roleTable.remoteData(param_role);
                    em.$refs.dutyTable.remoteData(param_duty);
                   	 var param = {
                        condition: JSON.stringify({
                           userId:row[0].userId
                        })
                    };
                   	  yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+'/api/adminsmuser/queryuserrole',
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                for(var i=0;i<infos.length;i++){
                                        em.$refs.roleTable.data.filter(function (item) {
									        if (item.roleId === infos[i].roleId)
									            em.$refs.roleTable.toggleRowSelection(item);
									    });
                                }
                            }
                        });
                    });


                },
                saveCreateFn:function () {
                    var me=this;
                    var userInfo = me.$refs.userInfo, userOtherInfo = me.$refs.userOtherInfo;
                    var infoValid=true;
                    var otherInfoValid=true;
                    userInfo.validate(function(valid){
                        infoValid=valid;
                    });
                    userOtherInfo.validate(function(valid){
                        otherInfoValid=valid;
                    });
                    if (infoValid&&otherInfoValid) {
                            var comitData = {};
                            delete userInfo.formModel.userId;
                            if( userInfo.formModel.userPassword!== userInfo.formModel.userPassword1){
                                me.$message({message: '确认密码和密码不一致', type: 'warning'});
                                return false;
                            }
                            yufp.extend(comitData, userInfo.formModel);
                            yufp.extend(comitData, userOtherInfo.formModel);
                            yufp.extend(comitData, me.userForm);
                            comitData.lastChgUsr=yufp.session.userId;
                            var encrypt = new JSEncrypt();
		            		encrypt.setPublicKey(yufp.util.getRSAPublicKey());
		                    var info=encrypt.encrypt(userInfo.formModel.userPassword);
		                    yufp.service.request({
		                        url:backend.uaaService+"/api/passwordcheck/checkpwd",
		                        method:"get",
		                        data:{
		                        	sysId:yufp.session.logicSys.id,
		                        	pwd:encodeURI(info),
		                        	userId:'',
		                        	passwordTyp:'2'
		                        },
		                         callback:function(code,message,response){
		                            if(response.code==='1001'){
		                               yufp.service.request({
					                        method: 'POST',
					                        url: backend.uaaService+'/api/account/password',
					                        data: {
					                        	 "plaintext": comitData.userPassword
					                        },
					                        callback: function (code, message, response) {
					                            if (response !=null&&response.ciphertext!=='') {
					                            	comitData.userPassword=response.ciphertext
					                                yufp.service.request({
						                                method: 'POST',
						                                url: backend.adminService+'/api/adminsmuser/adduserinfo',
						                                data: comitData,
						                                callback: function (code, message, response) {
						                                    if(response.data.code==='2'){
						                                        me.$message({message: response.data.message, type: 'warning'});
						                                    }else{
						                                        me.dialogFormVisible = false;
						                                        me.$message({message: '数据保存成功！'});
						                                        me.queryMainGridFn();
						                                    }
			
						                                }
						                            });
			
					                            }else{
					                            	 me.$message({message: '密码加密错误！', type: 'warning'});
					                            }
					                        }
					                    });
		                            }else{
		                            	me.$message({message: response.message, type: 'warning'});
		                            	return false;
		                            }
		                        }
		                    });
                            

                    }else {
                            me.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                    }

                },
                saveEditFn:function (form) {
                    var me=this;
                    var userInfo = me.$refs.userInfo, userOtherInfo = me.$refs.userOtherInfo;
                    userInfo.formModel.userPassword1=userInfo.formModel.userPassword;
                    userInfo.validate(function(valid){
                        if (valid) {
                        	var users={
	                    		orgId:userInfo.formModel.orgId,
	                    		dptId:userInfo.formModel.dptId
                    		}
                            var comitData = {};
                            yufp.extend(comitData, userInfo.formModel);
                            yufp.extend(comitData, userOtherInfo.formModel);
                            yufp.extend(comitData, me.userForm);
                            yufp.extend(comitData,users);
                            comitData.lastChgUsr=yufp.session.userId
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmuser/update",
                                data: comitData,
                                callback: function (code, message, response) {
                                    if(response.data.code==='2'){
                                        me.$message({message: response.data.message, type: 'warning'});
                                    }else{
                                        me.dialogFormVisible = false;
                                        me.$message({message: '数据保存成功！'});
                                        me.queryMainGridFn();
                                    }

                                }
                            });

                    }else {
                            me.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                    }
                    });
                    

                },
                useBatchFn: function () {//批量启用
                    var rows=this.$refs.mytable.selections;
                    if (rows.length>0) {
                        var id='';
                        for (var i=0;i< rows.length;i++)
                        {
                            var row=rows[i];
                            if(row.userSts==='I'){
                                id=id+','+row.userId
                            }else {
                                this.$message({message: '只能选择停用的数据', type: 'warning'});
                                return;
                            }
                        }
                        var vue=this;
                          this.$confirm('此操作将停用该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                        	
			              	yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService+"/api/adminsmuser/usebatch?id="+id+"&userId="+yufp.session.userId,
	                            callback: function (code, message, response) {
	                                vue.$message({message: '数据操作成功！'});
	                                vue.queryMainGridFn()
	                            }
                        	});
						})
                        

                    } else {
                        this.$message({message: '请先选择要启用的数据', type: 'warning'});
                        return;
                    }

                },
                unUseBatchFn: function () {//批量停用
                    var rows=this.$refs.mytable.selections;
                    if (rows.length>0) {
                        var id='';
                        for (var i=0;i< rows.length;i++)
                        {
                            var row=rows[i];
                            if(row.userSts==='A'){
                                id=id+','+row.userId
                            }else {
                                this.$message({message: '只能选择已生效的数据', type: 'warning'});
                                return;
                            }
                        }

                        var vue=this;
                        this.$confirm('此操作将停用该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                        	
			                yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService+"/api/adminsmuser/unusebatch?id="+id+"&userId="+yufp.session.userId,
	                            callback: function (code, message, response) {
	                                vue.$message({message: '数据操作成功！'});
	                                vue.queryMainGridFn()
	                            }
                        	});
						})

                    } else {
                        this.$message({message: '请先选择要停用的数据', type: 'warning'});
                        return
                    }

                },
                deletestFn: function () {//批量删除
                    var rows=this.$refs.mytable.selections;
                    if (rows.length>0) {
                        var id='';
                        for (var i=0;i< rows.length;i++)
                        {
                            var row=rows[i];
                            if(row.userSts==='I'){
                                id=id+','+row.userId
                            }else {
                                this.$message({message: '只能删除停用的数据', type: 'warning'});
                                return;
                            }
                        }
                        var vue=this;
                        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmuser/deletebatch?id="+id,
                                callback: function (code, message, response) {
                                    vue.$message({message: '数据删除成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        })

                    } else {
                        this.$message({message: '请先选择要删除的数据', type: 'warning'});
                        return;
                    }
                },
                handleClick:function(tab, event) {
                	var rows=this.$refs.mytable.selections
                	var em=this;
                     var param = {
                        condition: JSON.stringify({
                           userId:rows[0].userId
                        })
                    };
                    if(tab.name==='first'){
                         	yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+'/api/adminsmuser/queryuserrole',
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                for(var i=0;i<infos.length;i++){
                                	em.$refs.roleTable.data.filter(function (item) {
									        if (item.roleId === infos[i].roleId)
									            em.$refs.roleTable.toggleRowSelection(item);
									});
                                }
                            }
                        });
                    }else if(tab.name==='second'){
                    	yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+'/api/adminsmuser/queryuserduty',
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                for(var i=0;i<infos.length;i++){
                                	em.$refs.dutyTable.data.filter(function (item) {
									        if (item.dutyId === infos[i].dutyId)
									            em.$refs.dutyTable.toggleRowSelection(item);
									});
                                }
                            }
                        });
                    }else if(tab.name==='third'){
                    	yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+'/api/adminsmuser/queryuserorg',
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                var keys=[];
                                for(var i=0;i<infos.length;i++){
                                        keys.push(infos[i].orgId);
                                }
                                em.$refs.orgUsertree.setCheckedKeys(keys);
                            }
                        });

                    }
                },
                 saveEditFn_org:function(){
                    var checks=this.$refs.orgUsertree.getCheckedKeys();
                    var em=this;
                    var commit=[];
                    var row=this.$refs.mytable.selections[0];
                    for(var i=0;i<checks.length;i++){
                    	var data={
                    		userId:row.userId,
                    		lastChgUsr:yufp.session.userId,
                    		orgId:checks[i]
                    	};
                    	commit.push(data);
                    }
                    yufp.service.request({
                        method: 'POST',
                        url: backend.adminService+"/api/adminsmuser/saveorg",
                        data: JSON.stringify(commit),
                        callback: function (code, message, response) {
                            em.$message({message: '数据操作成功！'});
                        }
                    });
                },
                saveEditFn_role:function(){
                    var list=this.$refs.roleTable.selections;
                    var em=this;
                    var commit=[];
                    var row=this.$refs.mytable.selections[0];
                    for(var i=0;i<list.length;i++){
                    	var data={
                    		userId:row.userId,
                    		lastChgUsr:yufp.session.userId,
                    		roleId:list[i].roleId
                    	};
                    	commit.push(data);
                    }
                    yufp.service.request({
                        method: 'POST',
                        url: backend.adminService+"/api/adminsmuser/saverole",
                        data: JSON.stringify(commit),
                        callback: function (code, message, response) {
                            em.$message({message: '数据操作成功！'});
                        }
                    });
                },
                saveEditFn_post:function(){
                    var list=this.$refs.dutyTable.selections;
                    var em=this;
                    var commit=[];
                    var row=this.$refs.mytable.selections[0];
                    for(var i=0;i<list.length;i++){
                    	var data={
                    		userId:row.userId,
                    		lastChgUsr:yufp.session.userId,
                    		dutyId:list[i].dutyId
                    	};
                    	commit.push(data);
                    }
                    yufp.service.request({
                        method: 'POST',
                        url: backend.adminService+"/api/adminsmuser/savepost",
                        data: JSON.stringify(commit),
                        callback: function (code, message, response) {
                            em.$message({message: '数据操作成功！'});
                        }
                    });
                },
                // 重置密码按钮
                resetPassword:function(){
                    if(this.$refs.mytable.selections.length!=1){
                        this.$message("请选择一条数据","提示");
                        return ;
                    }

                    var temp=this.$refs.mytable.selections[0];
                    this.pwdform.tempUserId=temp.userId;
                    this.pwdform.dialogVisible=true;
                },
                // 确认修改密码
                resetPwd:function(){
                    var me=this;
                    var data=this.$refs.pwdform.formModel;
                    if(data.password==null||data.password==""||data.confirmPwd==null||data.confirmPwd==""){
                        this.$message("请输入必填项!","提示");
                        return ;
                    }

                    if(data.password!=data.confirmPwd){
                        this.$message("两次输入密码不一致!","提示");
                        return ;
                    }
                    var param={
                        "plaintext": data.password
                    };
                    var encrypt = new JSEncrypt();
            		encrypt.setPublicKey(yufp.util.getRSAPublicKey());
                    var info=encrypt.encrypt(data.password);
                    yufp.service.request({
                        url:backend.uaaService+"/api/passwordcheck/checkpwd",
                        method:"get",
                        data:{
                        	sysId:yufp.session.logicSys.id,
                        	pwd:encodeURI(info),
                        	userId:me.pwdform.tempUserId,
                        	passwordTyp:'2'
                        },
                         callback:function(code,message,response){
                            if(response.code==='1001'){
                                yufp.service.request({
			                        url:backend.uaaService+"/api/account/password",
			                        method:"post",
			                        data:param,
			                         callback:function(code,message,response){
			                            if(response!=null&&response.ciphertext!=null){
			                                yufp.service.request({
			                                    url: backend.adminService + "/api/adminsmuser/resetpwd?userId=" + me.pwdform.tempUserId+"&password="+response.ciphertext+"&updateUser="+yufp.session.userId,
			                                    method: "POST",
			                                    callback: function(code, message, response) {
			                                        me.$message("密码修改成功!","提示");
			                                        me.pwdform.dialogVisible=false;
			                                    }
			                                });
			                            }
			                        }
			                    });
                            }else{
                            	me.$message({message: response.message, type: 'warning'});
                            	return false;
                            }
                        }
                    });
                    
                }
            },
            mounted:function () {
                this.queryMainGridFn();
                var me = this;
                yufp.lookup.bind('DATA_STS', function (data) {
                    me.stsOptions = data;
                })
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