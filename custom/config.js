/**
 * Created by 江成 on 2016/08/09.
 */

define(function(require,exports,module){

    //设置配置
    var config={
        //请求URL
  //      url:"192.168.251.151:8080",
        url: "127.0.0.1:8080",
        //是否启用SSL
        ssl:false,
        //web socket 通信方式
        webSocketType: "get",
        //默认root id
        defaultRootId: "_rootDiv",
        //开始页面
        startPage: "login",
        //录制模式
        recorderModel: false,
        //录制范围
        recorderScope: ['yufp.service'],
        //调试模式
        debugModel: true,
        //调试范围
        debugScope: ['yufp.service']
    };
    //保存配置
    module.exports=config;

});