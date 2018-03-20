
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var vm =  yufp.custom.vue({
            el: "#echainstudioDownload",
            data: {

            },
            methods: {
                doDownload:function(){
                    var url = yufp.settings.ssl ? 'https://' : 'http://';
                    url += yufp.settings.url;
                    url += backend.echainService;
                    url += "/api/bench/download/echainstudio";
                    url += "?sessionOrgCode="+yufp.session.org.code+"&sessionLoginCode="+yufp.session.user.loginCode;
                    window.open(yufp.util.addTokenInfo(url));

                }
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