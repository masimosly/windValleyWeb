/**
 * Created by jiangcheng on 2017/10/30.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {

        //创建virtual model
        var vm =  yufp.custom.vue({
            $id: "step_02",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            m_title_cls:"my-title-span",
            m_subStep:"",
            m_btn_radios:[
                {
                    text:"点击这里切换到页面step_03",
                    value:"step_03"
                },
                {
                    text:"点击这里切换到页面step_04",
                    value:"step_04"
                }
            ],

            //路由跳转
            to:function(id){
                //页面跳转 参数列表为(id，data，rootId)，id:页面为唯一标志，在route table中注册;
                //data:父亲页面要传递到子页面的数据；rootId：目标页面要嵌入的div的id
                yufp.router.to(id,{},"_stepDiv")
            }
        });
        //保存vm引用
        yufp.bus.put("step","step_02","vm",vm);
        //打印日志
        yufp.logger.info("step_02页面加载完成");
    };

    //消息处理
    exports.onmessage = function (type, message) {

        if(type==="msg"){
            var vm=yufp.bus.get("step","step_02","vm");
            vm.m_subStep=message;
        }

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {
        //移除ste_02下面所有数据
        yufp.bus.remove("step","step_02");
        //打印日志
        yufp.logger.info("step_02页面销毁");
    }

});