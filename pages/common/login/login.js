/**
 * @created by jiangcheng 2017-11-15
 * @updated by
 * @description 登录页
 */
define(function (require, exports) {
    /**
     * 页面加载完成时触发
     * @param hashCode 路由ID
     * @param data 传递数据对象
     * @param cite 页面站点信息
     */
    exports.ready = function (hashCode, data, cite) {
		/*yufp.service.request({
            needToken: false,
            url: backend.adminService+'/api/adminsmlogicsys/logicsyskv',
            method: 'get',
            callback: function (code, message, response) {
                var logicSysList = response.data;

                if (typeof(logicSysList) !== "undefined" && logicSysList !== null) {
                    var opt = '';
                    for (var i = 0; i < logicSysList.length; i++)
                    {
                        opt += "<li title='"+logicSysList[i].value+"' key='"+logicSysList[i].key +"'>"+logicSysList[i].value+"</li>";
                    }
                    $('#yu-sys').text(logicSysList[0].value);
                    $('#yu-sys').attr('key',logicSysList[0].key);
                    $("#yu-sysList").html(opt);
                }
                else {
                    $('#msg').text('逻辑系统加载异常！请联系系统管理员').show();
                }
            }
        });*/
        var loginFn = function () {
            if($('#username').val()==''){
                $('#msg').text('请输入用户名!').show();
                $('#username').focus();
                return;
            }
            if($('#password').val()==''){
                $('#msg').text('请输入密码!').show();
                $('#password').focus();
                return;
            }
            $('#msg').hide();

            var data = {
                username: $('#username').val(),
                password: $('#password').val(),
                grant_type: "password",
                sysId: $('#yu-sys').attr('key')
            };
            var headers = {
                //"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": "Basic d2ViX2FwcDo="
            };
            yufp.service.request({
                needToken: false,
                url: backend.uaaService+'/login',
                method: 'post',
                headers: headers,
                data: data,
                callback: function (code, message, response) {
                	//
                	var userinfo = response.result;
                    if (response.status=="0") {
                        var data = response.jwt;
                        alert(data);
                        yufp.service.putToken(data);
                        yufp.session.loadUserSession(function () {
                        	
                            yufp.router.to("frame");
                        });
                    } else {
                        var msg = response && response.message ? response.message : '登录失败，请联系系统管理员！';
                        $('#msg').text(msg).show();
                    }
                }
            });
        }
        $("#submitBtn").click(function(){
            loginFn();
        });

        $('#yu-sys').bind('mouseover',function () {
            $('#yu-sys').addClass('ck')
            $('#yu-sysList').fadeIn('fast');
        });
        $(document).bind('click',function () {
            $('#yu-sys').removeClass('ck')
            $('#yu-sysList').fadeOut('fast');
        });
        $('#yu-sysList>li').live('click',function () {
            $('#yu-sys').text($(this).text()).attr('key',$(this).attr('key'));
        });
    };
});