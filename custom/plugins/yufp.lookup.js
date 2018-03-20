/**
 * 公共数据字典管理器
 * 依赖：custom/plugins/yufp.service.js
 * created by helin3 2017-12-04
 */
(function (yufp, window, factory) {
    var exports = factory(yufp, window, window.document);
    if (typeof define === 'function') {
        define(exports);
    }
    window.yufp.lookup = exports;
}(yufp, window, function (yufp, window, document) {

    /**
     * 统一数据字典管理器
     * @constructor
     */
    function Lookup() {
        var _options = {
            lookupMgr: {},      //内存字典对象
            remoteUrl: backend.adminService+'/api/adminsmlookupitem/weblist', //远程URL
            remoteParamName: 'lookupCodes', //远程参数名
            codeKey: 'key',     //对应后台字段key
            codeValue: 'value', //对应后台字段value
            limit: false,       //是否开启字典长度超过limitlength长度转存
            limitLength: 100,   //字典长度超过100，直接存储于localstorage
            prefix: 'YUFP-LIMIT-TYPE-', //超长字典前缀
            //loadingQueue: {},      //加载中队列，暂且未考虑
            localPath: [           //本地字典路径
                './custom/common/app.data.lookup.js'
            ]
        };
        yufp.extend(this, _options);
        this.loadLocal();
    }

    /**
     * private
     * 加载所有本地字典
     * @param callback 回调方法(可选参数)
     */
    Lookup.prototype.loadLocal = function (callback) {
        var me = this, pathArr = me.localPath;
        yufp.require.require(pathArr, function () {
            for (var i=0, len=pathArr.length;i<len;i++){
                var local = yufp.require.use(pathArr[i]);
                yufp.extend(me.lookupMgr, local.localLookup);
            }
            if (yufp.type(callback) === 'function'){
                callback.call(me);
            }
        });
    }

    /**
     * private
     * 加载指定远程数据字典
     * @param types  String
     *    GENDER_TYPE
     *    GENDER_TYPE,USER_STATUS,SYSTEM_STATUS
     */
    Lookup.prototype.loadRemote = function (types, callback) {
        var me = this;
        //TODO 暂且未考虑字典请求中队列
        me.forceLoad(types, function (data) {
            var typeArr = types.split(",");
            for (var i=0,len = typeArr.length;i<len;i++){
                var type = typeArr[i];
                if (!me.limit) {
                    me.lookupMgr[type] = data[type] || [];
                } else {
                    if(data[type].length < me.limitLength){
                        me.lookupMgr[type] = data[type];
                    } else {
                        me.storagePut(me.prefix + type, data[type]);
                    }
                }
            }
        });
    }

    /**
     * private
     * 强制刷新远程字典
     * @param types
     * @param callback
     */
    Lookup.prototype.forceLoad = function (types, callback) {
        var me = this;
        var param = {};
        param[me.remoteParamName] = types;
        yufp.service.request({
            url: me.remoteUrl,
            method: 'get',
            data: param,
            callback: function (code, msg, response) {
                if (code == 0 && response && yufp.type(callback) == 'function'){
                    callback.call(this, response.data);
                }
            }
        });
    }

    Lookup.prototype.queueHas = function (type) {
        return this.loadingQueue[type] ? true : false;
    }

    Lookup.prototype.queuePush = function (type) {
        this.loadingQueue[type] = true;
    }

    Lookup.prototype.queuePop = function (type) {
        delete this.loadingQueue[type];
        return type;
    }

    Lookup.prototype.storagePut = function (type, array) {
        yufp.sessionStorage.put(this.prefix + type, JSON.stringify(array));
    }

    Lookup.prototype.storageGet = function (type) {
        var me = this;
        var lookup = yufp.sessionStorage.get(this.prefix + type);
        if (lookup) {
            lookup = JSON.parse(lookup);
        } else {
            lookup = undefined;
        }
        return lookup;
    }

    /**
     * 字段转换方法
     * @param type 字典类型
     * @param sourceVal 要转换的值
     * @param source 源字段
     * @param target 目标字段
     * @returns {*}
     */
    Lookup.prototype.convert = function (type, sourceVal, source, target) {
        var me = this, targetVal = sourceVal;
        var lookup = me.lookupMgr[type] || me.storageGet[type];
        if (!lookup) {
            yufp.logger.warn('【' + type + "】字典未加载！");
            return targetVal;
        }
        for (var i=0,len=lookup.length;i<len;i++) {
            var item = lookup[i];
            if (item[source] === sourceVal) {
                targetVal = item[target];
                break;
            }
        }
        return targetVal;
    }

    /**
     * 将字典注册到字典管理器中
     * @param types string,必须
     *    示例：GENDER_TYPE
     *      或：GENDER_TYPE,USER_STATUS,SYSTEM_STATUS
     * @param callback function,可选
     */
    Lookup.prototype.reg = function (types, callback) {
        var me = this;
        var allArr = types.split(","), needArr = [];
        for (var i=0,len=allArr.length;i<len;i++) {
            var type = allArr[i];
            if (!me.lookupMgr[type] && !me.storageGet[type]){
                needArr.push(type);
            }
        }
        if (needArr.length > 0) {
            me.loadRemote.call(this, needArr.join(','), callback);
        }
    }

    /**
     * 将数据字典绑定到对象上
     * @param type 字典类型
     * @param callback 回调方法参数即是字典数组对象
     */
    Lookup.prototype.bind = function (type, callback) {
        var me = this;
        if (yufp.type(callback) != 'function') {
            yufp.logger.warn('【' + type + "】字典bind方法参数错误");
        }
        var lookup = this.lookupMgr[type] || me.storageGet[type];
        if (lookup) {
            callback.call(this, lookup);
        } else {
            me.forceLoad(type, function (data) {
                me.lookupMgr[type] = lookup = data[type];
                callback.call(this, lookup);
            });
        }
    }

    /**
     * 根据字典类别查找
     * @param type 要查找的字典类型
     * @param isArray 是否返回数组（可选参数）, true: 是，false: 否； 默认true
     */
    Lookup.prototype.find = function (type, isArray) {
        var me = this;
        isArray = isArray === false ? false : true;
        var lookup = this.lookupMgr[type] || me.storageGet[type];
        if (!isArray) {
            lookup = !lookup ? {} : me.array2Map(lookup);
        }
        return lookup;
    }

    /**
     * 数组转Map
     * @param lookup
     * @returns {Map}
     */
    Lookup.prototype.array2Map = function (lookup) {
        var me = this;
        lookup = lookup ? lookup.reduce(function(acc, cur){
            acc[cur[me.codeKey]] = cur[me.codeValue]
            return acc
        }, {}) : {};
        return lookup;
    }

    /**
     * 字典码转换为字典值
     * @param type 字典类型
     * @param key 字典码
     * @returns {*} 字典值
     */
    Lookup.prototype.convertKey = function (type, key) {
        return this.convert(type, key, this.codeKey, this.codeValue);
    }

    /**
     * 字典值转换为字典码
     * @param type 字典类型
     * @param value 字典值
     * @returns {*} 字典码
     */
    Lookup.prototype.convertValue = function (type, value) {
        return this.convert(type, value, this.codeValue, this.codeKey);
    }

    /**
     * 批量字典码转换为字典值
     * @param type 字典类型
     * @param keys 字典码，多个用逗号分隔
     * @param sep 分隔符（可选参数），默认","
     * @returns {*}
     */
    Lookup.prototype.convertMultiKey = function (type, keys, sep) {
        var me = this;
        var lookup = me.lookupMgr[type] || me.storageGet[type];
        if (!lookup) {
            yufp.logger.warn('【' + type + "】字典未加载！");
            return targetVal;
        }
        var sep = !sep ? ',' : sep;
        var keyArr = keys.split(sep), values = [];
        for (var k=0,kLen=keyArr.length;k<kLen;k++) {
            values.push(me.convertKey(type, keyArr[k]));
        }
        return values.join(sep);
    }

    /**
     * 批量字典值转换为字典码
     * @param type 字典类型
     * @param values 字典值，多个用逗号分隔
     * @param sep 分隔符（可选参数），默认","
     * @returns {*}
     */
    Lookup.prototype.convertMultiValue = function (type, values, sep) {
        var me = this;
        var lookup = me.lookupMgr[type] || me.storageGet[type];
        if (!lookup) {
            yufp.logger.warn('【' + type + "】字典未加载！");
            return targetVal;
        }
        var sep = !sep ? ',' : sep;
        var keyArr = values.split(sep), keys = [];
        for (var k=0,kLen=keyArr.length;k<kLen;k++) {
            keys.push(me.convertValue(type, keyArr[k]));
        }
        return keys.join(sep);
    }

    return new Lookup();
}));
