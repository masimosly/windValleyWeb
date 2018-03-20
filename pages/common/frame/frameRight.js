/**
 * @created by wangyin 2018-01-04
 * @updated by
 * @description 系统主页面-右侧竖向菜单模式
 */
define(["./pages/common/frame/tree-menu.js"],function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var treeMenu=yufp.require.require("./pages/common/frame/tree-menu.js");//获取tree-menu
        var indexRouter=[];       //首页路由
        // 创建菜单
        function createMenu(menus){
            var domStr="";
            for(var i=0;i<menus.length;i++){
                var menu=menus[i];//获取menu
                var defaultIcon = 'el-icon-yx-file-text2';
                //判断是否有子菜单
                if(menu.children && menu.children.length>0){
                    domStr+='<li><a href="javascript:void(0);"><i class='+ (menu.mIcon? menu.mIcon:defaultIcon) +'></i><span class="title">' +menu.mText +'</span><span class="arrow"></span></a>';
                    var subStr=createMenu(menu.children);//创建子菜单
                    domStr+='<ul class="sub-menu">';
                    domStr+=subStr;
                    domStr+='</ul></li>';
                }
                else{
                    if(menu.isIndex){
                        var indexDateKey='0';
                        indexRouter.push(menu.routeId,menu.mText,indexDateKey);
                        domStr+='<li class="active"><a href="javascript:void(0);" class="yu-isMenu" data-mId="' + menu.mId + '" data-url="'+menu.routeId+'" data-key="'+indexDateKey+'"><i class="'+(menu.mIcon? menu.mIcon:defaultIcon)+'"></i><span class="title">'+menu.mText+'</span></a></li>';
                    }
                    else{
                        domStr+='<li><a href="javascript:void(0);" class="yu-isMenu" data-mId="' + menu.mId + '" data-url="'+menu.routeId+'"><i class="'+(menu.mIcon? menu.mIcon:defaultIcon)+'"></i><span>'+menu.mText+'</span></a></li>';
                    }
                }
            }
            return domStr;
        };

        //初始化菜单
        function initMenu(){
            $("#_my_menu").html(createMenu(yufp.session.getMenuTree()));
            //菜单swiper相关调用
            $('.yu-idxMenuSwiper').height($('.yu-idxBody').height());
            $(window).resize(function(){
                $('.yu-idxMenuSwiper').height($('.yu-idxBody').height());
            });
            yufp.frame.idxMenuSwiper = $('.yu-idxMenuSwiper').swiper({
                mode: 'vertical',
                simulateTouch:false,
                slidesPerView : 'auto',
                spaceBetween: 0,
                mousewheelControl: true,
                scrollContainer:true,
                resizeReInit: true,
                scrollbar: {
                    container :'.yu-idxMenuScrollbar',
                    draggable: true
                }
            });
            treeMenu.init(yufp.frame.idxMenuSwiper);//菜单组件调用
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