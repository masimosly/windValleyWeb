/**
 * 资源对象配置管理
 * hujun3
 */
define([
    './custom/widgets/js/yufpOrgTree.js'
],function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        //注册该功能要用到的数据字典
        yufp.lookup.reg("DATA_STS,OBJECT_TYPE,RESOURCE_TYPE");

        //创建virtual model
        var vm =  yufp.custom.vue({
            el: "#resourceSet",
            data: function(){
                var em=this;
                return {
                    typeOptions: [],
                    resetButton:!yufp.session.checkCtrl('reset'),//重置选择按钮控制
                    setOtherButton:!yufp.session.checkCtrl('setOther'),//反选选择按钮控制
                    selectAllButton:!yufp.session.checkCtrl('selectAll'),//全选选择按钮控制
                    copyButton:!yufp.session.checkCtrl('copy'),//复制选择按钮控制
                    uploadButton:!yufp.session.checkCtrl('upload'),//导出选择按钮控制
                    treeUrl:backend.adminService+'/api/adminsmorg/orgtreequery',
                    orgRootId:yufp.session.org.code,//根节点ID
                    reourceUrl:backend.adminService+'/api/adminsmauthteco/menutreequery',
                    showObjectFlag:'R',//对象标识
                    sourObjectId:'',//复制原ID
                    sourObjectType:'R',//复制源类型-默认是角色
                    builObjectType:'R',//获取复制数据的对象类型-默认是角色
                    builObjectId:'',//获取复制数据的对象ID
                    nodeCheckNum:0,//资源树节点被勾选操作的次数
                    resData:false,//查询出的资源数据
                    ifselectData:false,//是否选中了数据
                    filterSub:[],//数据权限明细数据字典数据
                    ifCopyFlag:false,//是否启动复制
                    formFields:  [
                            { field: 'objectType',type: 'select' ,dataCode:'OBJECT_TYPE',change:function(value){
                                em.showObjectFlag=value;
                                if(em.ifCopyFlag){
                                    em.builObjectType=value;
                                }else{
                                    em.sourObjectType=value;
                                }
                            }}
                    ],
                    queryButtons: [
                        {label: '导出',   icon: "yx-folder-upload", click: function () {
                            em.exportInfoFn();
                        }},
                        {label: '复制',  icon: 'yx-copy', click: function () {
                            em.copyInfoFn();
                        }}
                    ],
                    resourcButtons: [
                        {label: '全选',  icon: "yx-cloud-check", click: function () {
                            em.selectAllFn();
                        }},
                        {label: '反选', icon: 'yx-checkmark2', click: function () {
                            em.reSelectFn();
                        }},
                        {label: '重置', icon: 'yx-cross', click: function () {
                            em.reSetFn();
                        }}
                    ],
                    resourceForm:{
                        resourceType:''
                    },
                    roleGrid:{
                        query: {
                            orgId: '',
                            roleCode: '',
                            roleName: ''
                        },
                        height: yufp.custom.viewSize().height - 155,
                        currentRow: null,
                        checkbox: false,
                       // dataUrl: backend.adminService+'/api/adminsmrole/querypage',
                        dataUrl: backend.adminService+'/api/adminsmrole/querybyrolests',
                        dataParams: {},
                        tableColumns: [
                            //{ label: '角色ID', prop: 'roleId' },
                            { label: '角色名称', prop: 'roleName', width: 150,resizable: true},
                            { label: '角色代码', prop: 'roleCode', width: 140,  resizable: true},
                            { label: '所属机构', prop: 'orgName',resizable: true }
                        ]
                    },
                    dptGrid:{
                        query: {
                            dptCde: '',
                            dptName: '',
                            belongOrgId: ''
                        },
                        height: yufp.custom.viewSize().height - 155,
                        checkbox: false,
                        currentRow: null,
                        dataUrl: backend.adminService+'/api/adminsmdpt/',
                        dataParams: {},
                        tableColumns: [
                           // { label: 'ID', prop: 'dptId' },
                            { label: '部门名称', prop: 'dptName', width: 170,resizable: true},
                            { label: '部门代码', prop: 'dptCde', width: 150,  resizable: true},
                            { label: '所属机构', prop: 'orgName',resizable: true }


                        ]
                    },
                    userGrid:{
                        query: {
                            userInfo: '',
                            orgId: ''
                        },
                        height: yufp.custom.viewSize().height - 155,
                        checkbox: false,
                        currentRow: null,
                        dataUrl: backend.adminService+'/api/adminsmuser/querypage',
                        dataParams: {},
                        tableColumns: [
                           // { label: 'ID', prop: 'userId' },
                            { label: '姓名', prop: 'userName', width: 160,resizable: true},
                            { label: '登录代码', prop: 'loginCode', width: 150,  resizable: true},
                            { label: '所属部门', prop: 'dptName',resizable: true }


                        ]
                    },
                    orgTree:{
                        nowNode:'',
                        height: yufp.custom.viewSize().height - 130,
                    },
                    menuTree:{
                        height: yufp.custom.viewSize().height - 130,
                        treeCheckBox:true
                    }

                }
            },
            methods: {
                exportInfoFn:function () {//导出数据
                	var objectId='',objectType='';
                	if(this.ifselectData){
                		if(this.showObjectFlag==='R'){//角色
                       		objectId= this.roleGrid.currentRow.roleId;
	                    }else if(this.showObjectFlag==='U'){//用户
	                        objectId=this.userGrid.currentRow.userId;
	                    }else if(this.showObjectFlag==='D'){//部门
	                        objectId= this.dptGrid.currentRow.dptId;
	                    }else if(this.showObjectFlag==='G'){//机构
	                        objectId=this.orgTree.nowNode.orgId;
	                    }
                	}
 					
                    objectType=this.showObjectFlag;
                    var resourceType=['M','C'];
                    var param={
                        objectId:objectId,
                        objectType:objectType,
                        resourceType:resourceType
                    };

                    var params={};
                    params.url=backend.adminService+"/api/adminsmauthteco/export";
                    params.url=yufp.service.getUrl(params);
                    params.url+="?access_token=" + yufp.service.getToken();
                    params.url+="&condition="+JSON.stringify(param);
                    window.open(params.url);
// 					yufp.service.request({
//                          method: 'GET',
//                          url: backend.adminService+"/api/adminsmauthteco/exportexcel?objectType="+objectType+"&objectId"+objectId,
//                          callback: function (code, message, response) {
//                              var taskId = response.data.taskId;
//                              yufp.service.request({
//		                            method: 'GET',
//		                            url: backend.adminService+"/api/excelio/download/"+taskId,
//		                            callback: function (code, message, response) {
//		                            }
//		                        });
//                          }
//                  });
                },
                copyInfoFn:function () {//复制数据
                    if(this.sourObjectType==='R'){//角色
                    	if(this.roleGrid.currentRow ==null){
	                        this.$message({message: '请先选择选择一条复制对象，然后点击复制', type: 'warning'});
	                        return ;
                    	}
                        this.sourObjectId= this.roleGrid.currentRow.roleId;
                    }else if(this.sourObjectType==='U'){//用户
                    	if(this.userGrid.currentRow ==null){
	                        this.$message({message: '请先选择选择一条复制对象，然后点击复制', type: 'warning'});
	                        return ;
                    	}
                        this.sourObjectId=this.userGrid.currentRow.userId;
                    }else if(this.sourObjectType==='D'){//部门
                    	if(this.dptGrid.currentRow ==null){
	                        this.$message({message: '请先选择选择一条复制对象，然后点击复制', type: 'warning'});
	                        return ;
                    	}
                        this.sourObjectId= this.dptGrid.currentRow.dptId;
                    }else if(this.sourObjectType==='G'){//机构
                    	if(this.orgTree.nowNode ==null){
	                        this.$message({message: '请先选择选择一条复制对象，然后点击复制', type: 'warning'});
	                        return ;
                    	}
                        this.sourObjectId=this.orgTree.nowNode.orgId;
                    }
                    this.ifCopyFlag=true;
                    this.$message({message: '请先选择选择被复制对象，然后点击保存', type: 'warning'});


                },
                orgClickFn:function (nodes) {//机构数点击事件
                    if(nodes !=null){
                    	this.ifselectData=true;
                        var me=this;
                        this.orgTree.nowNode=nodes;
                        var param={
                            objectType:this.showObjectFlag,
                            objectId:nodes.orgId,
                            resType:'M,C'
                        };
                            //发起请求
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+"/api/adminsmauthteco/queryinfo",
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                me.resData=infos;
                                var keys=[];
                                for(var i=0;i<infos.length;i++){
                                        keys.push(infos[i].authresId);
                                        me.$refs.menuTree.setChecked(infos[i].authresId,true,false);
                                }
                                me.nodeCheckNum=0;
                                
                            }
                        });

                    }else {
                        this.$message({message: '请选择一个节点', type: 'warning'});
                        return;
                    }
                    
                },
                queryRoleFn: function () {//角色查询
                    this.$refs.roleTable.remoteData({
                        condition: JSON.stringify({
                            orgId: this.roleGrid.query.orgId?this.roleGrid.query.orgId:null,
                            roleCode: this.roleGrid.query.roleCode?this.roleGrid.query.roleCode:null,
                            roleName: this.roleGrid.query.roleName?this.roleGrid.query.roleName:null,
                            roleSts: 'A'
                        })

                    });
                },
                queryDptFn: function () {//部门查询
                    this.$refs.dptTable.remoteData({
                        condition: JSON.stringify({
                            belongOrgId: this.dptGrid.query.belongOrgId?this.dptGrid.query.belongOrgId:null,
                            dptCde: this.dptGrid.query.dptCde?this.dptGrid.query.dptCde:null,
                            dptName: this.dptGrid.query.dptName?this.dptGrid.query.dptName:null,
                            dptSts:'A'
                        })
                    });
                },
                queryUserFn: function () {//用户查询
                    this.$refs.userTable.remoteData({
                        condition: JSON.stringify({
                            orgId: this.userGrid.query.orgId?this.userGrid.query.orgId:null,
                            userInfo: this.userGrid.query.userInfo?this.userGrid.query.userInfo:null,
                            userSts:'A'
                        })
                    });
                },
                resetQueryRoleFn: function () {//角色查询重置
                    this.roleGrid.query = {
                        orgId: '',
                        roleCode: '',
                        roleName: ''
                    };
                },
                resetDptRoleFn: function () {//部门查询重置
                    this.dptGrid.query = {
                        dptCde: '',
                        dptName: '',
                        belongOrgId:''
                    };
                },
                resetUserFn: function () {//用户查询重置
                    this.userGrid.query = {
                        userInfo: '',
                        orgId: ''
                    };
                },
                rowClickFn_dep:function (row) {//部门数据选中事件方法
                    if(row !=null){
                    	this.ifselectData=true;
                        var me=this;
                        this.dptGrid.currentRow=row;
                        var param={
                            objectType:this.showObjectFlag,
                            objectId:row.dptId,
                            resType:'M,C'
                        };
                        me.reSetFn();//重置
                            //发起请求
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+"/api/adminsmauthteco/queryinfo",
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                me.resData=infos;
                                var keys=[];
                                for(var i=0;i<infos.length;i++){
                                    keys.push(infos[i].authresId);
                                    me.$refs.menuTree.setChecked(infos[i].authresId,true,false);
                                }
                               // me.$refs.menuTree.setCheckedKeys(keys,true);
                                 me.nodeCheckNum=0;
                            }
                        });


                    }else {
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
                    }
                },
                selectRow_user:function (row) {//用户数据选中事件方法
                    if(row){
                    	this.ifselectData=true;
                        var me=this;
                        this.userGrid.currentRow=row;
                        var param={
                            objectType:this.showObjectFlag,
                            objectId:row.userId,
                            resType:'M,C'
                        };
                        me.reSetFn();//重置
                            //发起请求
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+"/api/adminsmauthteco/queryinfo",
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                me.resData=infos;
                                var keys=[];
                                for(var i=0;i<infos.length;i++){
                                    keys.push(infos[i].authresId);
                                    me.$refs.menuTree.setChecked(infos[i].authresId,true,false);
                                }
                                 me.nodeCheckNum=0;
                            }
                        });


                    }else {
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
                    }
                },
                selectRow_role:function (row) {//角色数据选中事件方法
                    if(row){
                    	this.ifselectData=true;
                        var me=this;
                        this.roleGrid.currentRow=row;
                        var param={
                            objectType:this.showObjectFlag,
                            objectId:row.roleId,
                            resType:'M,C'
                        };
                        var nodes=this.$refs.menuTree.data;
                		me.reSetFn();//重置
                            //发起请求
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+"/api/adminsmauthteco/queryinfo",
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                me.resData=infos;
                                var keys=[];
                                for(var i=0;i<infos.length;i++){
                                    keys.push(infos[i].authresId);
                                    me.$refs.menuTree.setChecked(infos[i].authresId,true,false);
                                }
                                me.nodeCheckNum=0;
                            }
                        });

                    }else {
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
                    }
                },
                selectAllFn:function () {//全选
                	var nodes=this.$refs.menuTree.data;
                	for(var s=0;s<nodes.length;s++){
                		this.$refs.menuTree.setChecked(nodes[s].id,true,true);
                	}
                },
              
                reSelectFn:function () {//反选
                    var checks=this.$refs.menuTree.getCheckedKeys();
                    this.selectAllFn();
                    for(var i=0;i<checks.length;i++){
                    	   this.$refs.menuTree.setChecked(checks[i],false,false);
                    }
                },
                reSetFn:function () {//重置
                	
                    this.$refs.menuTree.setCheckedKeys([]);
                },
                //是否选中对象 add by chenlin 20171229
                checkObjSelected:function(row){
                    if(row===null||row===''){
                        this.$message({message: '请先选择选择一条对象进行授权', type: 'warning'});
                        return;
                    }
                },
                saveAllInfoFn:function () {
                    var em=this;
                    if(em.ifCopyFlag){//复制保存
                        if(em.builObjectType===''){
                            em.builObjectType=em.showObjectFlag;
                        }
                        if(em.builObjectType==='R'){//角色
                        	if( em.roleGrid.currentRow==null){
	                            em.$message({message: '请先选择选择一条复制对象', type: 'warning'});
	                            return ;
                        	}
                            em.builObjectId= em.roleGrid.currentRow.roleId;
                        }else if(em.builObjectType==='U'){//用户
                        	if(em.userGrid.currentRow ==null){
	                            em.$message({message: '请先选择选择一条复制对象', type: 'warning'});
	                            return ;
                        	}
                            em.builObjectId= em.userGrid.currentRow.userId;
                        }else if(em.builObjectType==='D'){//部门
                        	if(em.dptGrid.currentRow ==null){
	                            em.$message({message: '请先选择选择一条复制对象', type: 'warning'});
	                            return ;
                        	}
                            em.builObjectId= em.dptGrid.currentRow.dptId;
                        }else if(em.builObjectType==='G'){//机构
                        	if(em.orgTree.nowNode ==null){
	                            em.$message({message: '请先选择选择一条复制对象', type: 'warning'});
	                            return ;
                        	}
                            em.builObjectId=em.orgTree.nowNode.orgId;
                        }
                        
                        var param={
                            sourObjectType:em.sourObjectType,
                            sourObjectId:em.sourObjectId,
                            builObjectType:em.builObjectType,
                            builObjectId:em.builObjectId,
                            lastChgUsr:yufp.session.userId,
                        };
                        //发起请求
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+"/api/adminsmauthteco/savecopyinfo",
                            data: JSON.stringify(param),
                            callback: function (code, message, response) {
                                em.ifCopyFlag=false;
                                em.sourObjectType='R';
                                em.sourObjectId='';
                                em.builObjectType='R';
                                em.builObjectType='';
                                em.$message({message: '复制成功', type: 'success'});
                            }
                        });

                    }else{//普通操作保存
                        var objectType=em.showObjectFlag  ;
                        var objectId;
                        var dataInfo=[];
                        var ctrInfo=[];//控制点数据
                        var dataMap={};
                        if(objectType==='R'){//角色
                            em.checkObjSelected(em.roleGrid.currentRow);
                            objectId= this.roleGrid.currentRow.roleId;
                        }else if(objectType==='U'){//用户
                            em.checkObjSelected(em.userGrid.currentRow);
                            objectId= em.userGrid.currentRow.userId;
                        }else if(objectType==='D'){//部门
                            em.checkObjSelected(em.dptGrid.currentRow);
                            objectId= em.dptGrid.currentRow.dptId;
                        }else if(objectType==='G'){//机构
                            em.checkObjSelected(em.orgTree.nowNode);
                            objectId=em.orgTree.nowNode.orgId;
                        }
                        if(objectId ===null||objectType===''){
                            em.$message({message: '请选择一条对象数据', type: 'warning'});
                            return ;
                        }
                        var checks=em.$refs.menuTree.getCheckedKeys();
                        var checksNodes=em.$refs.menuTree.getCheckedNodes();
                            for(var i=0;i<checksNodes.length;i++){
                                var data={
                                    authRecoId:null,
                                    authobjId:objectId,
                                    authobjType:objectType,
                                    authresType:checksNodes[i].menuType,
                                    lastChgUsr:yufp.session.userId,
                                    sysId:yufp.session.logicSys.id,
                                    authresId:checksNodes[i].id,
                                    menuId:checksNodes[i].menuId
                                };
                                if(checksNodes[i].menuType==='M'){
                            		dataInfo.push(data);
                            	}else{
                            		ctrInfo.push(data);
                            	}
                                
                            }
                          dataMap.menuData=dataInfo;
                          dataMap.ctrData=ctrInfo;
                        if(dataInfo.length>0){
                            //发起请求
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmauthteco/saveinfo",
                                data: JSON.stringify(dataMap),
                                callback: function (code, message, response) {
	                                em.$message({message: '操作保存成功', type: 'success'});
                                }
                            });
                        }else {
                            em.$message({message: '请选择要保存的资源数据', type: 'warning'});
                            return ;
                        }

                    }

                },
                //菜单树加节点样式 add by chenlin 20171229
                renderContent:function() {                	
                    var createElement = arguments[0];
                    var type = arguments[1].data.menuType;
                    return createElement('span',[
                            createElement('span',{attrs:{class:'yu-treeMenuType'+type}},type),
                            createElement('span',arguments[1].data.label)
                        ]
                    );
                }
            },
            mounted: function(){
                var me = this;
                yufp.lookup.bind('OBJECT_TYPE', function (data) {
                    me.typeOptions = data;
                });
            }
        });
    };

});