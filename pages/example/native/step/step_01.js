/**
 * Created by jiangcheng on 2017/10/30.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {

        //创建virtual model
        var vm =  yufp.custom.vue({
            el: "#step_01",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data:{
                m_btn_test:{width:"90px"},
                m_btn_next:{width:"90px",marginLeft:"20px"},
                text_value:"",
                checkbox_value:[]
            },

            methods:{
                //测试
                test:function(){
                    //获取业务数据
                    var reqData=yufp.custom.getData(vm);
                    yufp.layer.alert(JSON.stringify(reqData));
                },
                next:function(){
                    //获取业务数据
                    var reqData=yufp.custom.getData(vm);
                    //页面跳转 参数列表为(id，data，rootId)，id:页面为唯一标志，在route table中注册;
                    //data:父亲页面要传递到子页面的数据；rootId：目标页面要嵌入的div的id
                    yufp.router.to("step_02",reqData);
                }

            }

        });
        yufp.logger.info("step_01页面加载完成");
    };

    //消息处理
    exports.onmessage = function (type, message) {


    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }

});