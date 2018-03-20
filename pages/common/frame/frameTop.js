/**
 * @created by wangyin 2018-01-04
 * @updated by
 * @description 系统主页面-横向菜单模式
 */
define(['./libs/jmenu/jmenu.jquery.js'],function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var isFirstMenu=true;       //一级菜单标记
        var indexRouter=[];       //首页路由
        var isTile=false;        //菜单是否为平铺方式，true：平铺，false：树形

        // 创建菜单-树形
        function createNavMenu(menus){
            var domStr="";
            var firstMenuClass=''
            var firstMenuSign='';
            if(isFirstMenu){
                firstMenuClass='yu-topFirstMenus';
                firstMenuSign='<i></i>';
            }
            for(var i=0;i<menus.length;i++){
                var menu=menus[i];//获取menu
                //判断是否有子菜单
                if(menu.children && menu.children.length>0){
                    domStr+='<li><a  class="'+ firstMenuClass +'" href="javascript:void(0);" title="'+ menu.mText +'">'+ menu.mText +'</a>';
                    var subStr=createNavMenu(menu.children);//创建子菜单
                    domStr+='<ul>'+firstMenuSign;
                    domStr+=subStr;
                    domStr+="</ul></li>";
                }
                else{
                    if(menu.isIndex){
                        var indexDateKey='0';
                        indexRouter.push(menu.routeId,menu.mText,indexDateKey);
                        domStr+='<li><a href="javascript:void(0);" class="yu-topFirstMenus yu-isMenu ck" data-mId="' + menu.mId + '" data-key="'+ indexDateKey +'" data-url="'+ menu.routeId +'" title="'+ menu.mText +'">'+ menu.mText +'</a></li>';
                    }
                    else{
                        domStr+='<li><a href="javascript:void(0);" class="yu-isMenu" data-mId="' + menu.mId + '" data-url="'+ menu.routeId +'" title="'+ menu.mText +'">'+ menu.mText +'</a></li>';
                    }
                 }
                isFirstMenu=false;
            }
            isFirstMenu=true;
            return domStr;
        };

        //创建菜单-平铺
        function createTileMenu(menus) {
            var  create=function (m) {
                var domStr='<ul>';
                for(var i=0;i<m.length;i++){
                    if(m[i].children&&m[i].children.length>0){
                        domStr+='<li><span title="'+ m[i].mText +'">'+ m[i].mText +'<b class=""></b></span>';
                        domStr+=create(m[i].children)+'</li>';
                    }
                    else{
                        domStr+='<li><a class="yu-isMenu" href="javascript:void(0);" data-mId="' + m[i].mId + '" data-url="'+ m[i].routeId +'" title="'+ m[i].mText +'"><i></i>'+ m[i].mText +'</a></li>';
                    }
                }
                domStr+='</ul>';
                return domStr;
            };
            var domStr="";
            for(var i=0;i<menus.length;i++){
                var menu=menus[i];
                if(menu.children&&menu.children.length>0){
                    domStr+='<li><a class="yu-topFirstMenus" href="javascript:void(0);" title="'+ menu.mText +'">'+ menu.mText +'</a>';
                    domStr+='<div class="yu-topTileMenus">';
                    var children=menu.children;
                    for(var j=0;j<children.length;j++){
                        domStr+='<ul>';
                        if(children[j].children&&children[j].children.length>0){
                            domStr+='<li><span title="'+ children[j].mText +'">'+ children[j].mText +'<b class=""></b></span>';
                            domStr+=create(children[j].children)+'</li>';
                        }
                        else{
                            domStr+='<li><a class="yu-isMenu" href="javascript:void(0);" data-mId="' + children[j].mId + '" data-url="'+ children[j].routeId +'" title="'+ children[j].mText +'"><i></i>'+ children[j].mText +'</a></li>';
                        }
                        domStr+='</ul>';
                    }
                    domStr+='</div>';
                }
                else{
                    if(menu.isIndex){
                        var indexDateKey='0';
                        indexRouter.push(menu.routeId,menu.mText,indexDateKey);
                        domStr+='<li><a href="javascript:void(0);" class="yu-topFirstMenus yu-isMenu ck" data-mId="' + menu.mId + '" data-key="'+ indexDateKey +'" data-url="'+ menu.routeId +'" title="'+ menu.mText +'">'+ menu.mText +'</a></li>';
                    }
                    else{
                        domStr+='<li><a href="javascript:void(0);" class="yu-isMenu" data-mId="' + menu.mId + '" data-url="'+ menu.routeId +'" title="'+ menu.mText +'">'+ menu.mText +'</a></li>';
                    }
                }
            }
            return domStr;
        };

        //初始化菜单
        function initMenu(){
            isTile?
                $('#yu-mainMenus').html(createTileMenu(yufp.session.getMenuTree())).jTileMenu():
                $('#yu-mainMenus').html(createNavMenu(yufp.session.getMenuTree())).jNavMenu();//菜单组件调用
            yufp.frame.addTab({id:indexRouter[0],title:indexRouter[1],key:indexRouter[2]});//首页页签初始化
            yufp.frame.menuClick($('a.yu-isMenu')); //菜单事件绑定
        };
        initMenu();
        yufp.frame.init();
    };

    //消息处理
    exports.onmessage = function (type, message) {};

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {};

});