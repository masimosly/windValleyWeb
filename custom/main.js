/**
 * Created by jiangcheng on 2016/08/09.
 */
(function (window, yufp) {

    //yufp配置
    yufp.config({
        //path配置
        paths: {
            'plugins': './custom/plugins'
        },
        // 别名配置
        alias: {
            'config': './custom/config.js',
            'vue': './libs/vue/vue-2.3.4.js',
            'jquery': './libs/jquery/jquery-1.8.0.js',
            'echarts': './libs/echarts/echarts.min.js'
        },
        // 文件编码
        charset: 'UTF-8',
        //版本号
        version:"1.0.2"

    });

    //css依赖库
    var libs_css = [
        "./libs/element-ui/index.css",
        "./libs/swiper/idangerous.swiper.css",
        "./themes/common/icoFonts/icoFonts.css",
        "./themes/common/tree-menu.css",
        "./themes/default/main.css",
        "./custom/widgets/css/bus.css"
        //---------------------自定义css----------------------
    ];

    //js依赖库
    var libs_js = [
        //-------------------base start -------------------//
        "config",
        "vue",
        "jquery",
        "./libs/element-ui/index.js",
        "./libs/swiper/idangerous.swiper.min.js",
        "./libs/js-xlsx/xlsx.full.min.js",

        //---------------yufp插件 start---------------------//
        "./custom/common/app.data.service.js",
        "./custom/plugins/yufp.settings.js",
        "./custom/plugins/yufp.localstorage.js",
        "./custom/plugins/yufp.sessionstorage.js",
        "./custom/plugins/yufp.service.js",
        "./custom/plugins/yufp.validator.js",
        "./custom/plugins/yufp.util.js",

        "./custom/plugins/yufp.lookup.js",
        "./custom/plugins/yufp.session.js",
        "./custom/plugins/yufp.frame.js",

        //------------------自定义组件 js-------------------//
        "./libs/yufp/widgets/js/widgets.js",
        "./libs/yufp/widgets/js/form/ElFormInput.js",
        "./libs/yufp/widgets/js/form/ElFormTimeSelect.js",
        "./libs/yufp/widgets/js/form/ElFormTimePicker.js",
        "./libs/yufp/widgets/js/form/ElFormDatePicker.js",
        "./libs/yufp/widgets/js/form/ElFormX.js",
        "./libs/yufp/widgets/js/form/ElFormQ.js",
        //------------------自定义app js-------------------//
        "./custom/common/app.js"
    ];

    //路由表
    var route_tables = [
        "./custom/route-tables/route.common.js"
    ];

    //合并lib
    var libs = libs_css.concat(libs_js, route_tables);
    yufp.require.use(libs).done(function () {
        //yufp别名
        window.fx = window.yufp;
        fx.$=$;

        //导入配置
        var config = yufp.require.require("config");

        //设置配置
        yufp.settings.config(config);

        //mock加载
        if(config.debugModel){
            yufp.require.require('./mocks/index.js');
        }

        //加入请求过滤器
        yufp.service.addFilter({

            //过滤器名称
            name: "messageParser",

            //请求前触发
            before: function (event) {
                //定义请求头
                var headers = {
                };
                //定义请求数据
                var reqData = {
                    //请求头
                    headers: headers,
                    //请求数据
                    data: event.data
                };
                //保存导出数据
                event.code = 0;
                event.data = reqData;
                //返回处理标志，true则继续处理，false则中断处理
                return true;
            },

            //数据返回后触发
            after: function (event) {

                //只处理JSON对象
                if (yufp.type(event.data) == "object" && yufp.type(event.data.header)!="undefined") {
                    //获取响应头
                    var rspHeader = event.data.header;
                    //获取响应数据
                    var rspData = event.data.data;

                    if (yufp.type(rspHeader.code) == "undefined" || rspHeader.code == 0) {
                        //保存导出数据
                        event.code = 0;
                        event.message = "";
                        event.data = rspData;
                        //返回处理标志，true则继续处理，false则中断处理
                        return true;
                    } else {
                        //保存导出数据
                        event.code = rspHeader.code;
                        event.message = rspHeader.msg;
                        event.data = rspData;
                        //返回处理标志，true则继续处理，false则中断处理
                        return true;
                    }
                }

                //返回处理标志，true则继续处理，false则中断处理
                return true;
            },
            // HTTP请求异常
            exception: function (event) {
                var status = event.xhr.status;
                var flag = true;
                var me = yufp.custom.vue({});
                switch (status) {
                    case 401:
                        yufp.session.logout();
                        flag = false;
                        break;
                    case 403:
                        me.$message({
                            message: '您无权限访问，请联系系统管理员!',
                            type: 'warning'
                        });
                        flag = false;
                        break;
                    case 404:
                        me.$message({
                            message: '系统错误，请联系系统管理员!',
                            type: 'error'
                        });
                        flag = false;
                        break;
                    default:
                        me.$message({
                            message: '系统错误，请联系系统管理员!',
                            type: 'error'
                        });
                        flag = false;
                        break;
                }
                return flag;
            }
        });

        //设置默认root id
        yufp.router.setDefaultRootId(config.defaultRootId);
        //加入路由过滤器
        yufp.router.addFilter({

            /**
             * 过滤器名称
             */
            name: "default",

            /**
             * 路由跳转前执行
             * @param code
             * @param cite
             */
            before:function(code, cite){
                if (config.debugModel) {
                    var route = yufp.router.getRoute(code) || {};
                    yufp.logger.info('【Router-JS】【' + code + '】: ' + route.js);
                }
                return true;
            },

            /**
             * 加载路由内容前执行
             * @param code
             * @param cite
             */
            mount:function(code,cite){

            },

            /**
             * ready函数执行
             * @param exports
             * @param code
             * @param data
             * @param cite
             */
            ready: function (exports, code, data, cite) {
            },

            /**
             * 卸载路由内容前执行
             * @param code
             * @param cite
             */
            unMount:function(code,cite){

            },

            /**
             * destroy函数执行
             * @param exports
             * @param code
             * @param cite
             */
            destroy: function (exports, code, cite) {

            }

        });

        /**
         * 创建hash处理事件
         */
        var hashFn = function () {
            var route = config.startPage, data = {}, hash = location.hash;
            var currRoute = yufp.session.getCurrentRoute();
            route = currRoute ? currRoute : route;
            var sIndex = hash.indexOf("!"), eIndex = hash.indexOf("?");
            if (sIndex != -1) {
                route = eIndex != -1 ? hash.substring(sIndex + 1, eIndex) : hash.slice(sIndex + 1);
                if (eIndex != -1 && hash.slice(eIndex + 1)) {
                    data = JSON.parse('{"'
                        + decodeURIComponent(search)
                            .replace(/"/g, '\\"')
                            .replace(/&/g, '","')
                            .replace(/=/g, '":"')
                            .replace(/\n/g, '\\n')
                        + '"}');
                }
            }
            yufp.logger.info("触发hash事件,hash:" + hash);
            //调试模式true时，有mocks请求，故延迟加载
            if (route == config.startPage) {
                yufp.router.to(route, data);
            } else {
                var delay = config.debugModel ? 300 : 0;
                setTimeout(function () {
                    yufp.session.loadUserSession(function () {
                        yufp.router.to(route, data);
                    });
                }, delay);
            }
        };
        //添加hash change事件
        if (window.addEventListener) {
            window.addEventListener("hashchange", hashFn, false);
        } else if (window.attachEvent) {
            window.attachEvent("on" + "hashchange", hashFn);
        } else {
            window["onhashchange"] = hashFn;
        }
        //页面跳转
        hashFn();
    })

}(window, yufp));