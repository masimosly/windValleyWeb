/*这里本项目得工具类方法放置的地方*/

define(function(require,exports){
    //记录exports
    yufp.custom=exports;

    /**
     * vue扩展定义方法
     * @param args
     * @returns {*}
     */
    exports.vue=function(args){
       return new Vue(args);
    };

    /**
     * 获取有效数据
     * @param data
     */
    exports.getData=function(data){

        var resData={};

        for(var key in data){

            //以m_开头的数据为page中的元数据、以$开头的数据为virtual model的保留数据
            if(key.indexOf("m_") === 0 || key.indexOf("$") === 0){
                continue;
            }
            //获取value
            var val=data[key];
            //忽略function
            if(typeof val === "function"){
                continue;
            }
            resData[key]=data[key];
        }
        return resData;
    }

    /**
     * 设置数据
     * @param srcData
     * @param targetData
     */
    exports.setData=function(srcData,targetData){
        for(var key in srcData){
            targetData[key]=srcData[key];
        }
        return targetData;
    }

    /**
     * 获取可见区域
     * @returns {{width: number, height: number}}
     */
    exports.viewSize = function viewSize() {
        return yufp.frame.size();
    }


})
