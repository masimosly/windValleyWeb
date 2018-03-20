/**
 * @created by wy 2018-01-10
 * @updated by
 * @description navMenu、tileMenu plugin
 */
/** navMenu **/
(function($) {
    $.navMenu = {
        defaults: {
            width: 140,         //菜单宽度
            absoluteTop: 48,        //子菜单顶部浮动距离
            absoluteLeft: 0,        //子菜单左侧浮动距离
            openClick: false,       //单击显示子菜单，默认false，鼠标移入显示
            TimeBeforeOpening: 100,     //子菜单展开延时
            TimeBeforeClosing: 100,     //子菜单关闭延时
            effects: {
                effectSpeedOpen: 150,       //子菜单展开动画过度时间
                effectSpeedClose: 150,      //子菜单关闭动画过度时间
                effectTypeOpen: 'slide',        //子菜单展开动画默认方式，支持slide、fade，默认show
                effectTypeClose: 'slide',       //子菜单关闭动画默认方式，支持slide、fade
                effectOpen: 'swing',        //子菜单展开动画切换效果,支持：swing、linear
                effectClose: 'swing'        //子菜单关闭动画切换效果,支持：swing、linear
            }
        },
        init: function(el,opts) {
            var  $this=$(el);
            var  width=0;
            if(opts.width == 'auto'){
                width = $('.firstLevel').outerWidth(false);
            }
            else{
                width = opts.width;
            }
            $this.find("li").each(function() {
                var $thisChild = $(this).find('a:first');
                var $allUl = $(this).find('ul');
                if($.navMenu.isParent($thisChild))
                {
                    $thisChild.addClass('isParent');
                    var $ul = $thisChild.next();
                    var $position = $thisChild.position();
                    if($(this).hasClass('firstLevelLi')){
                        $ul.css({top:   $position.top + opts.absoluteTop,left:  $position.left + opts.absoluteLeft,width : width});
                    }
                    else{
                        $ul.css({top:   $position.top,left:  $position.left + width,width : width});
                    }
                    if(!opts.openClick){
                        $(this).bind({
                            mouseenter:function() {$.navMenu.show($ul,opts);},
                            mouseleave:function(){$.navMenu.hide($ul,opts);}
                        });
                    }
                    else{
                        $(this).bind({
                            click:function(e) {e.preventDefault();$.navMenu.show($ul,opts);},
                            mouseleave:function(){$.navMenu.hide($ul,opts);}
                        });
                    }
                }
            });
            $this.find('a:not(.isParent)').each(function() {
                $(this).bind('click',function() {$this.find('ul').hide();});
            });
        },
        show: function(el,opts) {
            if(!$(el).prev('a').hasClass('firstLevel')){
                var $p=$(el).prev('a').position();
                var w=$(el).width();
                var h=$(el).height();
                if($(el).prev('a').offset().left+w*2>$(window).width()){
                    $(el).css({
                        left: $p.left - w
                    });
                }
                if($(el).prev('a').offset().top + h - $(window).height() > 0) {
                    if($(el).height() > $(window).height()) {
                        $(el).height($(window).height() - 40).css({
                            'overflow-y': 'auto',
                            top: -($(el).prev('a').offset().top - 20)
                        });
                    } else {
                        if($(el).css('overflow-y')=='visible') {
                            $(el).css({
                                top: -($(el).prev('a').offset().top + h - $(window).height())
                            });
                        }
                    }
                }
            }
            switch(opts.effects.effectTypeOpen) {
                case 'slide':
                    el.stop(true, true).delay(opts.TimeBeforeOpening).slideDown(opts.effects.effectSpeedOpen, opts.effects.effectOpen);
                    break;
                case 'fade':
                    el.stop(true, true).delay(opts.TimeBeforeOpening).fadeIn(opts.effects.effectSpeedOpen, opts.effects.effectOpen);
                    break;
                default:
                    el.stop(true, true).delay(opts.TimeBeforeOpening).show();
            }
        },
        hide: function(el,opts) {
            switch(opts.effects.effectTypeClose) {
                case 'slide':
                    el.stop(true,true).delay(opts.TimeBeforeClosing).slideUp(opts.effects.effectSpeedClose, opts.effects.effectClose);
                    break;
                case 'fade':
                    el.stop(true,true).delay(opts.TimeBeforeClosing).fadeOut(opts.effects.effectSpeedClose, opts.effects.effectClose);
                    break;
                default:
                    el.delay(opts.TimeBeforeClosing).hide();
            }
        },
        isParent: function(el) {
            return el.next().is('ul') ? true : false;
        }
    };
    jQuery.fn.jNavMenu = function(options){
        var opts = $.extend({}, $.navMenu.defaults, options);
        return this.each(function () {
            $(this).addClass('yu-topNavMenu').children('li').addClass('firstLevelLi').children('a').addClass('firstLevel');
            $.navMenu.init($(this),opts);
        });
    };
})(jQuery);

/** tileMenu **/
(function($) {
    $.tileMenu = {
        defaults: {
            width: 140,     //菜单组列宽度
            column: 4,      //每页展示菜单列数
            openClick: false,       //单击显示子菜单
            openLevel:1     //展开层级，支持n（展开到第n级，0全部展开）
        },
        init: function(el,opts) {
            var $this=$(el);
            if(opts.openLevel==0){
                $this.find('span').addClass('ck');
            }
            $this.children('li').each(function() {
                var $a = $(this).find('a:first');
                if($.tileMenu.isParent($a)){
                    $a.addClass('isParent');
                    var $box = $a.next('div');
                    $box.children('ul').width(opts.width);
                    var groups=$box.children('ul').size();
                    if(groups>opts.column){
                        $box.attr('data-page',0).append('<i class="left no" title="上一页"></i><i class="right" title="下一页"></i>');
                        $box.width(opts.column*opts.width+opts.column).css('padding','10px 15px').attr('data-page',0);
                        $box.children('ul:gt('+(opts.column-1)+')').hide();
                        $box.find('.left').bind('click',function () {
                            var $uls=$(this).siblings('ul');
                            var page=parseInt($(this).parent().attr('data-page'),10);
                            var max=Math.ceil($uls.size()/opts.column)-1;
                            if(page>0){
                                page--;
                                $uls.hide().slice(page*opts.column,(page+1)*opts.column).show();
                                $(this).parent().attr('data-page',page);
                                page==0?$(this).addClass('no').siblings('.right').removeClass('no'):'';
                            }
                        });
                        $box.find('.right').bind('click',function () {
                            var $uls=$(this).siblings('ul');
                            var page=parseInt($(this).parent().attr('data-page'),10);
                            var max=Math.ceil($uls.size()/opts.column)-1;
                            if(page<max){
                                page++;
                                $uls.hide().slice(page*opts.column,(page+1)*opts.column).show();
                                $(this).parent().attr('data-page',page);
                                page==max?$(this).addClass('no').siblings('.left').removeClass('no'):'';
                            }
                        });
                    }
                    else{
                        $box.width(groups*opts.width+groups);
                    }
                    if(!opts.openClick){
                        $(this).bind({mouseenter:function() {$.tileMenu.show($box);},mouseleave:function(){$.tileMenu.hide($box);}});
                    }
                    else{
                        $(this).bind({click:function(e) {e.preventDefault();$.tileMenu.show($box);},mouseleave:function(){$.tileMenu.hide($box);}});
                    }
                }
                if(opts.openLevel>0) {
                    var s = 'div>';
                    for (var i = 0; i < opts.openLevel; i++) {
                        s += 'ul>li>'
                        $(this).find(s + 'span').addClass('ck');
                    }
                }
            });
            $this.find('span').each(function() {
                var $_this = $(this);
                if($.tileMenu.isParent($_this)){
                    $_this.addClass('isParent');
                    $_this.bind('click',function(e) {e.preventDefault();$_this.toggleClass('ck');});
                }
            });
            $this.find('a:not(.firstLevel)').each(function() {
                $(this).bind('click',function() {$(this).parents('.yu-topTileMenus').fadeOut('fast');});
            });
        },
        show: function(el) {
            var w=$(el).width();
            if($(el).prev('a').offset().left+w>$(window).width()){
                $(el).css('left', -($(el).prev('a').offset().left+w+30-$(window).width()));
            }
            else {
                $(el).css('left',0);
            }
            el.fadeIn('fast');
        },
        hide: function(el) {
            el.hide();
        },
        isParent: function(el) {
           return (el.next().is('div')||el.next().is('ul')) ? true : false;
        }
    };
    jQuery.fn.jTileMenu = function(options){
        var opts = $.extend({}, $.tileMenu.defaults, options);
        return this.each(function () {
            $(this).addClass('yu-topTileMenu').children('li').children('a').addClass('firstLevel');
            $.tileMenu.init($(this),opts);
        });
    };
})(jQuery);