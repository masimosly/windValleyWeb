/**
 * @created by helin3 2017-11-30
 * @updated by
 * @description 会话信息
 * 依赖：custom/plugins/yufp.service.js
 *      custom/plugins/yufp.sessionstorage.js
 */
(function (yufp, window, factory) {
    var exports = factory(yufp, window, window.document);
    if (typeof define === 'function') {
        define(exports);
    }
    window.yufp.session = exports;
}(yufp, window, function (yufp, window, document) {

    /**
     * 会话信息对象
     * @constructor
     */
    function LocalSession() {
        var _settings = {
            settings: {
                logoutUrl: backend.uaaService + '/api/logout',     //注销URL
                userUrl: backend.uaaService + '/api/session/info',   //会话URL
                userJsonRoot: '',                   //用户返回数据节点,如：'data.user'
                userStoreKey: 'YUFP-SESSION-USER',  //会话存储前缀
                userMapping: {                      //用户后端数据模型映射
                    userId: 'userId',               //用户ID
                    userName: 'userName',           //用户姓名
                    userCode: 'loginCode',          //用户登录码
                    userAvatar: 'userAvatar',       //用户头像
                    logicSys: 'logicSys',           //逻辑系统Object
                    roles: 'roles',                 //角色数组Object
                    org: 'org',                     //机构Object
                    dpt: 'dpt',                     //部门Object
                    instu: 'instu',                 //金融机构Object
                    upOrg: 'upOrg',                 //上级机构Object
                    upDpt: 'upDpt'                  //上级部门Object
                },

                menuUrl: backend.uaaService+'/api/account/menuandcontr', //菜单远程URL
                menuRootPid: '0',                     //菜单根节点父级Id
                menuJsonRoot: 'menus',                //菜单返回数据节点,如：'data.menus'
                menuStoreOgKey: 'YUFP-SESSION-MENUS-OG',
                menuStoreKey: 'YUFP-SESSION-MENUS',   //菜单存储前缀
                menuMapping: {                        //菜单后端数据模型映射
                    mId: 'menuId',                    //菜单ID
                    mText: 'menuName',                //菜单名称
                    mPid: 'upMenuId',                 //上级菜单ID
                    mIcon: 'menuIcon',                //菜单图标
                    routeId: 'funcId',                //菜单功能ID
                    routeUrl: 'funcUrl'               //菜单功能URL
                },

                ctrlUrl: backend.uaaService+'/api/session/menuandcontr', //控制点远程URL
                ctrlJsonRoot: 'contr',                //控制点返回数据节点,如：'data.ctrls'，控制点数据，查询需按菜单ID、功能ID排序返回
                ctrlStoreOgKey: 'YUFP-SESSION-STRLS-OG',
                ctrlStoreKey: 'YUFP-SESSION-STRLS',
                ctrlMapping: {
                    mId: 'menuId',         //菜单ID
                    rId: 'funcId',         //菜单功能ID
                    cId: 'contrCode',       //控制点CODE
                    cText: 'contrName'      //控制点名称
                }

            }
        };
        yufp.extend(this, _settings);
    };

    /**
     * private 存储数据
     * @param key
     * @param array
     */
    var storagePut = function (key, array) {
        yufp.sessionStorage.put(key, JSON.stringify(array));
    };

    /**
     * private 获取数据
     * @param key
     */
    var storageGet = function (key) {
        var me = this;
        var obj = yufp.sessionStorage.get(key);
        if (obj) {
            obj = JSON.parse(obj);
        } else {
            obj = undefined;
        }
        return obj;
    };

    /**
     * private 移除数据
     * @param key
     */
    var storageRemove = function (key) {
        yufp.sessionStorage.remove(key);
    }

    /**
     * private 获取namespace数据
     * @param obj 待获取对象
     * @param ns namespace，如：'json.data'
     * @returns {*}
     */
    var getObjectKey = function (obj, ns) {
        if (!ns) {
            return obj;
        }
        var keys = ns.split('.');
        for (var i = 0, len = keys.length; i < len; i++) {
            if (!obj) {
                break;
            }
            obj = obj[keys[i]];
        }
        return obj;
    };

    /**
     * 加载会话用户数据
     * @param callback
     */
    LocalSession.prototype.loadUserSession = function (callback) {
        var processFn = function (data) {
            var _this = this, userMapping= _this.settings.userMapping;
            for (var key in userMapping) {
                _this[key] = data[userMapping[key]] || '';
            }
            _this.user = data;
            storagePut(_this.settings.userStoreKey, _this.user);
        };
        var _this = this;
        var userStore = storageGet(_this.settings.userStoreKey);
        var menuStoreOg = storageGet(_this.settings.menuStoreOgKey);
        var ctrlStoreOg = storageGet(_this.settings.ctrlStoreOgKey);
        if (userStore && menuStoreOg) {
            processFn.call(_this, userStore);
            _this.processMenus(menuStoreOg);
            _this.processCtrls(ctrlStoreOg);
            typeof callback === 'function' ? callback.call(_this) : '';
            return;
        }
        yufp.service.request({
            url: _this.settings.userUrl,
            method: 'get',
            callback: function (code, message, data) {
                var data = getObjectKey(data, _this.settings.userJsonRoot);
                if (code == '0' && data) {
                    processFn.call(_this, data);
                }
                _this.loadMenus(callback);
                //_this.loadCtrls(); //由于控制点数据和菜单一起加载则无需要单独加载
            }
        });
    };

    /**
     * 移除会话信息
     */
    LocalSession.prototype.logout = function () {
        var settings = this.settings;
        yufp.service.request({
            url: settings.logoutUrl,
            method: 'get',
            callback: function (code, message, response) {
                /*if (code != 0 || (response && response.code != 0)) {
                    var errMsg = response && response.message ? response.message : '系统错误，请联系系统管理员！';
                    var vm = yufp.custom.vue({});
                    vm.$message({ message: errMsg, type: 'warning' });
                }*/
            }
        });
        yufp.service.removeToken();
        yufp.router.to("login");
        storageRemove(settings.userStoreKey);
        storageRemove(settings.menuStoreOgKey);
        storageRemove(settings.menuStoreKey);
        storageRemove(settings.ctrlStoreOgKey);
        storageRemove(settings.ctrlStoreKey);
    };

    /**
     * 当前会话页
     */
    LocalSession.prototype.getCurrentRoute = function () {
        return yufp.service.getToken() ? 'frame' : ''
    };

    /**
     * 加载菜单数据
     */
    LocalSession.prototype.loadMenus = function (callback) {
        var _this = this;
        yufp.service.request({
            url: _this.settings.menuUrl,
            method: 'get',
            callback: function (code, message, data) {
            	//alert(JSON.stringify(data));
                var menuData = getObjectKey(data, _this.settings.menuJsonRoot);
                if (code == '0' && menuData) {
                    _this.processMenus(menuData);
                    var ctrlData = getObjectKey(data, _this.settings.ctrlJsonRoot);
                    if (ctrlData) {
                        _this.processCtrls(ctrlData);
                    }
                    typeof callback === 'function' ? callback.call(_this) : '';
                }
            }
        });
    };

    /**
     * 加工处理菜单数据
     * @param data
     */
    LocalSession.prototype.processMenus = function (data) {
        var _this = this, mm= _this.settings.menuMapping;
        _this.orginalMenus = JSON.parse(JSON.stringify(data));
        var leafMenus = [], nonLeafMenus = [];
        for (var i=0,len=data.length;i<len;i++) {
            var obj = data[i];
            for (var key in mm) {
                if (mm[key] != key) {
                    obj[key] = obj[mm[key]] || '';
                    delete obj[mm[key]];
                }
            }
            obj.routeId && obj.routeUrl ? leafMenus.push(obj) : nonLeafMenus.push(obj);
        }
        var routeTable = {};
        for (var i=0,len=leafMenus.length;i<len;i++) {
            var obj = leafMenus[i], flag = false;
            routeTable[obj.routeId] = { html: obj.routeUrl + '.html', js: obj.routeUrl + '.js' };
            for(var j=0,jlen=nonLeafMenus.length;j<jlen;j++){
                var pObj = nonLeafMenus[j];
                if ('' + obj.mPid == '' + pObj.mId) {
                    pObj.children = pObj.children ? pObj.children : [];
                    pObj.children.push(obj);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                nonLeafMenus.unshift(obj);
            }
        }
        yufp.router.addRouteTable(routeTable);
        var root = yufp.util.array2tree(nonLeafMenus, {id: 'mId', pid: 'mPid', root: _this.settings.menuRootPid});
        if(root.children && root.children.length>0){
            root.children[0].isIndex = true;
        }
        _this.menus = root.children;
        storagePut(_this.settings.menuStoreOgKey, _this.orginalMenus);
        storagePut(_this.settings.menuStoreKey, _this.menus);
    };

    /**
     * 获取树结构的菜单数据
     * @returns {*}
     */
    LocalSession.prototype.getMenuTree = function () {
        return this.menus || storageGet(this.settings.menuStoreKey);
    };

    /**
     * 获取数组结构的菜单数据
     * @returns {*}
     */
    LocalSession.prototype.getMenus = function () {
        return this.orginalMenus || storageGet(this.settings.menuStoreOgKey);
    };

    /**
     * 根据菜单ID返回菜单对象数据
     * @param menuId
     */
    LocalSession.prototype.getMenuById = function (menuId) {
        var settings = this.settings;
        for (var i = 0, len = this.orginalMenus.length; i < len; i++) {
            var menu = this.orginalMenus[i];
            if (menu[settings.menuMapping.mId] == menuId) {
                return menu;
            }
        }
    };

    /**
     * 加载控制权限数据
     * 注：若控制权限数据和菜单一起加载，则无需调用此方法
     */
    LocalSession.prototype.loadCtrls = function (callback) {
        var _this = this;
        yufp.service.request({
            url: _this.settings.ctrlUrl,
            method: 'get',
            callback: function (code, message, data) {
                var data = getObjectKey(data, _this.settings.ctrlJsonRoot);
                if (code == '0' && data) {
                    _this.processCtrls(data);
                }
                typeof callback === 'function' ? callback.call(_this) : '';
            }
        });
    };

    /**
     * 加载处理控制点权限,后台需要排序
     * @param data
     */
    LocalSession.prototype.processCtrls = function (data) {
        if(!data || data.length<1){
            return;
        }
        var _this = this, mm= _this.settings.ctrlMapping;
        _this.orginalCtrls = JSON.parse(JSON.stringify(data));
        var lastObj = {};
        for (var i=0,len=data.length;i<len;i++) {
            var obj = data[i];
            for (var key in mm) {
                if (mm[key] != key) {
                    obj[key] = obj[mm[key]] || '';
                    delete obj[mm[key]];
                }
            }
            if(lastObj[obj.rId]){
                lastObj[obj.rId][obj.cId]=1;
            }else{
                lastObj[obj.rId]={};
                lastObj[obj.rId][obj.cId]=1;
            }
        }

        _this.ctrls = lastObj;
        storagePut(_this.settings.ctrlStoreOgKey, _this.orginalCtrls);
        storagePut(_this.settings.ctrlStoreKey, _this.ctrls);
    };

    /**
     * 检查是否有控制点权限，有权限返回false，无权限返回true
     * @param ctrlCode 控制点代码
     * @param menuId 菜单ID，可选值，默认取当前页签ID，无需提供
     * @param isView 是否视图菜单，可选值，默认false，配置为true时，若menuId配置为'',则取得menuId强制按视图方式获取
     *               则取得menuId强制按视图方式获取
     */
    LocalSession.prototype.checkCtrl = function (ctrlCode, menuId, isView) {
        var ctrls = this.ctrls;
        menuId = menuId ? menuId : '';
        if (!menuId) {
            //TODO 视图菜单时，获取控制点ID逻辑暂且未定
            menuId = isView ? '' : yufp.frame.tab().url;
        }
        if (!ctrlCode || !ctrls || !menuId){
            return false;
        }
        if(ctrls && menuId && ctrls[menuId] && ctrls[menuId][ctrlCode]){
            return false;
        }

        return true;
    };


    return new LocalSession();
}));
