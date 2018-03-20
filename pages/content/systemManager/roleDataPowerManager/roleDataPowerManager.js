/**
 * 角色数据权限配置
 * hujun3 2018-01-08
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
            el: "#roleDatapower",
            data: function(){
                var em=this;
                return {
                    typeOptions: [],
                    resetButton:!yufp.session.checkCtrl('reset'),//重置选择按钮控制
                    setOtherButton:!yufp.session.checkCtrl('setOther'),//反选选择按钮控制
                    copyButton:!yufp.session.checkCtrl('copy'),//复制选择按钮控制
                    uploadButton:!yufp.session.checkCtrl('upload'),//导出选择按钮控制
                    reourceUrl:backend.adminService+'/api/adminsmauthteco/datapowertreequery',
                    showObjectFlag:'R',
                    sourObjectId:'',
                    builObjectId:'',
                    filterSub:[],//数据权限明细数据字典数据
                    ifCopyFlag:false,//是否启动复制
                    formFields:  [
                            {placeholder: '角色所属机构', field: 'orgId',type:'custom',is:'yufp-org-tree',width:'120'},
                        	{placeholder: '角色代码', field: 'roleCode', type: 'input',width:'120'},
                       	    {placeholder: '角色名称', field: 'roleName', type: 'input',width:'120'}
                    ],
                    queryButtons: [
                        {label: '查询',  type: 'primary', icon: "yx-folder-upload", click: function () {
                            em.queryRoleFn();
                        }},
                        {label: '重置', type: 'primary', icon: 'yx-copy', click: function () {
                            em.resetQueryRoleFn();
                        }}
                    ],
                    resourcButtons: [
                        {label: '反选', icon: 'yx-checkmark2', click: function () {
                            em.reSelectFn();
                        }},
                        {label: '重置', icon: 'yx-cross', click: function () {
                            em.reSetFn();
                        }}
                    ],
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
                    menuTree:{
                        height: yufp.custom.viewSize().height - 130,
                        treeCheckBox:true
                    }

                }
            },
            methods: {
                exportInfoFn:function () {//导出数据
					var objectId='',objectType='R';
					if(this.roleGrid.currentRow !=null){
						 objectId= this.roleGrid.currentRow.roleId;
					}
                    var resourceType=['D'];
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
                },
                copyInfoFn:function () {//复制数据
					if(this.roleGrid.currentRow ==null||this.roleGrid.currentRow===''){
                        this.$message({message: '请先选择选择一条复制对象，然后点击复制', type: 'warning'});
                        return ;
                    }
                    this.sourObjectId= this.roleGrid.currentRow.roleId;
                    this.ifCopyFlag=true;
                    this.$message({message: '请先选择选择被复制对象，然后点击保存', type: 'warning'});


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
                            loginCode: this.userGrid.query.loginCode?this.userGrid.query.loginCode:null,
                            userName: this.userGrid.query.userName?this.userGrid.query.userName:null,
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
                selectRow_role:function (row) {//角色数据选中事件方法
                    if(row){
                        var me=this;
                        this.roleGrid.currentRow=row;
                        var param={
                            objectType:this.showObjectFlag,
                            objectId:row.roleId,
                            resType:'D'
                        };
                        me.reSetFn();//重置
                            //发起请求
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService+"/api/adminsmauthteco/queryinfo",
                            data: param,
                            callback: function (code, message, response) {
                                var infos = response.data;
                                var keys=[];
                                for(var i=0;i<infos.length;i++){
                                    keys.push(infos[i].authresId);
                                    me.$refs.menuTree.setChecked(infos[i].authresId,true,false);
                                }
                                //me.$refs.menuTree.setCheckedKeys(keys);
                            }
                        });

                    }else {
                        this.$message({message: '请选择一条数据', type: 'warning'});
                        return;
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
                selectAllFn:function () {//全选
                	var nodes=this.$refs.menuTree.data;
                	var keys=[];
                	for(var s=0;s<nodes.length;s++){
                		keys.push(nodes[s].id);
                	}
                    this.$refs.menuTree.setCheckedKeys(keys);
                    
                },
                selectCheckFn:function(node,flag,childNodes){
                	if(node.menuType==='D' && flag){//如果当前选中的节点是数据权限模版，就只能单选
                		var nodes=node.children;
                		var allNodes=this.$refs.menuTree.orginalData;
                		var allLength=allNodes.length;
                		var up=null;
                		for(var s=0;s<allLength;s++){
                			if(allNodes[s].id==node.upMenuId){
                				up=allNodes[s];
                				break;
                			}
                		}
                		this.$refs.menuTree.setChecked(up.id,false,true);
                  		this.$refs.menuTree.setChecked(node.id,true,false);	
                  		
                	}else{
                		if(flag){
                			this.$refs.menuTree.setChecked(node.id,false,false);
                		}
                	}
                },
                saveAllInfoFn:function () {
                    var em=this;
                    if(this.ifCopyFlag){//复制保存
                        this.builObjectId= this.roleGrid.currentRow.roleId;
                        if(this.builObjectId ==null||this.builObjectId===''){
                            em.$message({message: '请先选择选择一条复制对象', type: 'warning'});
                            return ;
                        }
                        var param={
                            sourObjectType:'R',
                            sourObjectId:this.sourObjectId,
                            builObjectType:'R',
                            builObjectId:this.builObjectId,
                            lastChgUsr:yufp.session.userId,
                        };
                        //发起请求
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService+"/api/adminsmauthteco/savecopydatapowerinfo",
                            data: JSON.stringify(param),
                            callback: function (code, message, response) {
                                this.ifCopyFlag=false;
                                this.sourObjectType='';
                                this.sourObjectId='';
                                em.$message({message: '复制成功', type: 'success'});    
                            }
                        });

                    }else{//普通操作保存
                        var objectType=this.showObjectFlag  ;
                        var objectId;
                        var dataInfo=[];
                        this.checkObjSelected(this.roleGrid.currentRow);
                        objectId= this.roleGrid.currentRow.roleId;
                        if(objectId ===null||objectType===''){
                            em.$message({message: '请选择一条对象数据', type: 'warning'});
                            return ;
                        }
                        var checks=this.$refs.menuTree.getCheckedKeys();
                        var checksNodes=this.$refs.menuTree.getCheckedNodes();
                            for(var i=0;i<checksNodes.length;i++){
                            	if(checksNodes[i].menuType ==='D'){
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
                                dataInfo.push(data);
                            	}
                                
                            }
                        if(dataInfo.length>0){
                            //发起请求
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService+"/api/adminsmauthteco/savedatapowerinfo",
                                data: JSON.stringify(dataInfo),
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
                yufp.lookup.bind('NATIONALITY', function (data) {
                    me.typeOptions = data;
                });
            }
        });
    };

});