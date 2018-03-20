/**
 * Created by jiangcheng on 2017/10/30.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {

        //创建virtual model
        var vm =  yufp.custom.avalon({
            $id: "step_03",

            test:function(){
                yufp.layer.alert("请移步http://www.bootcss.com/");
            }

        });
        //发送消息 参数列表为(id，type，message)，id:目标页面的router id
        //type:消息类型,和目标页面协商好久就可以了；message：消息内容
        yufp.router.sendMessage("step_02","msg","step_03");
        yufp.logger.info("step_03页面加载完成");
    };

    //消息处理
    exports.onmessage = function (type, message) {


    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {
        yufp.logger.info("step_03页面销毁");
    }

});