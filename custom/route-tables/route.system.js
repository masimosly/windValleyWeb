/**
 * Created by  on 2017/11/16.
 */
define(function(require){
    //定义路由表
    var routeTable={
        security: {
            html: 'pages/example/native/security.html',
            js: 'pages/example/native/security.js'
        },
        fincalOrgManager:{
            html: "pages/content/systemManager/fincalOrgManager/fincalOrgManager.html",
            js: "pages/content/systemManager/fincalOrgManager/fincalOrgManager.js"
        },
        orgInfoManager:{
            html:'pages/content/systemManager/orgInfoManager/orgInfoManager.html',
            js:'pages/content/systemManager/orgInfoManager/orgInfoManager.js'
        },
        resourceSet:{
            html:'pages/content/systemManager/ResourceAllocationManager/resourceSetManager.html',
            js:'pages/content/systemManager/ResourceAllocationManager/resourceSetManager.js'
        },
        logManage:{
            html:'pages/content/systemManager/logManager/logManager.html',
            js:'pages/content/systemManager/logManager/logManager.js'
        },
        functionManage:{
        	html:'pages/content/systemManager/functionManage/functionManage.html',
            js:'pages/content/systemManager/functionManage/functionManage.js'
        },
        resContrManage:{
        	html:'pages/content/systemManager/resContrManage/resContrManage.html',
        	js:'pages/content/systemManager/resContrManage/resContrManage.js'
        },
        dataAuthManage:{
        	html:'pages/content/systemManager/dataAuthManage/dataAuthManage.html',
        	js:'pages/content/systemManager/dataAuthManage/dataAuthManage.js'
        },
        menuConfig:{
        	html:'pages/content/systemManager/menuConfig/menuConfig.html',
            js:'pages/content/systemManager/menuConfig/menuConfig.js'
        },
        dataFilter:{
            html: "pages/content/systemManager/datafilter/dataFilter.html",
            js: "pages/content/systemManager/datafilter/dataFilter.js"
        },
        lookupdict:{
            html: "pages/content/systemManager/lookupdict/lookupdict.html",
            js: "pages/content/systemManager/lookupdict/lookupdict.js"
        },
        sysprop:{
            html: "pages/content/systemManager/sysprop/sysprop.html",
            js: "pages/content/systemManager/sysprop/sysprop.js"
        },
		dptManager:{
            html: "pages/content/systemManager/dptManager/dptManager.html",
            js: "pages/content/systemManager/dptManager/dptManager.js"
        },
        dutyManager:{
            html:'pages/content/systemManager/dutyManager/dutyManager.html',
            js:'pages/content/systemManager/dutyManager/dutyManager.js'
        },
        roleManage: {
            html: "pages/content/systemManager/roleManage/roleManage.html",
            js: "pages/content/systemManager/roleManage/roleManage.js"
        },
        userManger:{
            html:'pages/content/systemManager/userInfoManager/sysUserManager.html',
            js:'pages/content/systemManager/userInfoManager/sysUserManager.js'
        },
        logicSysManager:{
            html:'pages/content/systemManager/logicSysManager/logicSysManager.html',
            js:'pages/content/systemManager/logicSysManager/logicSysManager.js'
        },
        messageManager: {
            html: "pages/content/systemManager/messageManager/messageManager.html",
            js: "pages/content/systemManager/messageManager/messageManager.js"
        },
        userGrantManager:{
            html:'pages/content/systemManager/userGrantOrgManager/userGrantOrgManager.html',
            js:'pages/content/systemManager/userGrantOrgManager/userGrantOrgManager.js'
        },
        passwordManager:{
            html:'pages/content/systemManager/passwordManager/passwordManager.html',
            js:'pages/content/systemManager/passwordManager/passwordManager.js'
        }
    };
    //注册路由表
    yufp.router.addRouteTable(routeTable);
});