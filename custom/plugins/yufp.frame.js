/**
 * 首页&框架公共管理
 * created by wy 2017-12-04
 */
(function (yufp, window, factory) {
    var exports = factory(yufp, window, window.document);
    if (typeof define === 'function') {
        define(exports);
    }
    window.yufp.frame = exports;
}(yufp, window, function (yufp, window, document) {

    /**
     * 框架管理（页签、公共设置）
     * @constructor
     */
    function Frame() {
        var _options = {
            maxOpenTabs:10,     //页签最大打开数量，默认10,0:不限制
            isMenuRefresh:false,        //重复打开是否刷新，默认false
            tabRefresh:true,       //是否开启页签右键刷新功能，默认true
            tabDoubleClickRefresh:true,       //是否开启页签双击刷新功能，默认true
            tabsTargetId:'yu-idxTabs',      //页签按钮标签ID
            tabBoxTargetId:'yu-idxTabBox',      //页签容器标签ID
            tabDropdownMenuBtId:'yu-idxTabDMenuBt',      //页签下拉菜单按钮id
            tabDropdownMenuWidth:140,       //页签下拉菜单所占空间宽度
            tabButtonOutWidth:34,   //页签按钮内外边距宽
            model:0,    //当前首页模式标记
            models:['frame','frameRight','frameTop'],     //菜单模式
            heightDifference:[35,35,123],      //高度差，frame：35、frameRight：35、frameTop：123
            idxMenuSwiper:null,     //菜单Swiper对象
            sysTools: {
                ownerId: 'yu-sysTools',//所属容器id
                tools: [{
                        show: true,
                        text: '收缩/展开',
                        icon: 'el-icon-yx-menu',
                        className: 'sidebar-toggler',
                        id:'yu-sidebar'
                    },
                    {
                        show: true,
                        text: '切换模式',
                        icon: 'el-icon-yx-switch-1',
                        className: '',
                        id:'yu-switch'
                    },
                    {
                        show: true,
                        text: '设置主题',
                        icon: 'el-icon-yx-themes-1',
                        className: '',
                        id:'yu-themes'
                    },
                    {
                        show: false,
                        text: '常用功能',
                        icon: 'el-icon-yx-star-empty',
                        className: '',
                        id:'yu-common'
                    },
                    {
                        show: true,
                        text: '修改密码',
                        icon: 'el-icon-yx-key2',
                        className: '',
                        id:'yu-modifyPassword'
                    },
                    {
                        show: false,
                        text: '选择语言',
                        icon: 'el-icon-yx-sphere',
                        className: '',
                        id:'yu-language'
                    }]
            },      //系统工具
            modifyPassword: {
                modifyPassword:{
                    html:'pages/content/systemManager/passwordManager/passwordManager.html',
                    js:'pages/content/systemManager/passwordManager/passwordManager.js'
                }
            },      //修改密码-页面路由
            TEMP_loginUser:{
                name:'YUFP',
                role: [
                    { id: 'Administrator', code: 'Administrator', name: 'Administrator'}
                ],
                picUrl: 'themes/default/images/user_default_pic.png'
            },       //用户登录信息，临时
            themes:[
                { id:'default', name:'默认' },
                { id:'orange', name:'橙色' },
                { id:'simple', name:'简约' }
            ],      //UI主题
            language:[
                { id:'zh', name:'中文' },
                { id:'en', name:'English' }
            ]       //语言
        };
        yufp.extend(this, _options);

    };

    /**
     * Frame初始化
     */
    Frame.prototype.init=function () {
        setUserInfo();
        setSysTools();
        checkTabSize();
        $(window).resize(function () {
            checkTabSize();
        });
    };

    /**
     * private
     * 页签size适配(页签面容区域高度)
     */
    var checkTabSize=function () {
        var _this=yufp.frame;
        $('#'+_this.tabBoxTargetId).height(_this.size().height);      //页签内容区域高度
        $('#'+_this.tabBoxTargetId+">div").height(_this.size().height);      //页签内容区域高度
        checkTabs();
    };

    /**
     * private
     * 页签按钮显示适配
     */
    var checkTabs=function () {
        var _this=yufp.frame;
        //获取单个tab按钮宽度
        var _getW=function (o) {
            return o?$(o).width()+_this.tabButtonOutWidth:0;
        };
        //获取当前tab按钮容器宽度
        var _getSW=function () {
            return $('#'+ _this.tabsTargetId +'>div').width();
        };
        //获取tab按钮可显示的最大空间宽度
        var _getMaxW=function () {
            return $('#'+ _this.tabsTargetId).width()-_this.tabDropdownMenuWidth-10;
        };
        //获取显示、隐藏页签按钮
        var _getTab=function (flag) {
            return flag == 'hidden' ?$('#'+ _this.tabsTargetId+'>div>a:hidden') :$('#'+ _this.tabsTargetId+'>div>a:gt(0):not(.ck)').not('a:hidden');
        }
        if(_getSW()>_getMaxW()){
            _getTab().each(function (i,o) {
                $(o).hide();
                if(_getSW()<_getMaxW()){
                    return false
                }
            });
        }
        else{
            _getTab('hidden').each(function (i,o) {
                if((_getSW()+_getW(o))<_getMaxW()){
                    $(o).show();
                }
            });
        }
    };

    /**
     * private
     * 获取菜单模式
     */
    var getModel=function () {
        var _this=yufp.frame;
        if(document.getElementById('frameTop'))
        {
            _this.model=2;
        }
        else if(document.getElementById('frameRight')){
            _this.model=1;
        }
        else {
            _this.model=0;
        }
        return _this.model;
    };

    /**
     * private
     * 系统工具按钮初始化
     */
    var setSysTools=function () {
        var _this=yufp.frame;
        if(_this.sysTools.ownerId){
            var _tools='';
            $(_this.sysTools.tools).each(function (i,o) {
                if(o.show){
                    _tools+='<span id="'+ o.id +'" class="'+o.className+' '+o.icon+'" title="'+ o.text +'"></span>';
                }
            });
            $('#'+_this.sysTools.ownerId).append(_tools);

            //菜单收缩展开
            $('#yu-sidebar').bind('click',function(){
                setTimeout(function(){
                    _this.idxMenuSwiper.resizeFix();//重置菜单容器滚动尺寸
                },50);
            });

            //切换模式
            $('#yu-switch').bind('click',function(){
                yufp.router.to(_this.models[(_this.model+1)>=_this.models.length?0:_this.model+1]);
            });

            //选择语言
            $('#yu-language').bind('click',function(e){
                var el=this;
                var getXY=function (o) {
                    var x = o.offsetLeft;
                    var y = o.offsetTop+o.clientHeight+5;
                    do {
                        o = o.offsetParent;
                        x += o.offsetLeft;
                    } while( o.tagName != "BODY" );
                    return{x:x-25+'px',y:y+'px'};
                };
                var e=event || window.event;
                if($('#yu-languageList').size()>0){
                    $('#yu-languageList').css({left : getXY(el).x,top : getXY(el).y}).fadeToggle();
                }
                else {
                    var domStr='<div id="yu-languageList" class="yu-languageList"><i></i>';
                    for(var i=0;i<_this.language.length;i++){
                        domStr+='<span language="'+ _this.language[i].id +'" title="'+ _this.language[i].name +'">'+ _this.language[i].name +'</span>';
                    }
                    domStr+='</div>';
                    $('body').append(domStr).find('#yu-languageList').css({left : getXY(el).x,top : getXY(el).y}).fadeIn()
                        .bind('mouseleave',function () {
                            $(this).hide();
                        })
                        .find('span').bind('click',function () {
	                        var language=$(this).attr('language');
	                        $('#yu-languageList').hide();
	                        alert(language);
                    });
                }
            });
            //设置主题
            $('#yu-themes').bind('click',function(e){
                var el=this;
                var getXY=function (o) {
                    var x = o.offsetLeft;
                    var y = o.offsetTop+o.clientHeight+5;
                    do {
                        o = o.offsetParent;
                        x += o.offsetLeft;
                    } while( o.tagName != "BODY" );
                    return{x:x-25+'px',y:y+'px'};
                };
                var e=event || window.event;
                if($('#yu-themesList').size()>0){
                    $('#yu-themesList').css({left : getXY(el).x,top : getXY(el).y}).fadeToggle();
                }
                else {
                    var domStr='<div id="yu-themesList" class="yu-themesList"><i></i>';
                    for(var i=0;i<_this.themes.length;i++){
                        domStr+='<span class="'+ _this.themes[i].id +'" themes="'+ _this.themes[i].id +'" title="'+ _this.themes[i].name +'"><i></i>'+ _this.themes[i].name +'</span>';
                    }
                    domStr+='</div>';
                    $('body').append(domStr).find('#yu-themesList').css({left : getXY(el).x,top : getXY(el).y}).fadeIn()
                        .bind('mouseleave',function () {
                            $(this).hide();
                        })
                        .find('span').bind('click',function () {
                        var themes='default';//$(this).attr('themes');
                        $('link[rel=stylesheet]').each(function (i,o) {
                            for(var i=0;i<_this.themes.length;i++){
                                if(o.href.indexOf('themes/'+_this.themes[i].id)>0){
                                    o.href=o.href.replace('themes/'+_this.themes[i].id,'themes/'+themes);
                                    // save themes data
                                    //……………………………………
                                }
                            }
                        });
                        $('#yu-themesList').hide();
                    });
                }
                /*$(document).bind('click',function () {
                    $('#yu-themesList').hide();
                });*/
            });

            //常用功能
            $('#yu-common').bind('click',function(){

            });

            //修改密码
            $('#yu-modifyPassword').bind('click',function(){
                yufp.router.addRouteTable(_this.modifyPassword);
                var options={
                    id:'modifyPassword',
                    title:'修改密码',
                    key:'custom_20180108174856'
                };
                _this.addTab(options);
            });

        }
        // 注销退出
        $('#yu-exit').click(function () {
            _this.exit();
        });
    };

    /**
     * private
     * 用户信息设置
     */
    var setUserInfo=function () {
        var name = yufp.session.userName ? yufp.session.userName : yufp.frame.TEMP_loginUser.name;
        var roles = yufp.session.roles ? yufp.session.roles : yufp.frame.TEMP_loginUser.role;
        var role = [];
        for(var i=0,len=roles.length;i<len;i++) {
            role.push(roles[i].name);
        }
        var pic = yufp.session.userAvatar ? yufp.session.userAvatar : yufp.frame.TEMP_loginUser.picUrl;
        document.getElementById('userName').innerHTML += name;
        document.getElementById('userRole').innerHTML += '('+ role.join(',') +')';
        document.getElementById('userPic').src = pic;
        document.getElementById('userPic').title = name+ '/' +role;
    };

    /**
     * private
     * 页签下拉菜单
     * @param key  页签标识
     * @param title  页签标题
     */
    var tabDropdownMenu=function (key,title) {
        var _this=yufp.frame;
        var _add=function (k,t) {
            var _p=document.createElement('span');
            _p.innerHTML=title;
            _p.title=title;
            _p.setAttribute('data-key',key);
            if(k!=0){
                var _i=document.createElement('i');
                _i.title='关闭';
                _p.appendChild(_i);
                _i.addEventListener('click',function () {
                    $(_p).remove();
                    _this.removeTab(k);
                    _display();
                    return;
                });
            }
            $('#'+ _this.tabDropdownMenuBtId +'>div').append(_p);
            _display();
            _p.addEventListener('click',function () {
                _this.focusTab(k);
            });
        };

        var _init=function () {
            var _a=document.createElement('a');
            _a.id=_this.tabDropdownMenuBtId;
            _a.href='javascript:void(0)';
            var _d=document.createElement('div');
            var _p=document.createElement('span');
            _p.innerHTML='关闭全部';
            _p.title='关闭全部';
            _d.appendChild(_p);
            _a.appendChild(_d);
            $('#'+_this.tabsTargetId).append(_a);
            _p.addEventListener('click',function () {
                _this.removeAllTab();
                $('#'+ _this.tabDropdownMenuBtId +' span:gt(1)').remove();
                _display();
            });
        };

        var _display=function () {
            $('#'+ _this.tabDropdownMenuBtId +'>div>span').size()>2?$('#'+ _this.tabDropdownMenuBtId).show():$('#'+ _this.tabDropdownMenuBtId).hide();
        };

        if($('#'+ _this.tabDropdownMenuBtId).size()<1){
            _init(key,title);
        }

        if($('#'+ _this.tabDropdownMenuBtId +' span[data-key="'+key+'"').size()<1){
            _add(key,title);
        }
    };

    /**
     * private
     * 移除页签下拉菜单子项
     * @param key  页签标识
     */
    var removeTabDropdownMenu=function (key) {
        var _this=yufp.frame;
        $('#'+ _this.tabDropdownMenuBtId +' span[data-key="'+key+'"').remove();
        $('#'+ _this.tabDropdownMenuBtId +' span').size()>2?$('#'+ _this.tabDropdownMenuBtId).show():$('#'+ _this.tabDropdownMenuBtId).hide();
    };

    /**
     * private
     * 页签右键菜单
     * @param key  页签标识
     */
    var tabContextmenu=function (key) {
        var _this=yufp.frame;
        var e=event || window.event;
        //清除默认右键菜单
        document.all ? e.returnValue=false : e.preventDefault();
        //显示右键菜单
        var _show=function () {
            //(key==0||_this.tab(key).index==0)?$('.yu-tabContextmenu a:eq(1)').hide():$('.yu-tabContextmenu a:eq(1)').show();
            key==0?$('.yu-tabContextmenu a:eq(1)').hide():$('.yu-tabContextmenu a:eq(1)').show();
            $('.yu-tabContextmenu').attr('data-key',key).css({left : e.clientX + 'px',top : e.clientY + 'px'}).fadeIn('fast');
        };
        //隐藏右键菜单
        var _hide=function () {
            $('.yu-tabContextmenu').fadeOut('fast');
        };
        //创建菜单
        var _create=function () {
            var contextmenuTab,refreshThisMenu,closeThisMenu,closeOtherMenu,closeAllMenu;
            contextmenuTab = document.createElement('div');
            contextmenuTab.className = 'yu-tabContextmenu';
            closeThisMenu = document.createElement('a');
            closeOtherMenu = document.createElement('a');
            closeAllMenu = document.createElement('a');
            closeThisMenu.innerHTML = "关闭当前";
            closeOtherMenu.innerHTML= "关闭其它";
            closeAllMenu.innerHTML= "关闭全部";
            closeThisMenu.href = "javascript:void(0)";
            closeOtherMenu.href = "javascript:void(0)";
            closeAllMenu.href = "javascript:void(0)";
            if(_this.tabRefresh){
                refreshThisMenu = document.createElement('a');
                refreshThisMenu.innerHTML = "刷新当前";
                refreshThisMenu.href = "javascript:void(0)";
                contextmenuTab.appendChild(refreshThisMenu);
                //刷新当前
                $(refreshThisMenu).bind('click',function () {
                    var _id=$('#'+ _this.tabsTargetId + ' a[data-key="'+$(contextmenuTab).attr('data-key')+'"]').attr('data-url');
                    _this.focusTab($(contextmenuTab).attr('data-key'));
                    _this.refreshTab($(contextmenuTab).attr('data-key'));
                });
            }
            contextmenuTab.appendChild(closeThisMenu);
            contextmenuTab.appendChild(closeOtherMenu);
            contextmenuTab.appendChild(closeAllMenu);
            document.body.appendChild(contextmenuTab);
            $(contextmenuTab).bind('mouseleave',function () {
                _hide();
            });
            $(document).bind('click',function () {
                _hide();
            });
            _show();

            //关闭当前
            $(closeThisMenu).bind('click',function () {
                _this.removeTab($(contextmenuTab).attr('data-key'));
            });
            //关闭其它
            $(closeOtherMenu).bind('click',function () {
                _this.removeOtherTab($(contextmenuTab).attr('data-key'));
            });
            //关闭全部
            $(closeAllMenu).bind('click',function () {
                _this.removeAllTab();
            });
        };
        //如果已经创建菜单，侧仅显示即可
        $('.yu-tabContextmenu').size() > 0 ? _show() :  _create();
    };

    /**
     * 获取工作区域尺寸
     *@returns {width,height}
     */
    Frame.prototype.size=function () {
        getModel();
        return {
            width:window.top.document.body.clientWidth-$('.page-sidebar').width(),
            height:window.top.document.body.clientHeight-this.heightDifference[this.model]
        };
    };

    /**
     * 添加页签
     * @param options {id,title,key,data}
     * @param id  路由id，对应data-url
     * @param title  页签标题，对应菜单标题
     * @param [key]  页签标识，可选
     * @param [data]  参数对象，可选
     *  @return {string} key
     */
    Frame.prototype.addTab=function(options){
        var _this = this;
        var id, title, key, data;
        if (!options || options.id == undefined) {
            return;
        }
        id = options.id;
        title = options.title ? options.title : 'Tab Title';
        key = options.key ? options.key : 'other_' + _this.getTimestamp();
        data = options.data ? options.data : '';
        var tabId = 'tabBox_' + key;
        //该路由页面已打开，则激活
        if ($('#' + tabId).size()>0) {
            _this.focusTab(key);
        } else {
            if($('#'+_this.tabsTargetId+'>div>a').length>=_this.maxOpenTabs&&_this.maxOpenTabs!=0){
                //打开数量超过最大，移除“首页”页签后的第1个页签
                _this.removeTab($('#'+_this.tabsTargetId+'>div>a:eq(1)').attr('data-key'));
            }
            var _c=key==0?'':'<i title="关闭"></i>';
            var _a='<a class="ck" href="javascript:void(0);" title="' + title + '" data-url="'+ id +'"  data-key="'+ key +'">' + title + _c + '</a>';
            $('#'+ _this.tabsTargetId +'>div').find('a[class=ck]').removeClass('ck').end().append(_a).find('a[data-key="'+key+'"]')
                .bind('click',function () {
                    _this.focusTab($(this).attr('data-key'));
                })
                .bind('dblclick',function () {
                    _this.tabDoubleClickRefresh?_this.refreshTab($(this).attr('data-key')):'';
                })
                .bind('contextmenu',function () {
                    tabContextmenu($(this).attr('data-key'));
                })
                .find('i').bind('click',function () {
                _this.removeTab($(this).parent().attr('data-key'));
            });
            var _d='<div class="ck" data-key="'+ key +'" id="'+tabId+'" style="height:'+ _this.size().height +'px;overflow:auto;overflow-x: hidden;"></div>';
            $('#'+ _this.tabBoxTargetId).find('div[class=ck]').removeClass('ck').end().append(_d);
            _this.focusMenu(key);
            tabDropdownMenu(key,title);
            yufp.bus.put( "_frame", key, id );//保存路由ID
            yufp.router.to( id, data, tabId );//路由跳转
            checkTabs();
        }
        return key;
    };

    /**
     * 激活页签
     * @param key  页签标识
     */
    Frame.prototype.focusTab=function(key){
        var _this=this;
        $('#'+ _this.tabsTargetId + '>div>a[data-key="'+key+'"]').show().addClass('ck').siblings().removeClass('ck');
        $('#'+ _this.tabBoxTargetId + '>div[data-key="'+key+'"]').addClass('ck').siblings().removeClass('ck');
        _this.focusMenu(key);
        //重复打开菜单刷新当前router
        if(_this.isMenuRefresh){
            _this.refreshTab(key);
        }
        checkTabs();
    };

    /**
     * 刷新页签
     * @param key  页签标识
     * @param id  或路由id
     */
    Frame.prototype.refreshTab=function (key) {
        var _this=this;
        var key=key?key:_this.tab().key;
        yufp.router.to( _this.tab(key).url, {}, _this.tab(key).boxId );
    }

    /**
     * 移除页签
     * @param [key]  页签标识,可选，无key时关闭当前页签
     */
    Frame.prototype.removeTab=function(key){
        var _this=this;
        key=key?key:$('#'+ _this.tabsTargetId + '>div>a[class=ck]').attr('data-key');
        //var id=yufp.bus.get("_frame",key);
        //var rootId="root_"+id;
        yufp.router.unMount(_this.tab(key).boxId);

        var $a=$('#'+ _this.tabsTargetId + '>div>a[data-key="'+key+'"]');
        if($a.hasClass('ck')){
            //如果是关闭当前，则激活前一个页签
            $a.prev().click();
        }
        $a.remove();
        $('#'+ _this.tabBoxTargetId + '>div[data-key="'+key+'"]').remove();
        $('a.yu-isMenu[data-key="'+key+'"]').attr('data-key','');
        removeTabDropdownMenu(key);
        checkTabs();
    };

    /**
     * 移除全部页签
     */
    Frame.prototype.removeAllTab=function() {
        var _this=this;
        var $a=$('#'+ _this.tabsTargetId + '>div>a:not(:first)');
        $a.each(function (i,o) {
            _this.removeTab($(o).attr('data-key'));
        });
    };

    /**
     * 移除其它页签
     * @param key  页签标识
     */
    Frame.prototype.removeOtherTab=function(key) {
        var _this=this;
        var $a=$('#'+ _this.tabsTargetId + '>div>a:not(:first)');
        $a.each(function (i,o) {
            if($(o).attr('data-key')!=key){
                _this.removeTab($(o).attr('data-key'));
            }
        });
    };

    /**
     * 获取页签参数
     * @param key  页签标识，无key时，返回当前tab
     * @returns {key,url(router id),title}
     */
    Frame.prototype.tab=function (key) {
        var _this=this;
        var key=key?key:$('#'+ _this.tabsTargetId + '>div>a[class=ck]').attr('data-key');
        return {
            key:key,    //页签标识，默认为当前页签
            boxId:$('#'+ _this.tabBoxTargetId + '>div[data-key='+ key +']').attr('id'),
            url:$('#'+ _this.tabsTargetId + '>div>a[data-key='+ key +']').attr('data-url'),      //页签url(或路由id)
            title:$('#'+ _this.tabsTargetId + '>div>a[data-key='+ key +']').attr('title'),      //页签标题
            index:$('#'+ _this.tabsTargetId + '>div>a[data-key='+ key +']').index() //页签索引
        };
    };

    /**
     * 菜单激活，高亮
     * @param key  页签标识
     */
    Frame.prototype.focusMenu=function(key){
        var _this=this;
        if(_this.model==2){
            $('.yu-topFirstMenus').removeClass('ck');
            $('a.yu-isMenu[data-key="'+$('#'+ _this.tabsTargetId +'>div>a[class*=ck]').first().attr('data-key')+'"]').parents().children('.yu-topFirstMenus').addClass('ck');
        }
        else {
            $('.page-sidebar-menu li').removeClass('active').removeClass('open');
            $('a.yu-isMenu[data-key="'+$('#'+ _this.tabsTargetId +'>div>a[class*=ck]').first().attr('data-key')+'"]').parents('li').addClass('active').addClass('open');
        }
    };

    /**
     * 菜单单击事件
     * @param menusObj  菜单结点对象
     * @param callback  回调function
     */
    Frame.prototype.menuClick=function (menusObj,callback) {
        var _this = this;
        $(menusObj).bind('click', function () {
            //如果已经打开则激活
            var cMenu = $(this), dataKey = cMenu.attr('data-key');
            if (dataKey) {
                _this.focusTab(dataKey);
                _this.focusMenu(dataKey);
            } else {
                // var key = 'menu_'+_this.getTimestamp();//菜单、页签、页签容器对应标识
                dataKey = 'menu_' + cMenu.attr('data-mId');
                cMenu.attr('data-key', dataKey);
                var options = {
                    id: cMenu.attr('data-url'),
                    title: cMenu.text(),
                    path: cMenu.attr('data-path'),
                    key: dataKey
                };
                var log = {
                    "userId": yufp.session.userId,
                    "orgId": yufp.session.org.code,
                    "menuId": options.key,
                    "operFlag": '访问',
                    "logTypeId": '7',
                    "beforeValue": '',
                    "afterValue": '',
                    "content": '访问菜单:' + options.title + '路径:' + options.path,
                };
                yufp.util.logInfo(log , backend.adminService + '/api/log/addlog');
                _this.addTab(options);
            }
            if (callback && yufp.type(callback) == 'function') {
                callback.call(this);
            }
        });
    };

    /**
     * 获取时间戳标识
     *  @return {string}
     */
    Frame.prototype.getTimestamp=function(){
        return (new Date()).valueOf();
    };

    /**
     * 注销登录
     * @param key  页签标识
     */
    Frame.prototype.exit=function(){
        yufp.session.logout();
    };

    return new Frame();
}));