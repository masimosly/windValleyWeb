/**
 * Created by sunxiaojun on 2017/11/16.
 */
define([
        './custom/widgets/js/yufpOrgTree.js'
    ],function (require, exports) {
    yufp.lookup.reg('DATA_STS,SYS_TYPE,FINCAL_ORG');
    var instuOptions = [];
    //自定义字典（金融机构）
    yufp.service.request({
        method: 'GET',
        url: backend.adminService + "/api/adminsmorg/getinstuorg",
        callback: function (code, message, response) {
            var instu = response.data;
            for(var i=0;i<instu.length;i++){
                var option = {};
                option.key = instu[i].instuId;
                option.value=instu[i].instuName;
                instuOptions.push(option);
            }
        }
    });
//  var instuKeyValue = instuOptions.reduce(function (acc, cur) {
//      acc[cur.key] = cur.value
//      return acc
//  }, {});

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
            el: "#orgInfo",
            data:function(){
                var em=this;
                return{
                    height_org:!yufp.custom.viewSize().height-20,
                    createButton:!yufp.session.checkCtrl('addOrg'),//新增按钮控制
					editButton:!yufp.session.checkCtrl('editOrg'),//修改按钮控制
					deleteButton:!yufp.session.checkCtrl('deleteOrg'),//删除按钮控制
					useButton:!yufp.session.checkCtrl('useOrg'),//启用按钮控制
					unuseButton:!yufp.session.checkCtrl('unuseOrg'),//停用按钮控制
                    orgRootId:yufp.session.org.code,//根据节点ID
                    treeUrl:backend.adminService+'/api/adminsmorg/orgtreequery?orgId='+yufp.session.org.code,
                    queryFileds: [
                        {placeholder: '机构代码', field: 'orgCode', type: 'input'},
                        {placeholder: '机构名称', field: 'orgName', type: 'input'},
                        {placeholder: '状态', field: 'orgSts', type: 'select',  dataCode: 'DATA_STS'}
                    ],
                    queryButtons: [
                        {
                            label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            em.mainGrid.query.orgCode=model.orgCode;
                            em.mainGrid.query.orgName=model.orgName;
                            em.mainGrid.query.orgSts=model.orgSts;
                            em.queryMainGridFn();
                        }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'information'}
                    ],
                    mainGrid:{
                        query: {
                            orgCode: '',
                            orgName: '',
                            unitOrgId:'',
                            orgSts: ''
                        },

                        height: yufp.custom.viewSize().height - 150,
                        checkbox: true,
                        dataUrl: backend.adminService+'/api/adminsmorg/querypage',
                        paging: {
                            page: 1,
                            size: 10
                        },
                        currentRow: null,
                        dataParams:{},
                        tableColumns: [
                            //   { label: '编号', prop: 'orgId' , width: 230},
                            { label: '机构名称', prop: 'orgName', width: 187,  resizable: true, template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.orgName }}</a>\
                            </template>';
                            } },
                            { label: '机构代码', prop: 'orgCode',resizable: true },
                            { label: '金融机构名称', prop: 'instuName',resizable: true },
                            { label: '状态', prop: 'orgSts', width: 90,resizable: true, dataCode: 'DATA_STS'},
                            { label: '最新变更用户', prop: 'lastChgName', resizable: true},
                            { label: '最新变更时间', prop: 'lastChgDt', type:'date', resizable: true},
                            { label: '上级机构', prop: 'upOrgName',type:'date', resizable: true}
                        ]
                    },
                    updateFields: [{
                        columnCount: 3,
                        fields: [
                            { field: 'instuId', label: '金融机构',type: 'select',  options: instuOptions,rules: [
                                {required: true, message: '必填项', trigger: 'change'}
                            ] ,change:function (value){
                            		var temp = yufp.clone(em.updateFields[0].fields[3].params);
                                        temp.dataParams={
                                            orgSts:'A',
                                            orgCode:yufp.session.org.code,
                                            instuId:value
                                        }
                                        em.updateFields[0].fields[3].params = yufp.clone(temp);
                                        if(em.dialogStatus=='update'){
	                                        var instuId = em.$refs.mytable.selections[0].instuId;
	                                        if(instuId!=value){
	                                        	em.$refs.myform.formModel.upOrgId = '';
	                                        }	
                                        }else{
                                        	em.$refs.myform.formModel.upOrgId = '';
                                        }
                                        
                                    }},
                            { field: 'orgCode', label: '机构代码',rules:[
                                {required: true, message: '必填项', trigger: 'blur'},
                                {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' },
                                {validator: yufp.validator.speChar,message: '输入信息包含特殊字符', trigger: 'blur'}
                            ]},
                            { field: 'orgName',label: '机构名称', rules:[
                                {required: true, message: '必填项', trigger: 'blur'},
                                {max: 100, message: '最大长度不超过100个字符', trigger: 'blur' },
                                {validator: yufp.validator.speChar,message: '输入信息包含特殊字符', trigger: 'blur'}
                            ]},
                            { field: 'upOrgId',label: '上级机构',type:'custom',is:'yufp-org-tree',params: {
                                        dataUrl: backend.adminService+'/api/adminsmorg/orgtreequery',
                                        dataId:"orgCode",
                                        needCheckbox: false
                                    },
                                rules:[
                                {required: true, message: '必填项', trigger: 'change'}
                            ],selectFn:function (code,data,arry){
                            		if(arry[0].orgLevel===''){
                            			  em.$refs.myform.formModel.orgLevel=1;
                            		}else{
                            			 em.$refs.myform.formModel.orgLevel=parseInt(arry[0].orgLevel)+1;
                            		}
                                    }},
                            { field: 'orgLevel',label: '机构层级',readonly:true, rules:[
                                {required: true,validator: yufp.validator.number, message: '必填项', trigger: 'blur'}
                            ]},
                            { field: 'orgSts', label: '状态' , type: 'select', dataCode: 'DATA_STS',readonly:true }
                        ]
                    }],
                    updateFields2: [{
                        columnCount: 3,
                        fields: [
                            { field: 'zipCde', label: '邮编', rules:[
                            	{max: 6, message: '邮编超长', trigger: 'blur' },
                                {validator: yufp.validator.postcode,message: '请输入正确邮编', trigger: 'blur'}
                            ]},
                            { field: 'contUsr',label: '联系人',rules:[
                            	{max: 100, message: '最大长度不超过100个字符', trigger: 'blur' }
                            ] },
                            { field: 'contTel', label: '联系电话', rules:[
                                {validator: yufp.validator.mobile,message: '请输入正确信息', trigger: 'blur'}
                            ]},
                            { field: 'lastChgName',label: '最新变更用户' },
                            { field: 'lastChgDt',label: '最新变更时间' }
                        ]
                    },{
                        columnCount: 1,
                        fields: [
                            { field: 'orgAddr', label: '地址', type: 'textarea', rows: 1,rules:[
                            	{max: 200, message: '最大长度不超过200个字符', trigger: 'blur' }
                            ] }
                        ]
                    }],

                    stsOptions:null,
                    dialogFormVisible: false,
                    nowNode:null,//当前选中节点数据
                    rootId:'root',//根节点ID
                    rootName:'组织机构树',//根节点名称
                    orgStore:null,
                    orgdata:null,
                    dialogStatus: '',
                    formDisabled:false,
                    dialogDisabled: true,
                    activeName:['1'],//默认显示name为1的
                    textMap: {
                        update: '修改',
                        create: '新增',
                        detail: '详情'
                    },
                    options: instuOptions
                }
            },
            filters: {
                dateFilter: function(d) {

                    return parseTime(d, '{y}-{m}-{d}');
                }
            },
            methods: {
                queryMainGridFn:function() {
                    var me =this;
                    var param = {
                        condition: JSON.stringify({
                            orgCode: this.mainGrid.query.orgCode?this.mainGrid.query.orgCode:null,
                            orgName: this.mainGrid.query.orgName?this.mainGrid.query.orgName:null,
                            unitOrgId: this.mainGrid.query.unitOrgId?this.mainGrid.query.unitOrgId:null,
                            orgSts: this.mainGrid.query.orgSts?this.mainGrid.query.orgSts:null
                        })
                    };
                    me.$refs.mytable.remoteData(param);
                },
                nodeClickFn:function(node, obj, nodeComp) {
                    if(node !=''){
                        this.nowNode=node;
                        this.mainGrid.query.unitOrgId=node.orgId;
                        this.queryMainGridFn()
                    }
                },
                resetTempFn: function () {
                    this.$refs.myform.resetFields();
                    this.$refs.myform1.resetFields();
                },
                closeDialogFn:function(){
                	this.dialogFormVisible = false;
                },
                openCreateFn: function () {
                    this.dialogStatus = 'create';

                    this.activeName=['1'];
                    this.dialogFormVisible = true;
                    this.formDisabled=false;
                    this.updateFields[0].fields[1].readonly=false;
                    this.updateFields2[0].fields[3].hidden=true;
 				    this.updateFields2[0].fields[4].hidden=true;
                    this.$nextTick(function () {
                        this.$refs.myform.resetFields();
                        this.$refs.myform1.resetFields();
                        this.$refs.myform.formModel.orgSts='A';
                       var temp = yufp.clone(this.updateFields[0].fields[3].params);
                           temp.dataParams={
                                    orgSts:'A',
                                    orgCode:yufp.session.org.code
                                 }
                        this.updateFields[0].fields[3].params = yufp.clone(temp);
                        if(this.nowNode !=null){
                                this.$refs.myform.formModel.instuId=this.nowNode.instuId;
                                this.$refs.myform.formModel.upOrgId=this.nowNode.orgId;
                                this.$refs.myform.formModel.orgLevel=(parseInt(this.nowNode.orgLevel)+1);
                        }
                    });
                },
                openDetailFn: function (row) {
                    this.dialogStatus = 'detail';
                    this.activeName=['1','2'];
                    this.formDisabled=true;
                    this.dialogFormVisible = true;
                    this.formDisabled=true;
                    this.updateFields2[0].fields[3].hidden=false;
 					this.updateFields2[0].fields[4].hidden=false;
                    this.$nextTick(function () {
                        this.$refs.myform.resetFields();
                        this.$refs.myform1.resetFields();
                        
                        yufp.extend(this.$refs.myform.formModel, row.row);
                        yufp.extend(this.$refs.myform1.formModel, row.row);
                    });
                },
                openEditFn: function (row) {
                	 if (this.$refs.mytable.selections.length!==1){
                        this.$message({message: '请选着一条数据!', type: 'warning'});
                        return false;
                    }
                    var row=this.$refs.mytable.selections[0];
                    if ( row.orgSts === 'A') {
                        this.$message({message: '只能选着停用和待启用的数据', type: 'warning'});
                        return;
                    }
                    this.dialogStatus = 'update';
                    this.activeName=['1'];

                    this.dialogFormVisible = true;
                    this.formDisabled=false;
                    this.updateFields[0].fields[1].readonly=true;
                    this.updateFields2[0].fields[3].hidden=true;
 					this.updateFields2[0].fields[4].hidden=true;
                    this.$nextTick(function () {
                        this.$refs.myform.resetFields();
                        this.$refs.myform1.resetFields();
                         var temp = yufp.clone(this.updateFields[0].fields[3].params);
                           temp.dataParams={
                                    orgSts:'A',
                                    orgCode:yufp.session.org.code,
                                    instuId:row.instuId
                                }
                        this.updateFields[0].fields[3].params = yufp.clone(temp);
                        yufp.extend(this.$refs.myform.formModel, row);
                        yufp.extend(this.$refs.myform1.formModel, row);
                    });
                },
                saveCreateFn:function () {
                    var me=this;
                    var myform = me.$refs.myform, myform1 = me.$refs.myform1;
                    myform.validate(function(valid){
                    	myform1.validate(function(valid1){
                        if (valid == valid1 && valid == true) {
                            var comitData = {
                                contTel:null,
                                contUsr: null,
                                orgAddr: null,
                                zipCde: null};
                            delete myform.formModel.orgId;
                            yufp.extend(comitData, myform.formModel);
                            comitData.zipCde=myform1.formModel.zipCde;
                            comitData.contUsr= myform1.formModel.contUsr;
                            comitData.contTel= myform1.formModel.contTel;
                            comitData.orgAddr= myform1.formModel.orgAddr;
                            comitData.lastChgUsr=yufp.session.userId;
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmorg/addorginfo",
                                data: comitData,
                                callback: function (code, message, response) {
                                    if(response.data.code==='2'){
                                        me.$message({message: response.data.message, type: 'warning'});
                                    }else{
                                        me.dialogFormVisible = false;
                                        me.$message({message: '数据保存成功！'});
                                        me.queryMainGridFn();
                                        me.$refs.mytree.remoteData();
                                    }

                                }
                            });
	                        }else {
	                            me.$message({message: '请检查输入项是否合法', type: 'warning'});
	                            return false;
	                        }
                        });
                    });
                },
                saveEditFn:function (form) {
                    var me=this;
                    var myform = me.$refs.myform, myform1 = me.$refs.myform1;
                    myform.validate(function(valid){
                    	myform1.validate(function(valid1){
                        if (valid == valid1 && valid == true) {
                            var comitData = {
                                contTel:null,
                                contUsr: null,
                                orgAddr: null,
                                zipCde: null};

                            yufp.extend(comitData, myform.formModel);
                           // yufp.extend(comitData, myform1.formModel);
                            comitData.zipCde=myform1.formModel.zipCde;
                            comitData.contUsr= myform1.formModel.contUsr;
                            comitData.contTel= myform1.formModel.contTel;
                            comitData.orgAddr= myform1.formModel.orgAddr;
                            comitData.lastChgUsr=yufp.session.userId;
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmorg/update",
                                data: comitData,
                                callback: function (code, message, response) {
                                    if(response.data.code==='2'){
                                        me.$message({message: response.data.message, type: 'warning'});
                                    }else{
                                        me.dialogFormVisible = false;
                                        me.$message({message: '数据保存成功！'});
                                        me.queryMainGridFn();
                                        me.$refs.mytree.remoteData();
                                    }

                                }
                            });
                        }else {
                            me.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                       });
                    });
                },
                useBatchFn: function () {//批量启用
                    var rows=this.$refs.mytable.selections;
                    var me=this;
                    if (rows.length>0) {
                        var id='';
                        for (var i=0;i< rows.length;i++)
                        {
                            var row=rows[i];
                            if(row.orgSts === 'W' || row.orgSts==='I'){
                                id=id+','+row.orgId
                            }else {
                                this.$message({message: '只能选择失效或待生效的数据', type: 'warning'});
                                return;
                            }
                        }
                        me.$confirm('此操作将启用该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
			                yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService+"/api/adminsmorg/usebatch?ids="+id+'&lastChgUsr='+yufp.session.userId,
	                            data:null,
	                            callback: function (code, message, response) {
	                                me.$message({message: '数据操作成功！'});
	                                me.queryMainGridFn()
	                            }
                        	});
						})
                      

                    } else {
                        me.$message({message: '请先选择要启用的数据', type: 'warning'});
                        return;
                    }

                },
                unUseBatchFn: function () {//批量停用
                    var rows=this.$refs.mytable.selections;
                    var me=this;
                    if (rows.length>0) {
                        var id='';
                        for (var i=0;i< rows.length;i++)
                        {
                            var row=rows[i];
                            if(row.orgSts==='A'){
                                id=id+','+row.orgId
                            }else {
                                this.$message({message: '只能选择已生效的数据', type: 'warning'});
                                return;
                            }
                        }

                        
                        me.$confirm('此操作将停用该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
			                yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService+"/api/adminsmorg/unusebatch?ids="+id+'&lastChgUsr='+yufp.session.userId,
	                            callback: function (code, message, response) {
	                                me.$message({message: '数据操作成功！'});
	                                me.queryMainGridFn()
	                            }
	                        });
						})
                       

                    } else {
                        me.$message({message: '请先选择要停用的数据', type: 'warning'});
                        return
                    }

                },
                deletestFn: function () {//批量删除
                    var rows=this.$refs.mytable.selections;
                    var me=this;
                    if (rows.length>0) {
                        var id='';
                        for (var i=0;i< rows.length;i++)
                        {
                            var row=rows[i];
                            if(row.orgSts === 'W' || row.orgSts==='I'){
                                id=id+','+row.orgId
                            }else {
                                this.$message({message: '只能删除失效或待生效的数据', type: 'warning'});
                                return;
                            }
                        }
                        me.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function(){
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmorg/deletebatch?ids="+id,
                                data: {
                                    ids:id
                                },
                                callback: function (code, message, response) {
                                    me.$message({message: response.data.message});
                                    me.queryMainGridFn();
                                    me.$refs.mytree.remoteData();
                                }
                            });
                        })

                    } else {
                        me.$message({message: '请先选择要删除的数据', type: 'warning'});
                        return;
                    }
                },

            },
            mounted:function () {
                this.queryMainGridFn();
                var me = this;
                yufp.lookup.bind('DATA_STS', function (data) {
                    me.stsOptions = data;
                    stsKeyValue= me.stsOptions.reduce(function(acc, cur){
                        acc[cur.key] = cur.value;
                        return acc
                    }, {})
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