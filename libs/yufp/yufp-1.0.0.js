/**
 * Created by jiangcheng on 2016/08/05.
 */
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 创建xml http request
         * @returns {any}
         */
        function createXHR() {
            var xhr;
            try {
                xhr = new XMLHttpRequest()
            } catch (e) {
                var IEXHRVers = ["Msxml3.XMLHTTP", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
                for (var i = 0, len = IEXHRVers.length; i < len; i++) {
                    try {
                        xhr = new ActiveXObject(IEXHRVers[i]);
                    } catch (e) {
                        continue;
                    }
                }
            }
            return xhr;
        }

        /**
         * 编码数据
         * @param data
         * @param contentType
         */
        function encode(data, contentType) {
            if (!data || typeof data === 'string' || !contentType) {
                return data;
            }
            var res = "",ct = "application/x-www-form-urlencoded";
            if (contentType.indexOf(ct) > -1) {
                //对象转换为form提交格式
                if (core.Utils.type(data) == "object") {
                    for (var name_1 in data) {
                        var value = data[name_1];
                        //获取value数据类型
                        var valType = core.Utils.type(value);
                        if (valType == "array") {
                            for (var i = 0; i < value.length; i++) {
                                var item = name_1 + "=" + value[i];
                                if (res.length > 0) {
                                    res += "&";
                                }
                                res += item;
                            }
                        } else {
                            var item = name_1 + "=" + value;
                            if (res.length > 0) {
                                res += "&";
                            }
                            res += item;
                        }
                    }
                } else {
                    res = data;
                }
            } else if (contentType.indexOf("application/json") >-1 || contentType.indexOf("text") == 0) {
                //对象转换为text
                if (core.Utils.type(data) == "object") {
                    res = JSON.stringify(data);
                }
            } else {
                if (core.Utils.type(data) == "object") {
                    res = JSON.stringify(data);
                } else {
                    res = data;
                }
            }
            return res;
        }
        /**
         * 解码数据
         * @param data
         * @param dataType
         */
        function decode(data, dataType) {
            if (dataType == "json") {
                if(core.Utils.type(data) == "string" && data != "") {
                    data = JSON.parse(data);
                }
            }
            return data;
        }
        /**
         * 默认配置
         * @type {{type: string, async: boolean, contentType: string, dataType: string, cache: boolean, timeout: number, processData: boolean}}
         */
        var defaultSetting = {
            //请求类型
            type: "GET",
            //是否异步
            async: true,
            //内容类型
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            //数据类型
            dataType: "string",
            //是否缓存
            cache: false,
            //超时时间
            timeout: 30000,
            //是否处理数据
            processData: true
        };
        /**
         * ajax请求
         * @param args
         * @returns {*}
         */
        function ajax(args) {
            //创建XML Http Request
            var xmlHttpRequest = createXHR();
            // 若创建成功，则开始解析目标XML文件
            if (xmlHttpRequest == null || !xmlHttpRequest) {
                core.logger.error("not support XmlHttpRequest");
                return;
            }
            //设置默认配置
            var setting = {};
            core.Utils.extend(true, setting, defaultSetting);
            core.Utils.extend(true, setting, args);
            args = setting;
            //只有异步请求才能设置超时控制
            if (args.async) {
                //防止IE导致的问题
                try {
                    xmlHttpRequest.timeout = args.timeout;
                    xmlHttpRequest.ontimeout = function () {
                        //超时处理
                        args["error"]("timeout");
                    };
                } catch (ex) {
                    //打印异常
                    core.logger.error('IE-AJAX:' + ex.Message, ex);
                }
            }
            // 指定ready state change事件句柄对应的函数
            xmlHttpRequest.onreadystatechange = function () {
                //loading处理
                if (xmlHttpRequest.readyState < 4) {
                    if (args["loading"]) {
                        args["loading"](xmlHttpRequest.readyState);
                    }
                    return;
                }
                if (args["success"] && (xmlHttpRequest.status == 0 || xmlHttpRequest.status >= 200 && xmlHttpRequest.status < 300)) {
                    var rspData = xmlHttpRequest.response;
                    if (rspData == undefined) {
                        rspData = xmlHttpRequest.responseText;
                    }
                    if (xmlHttpRequest.status === 0 && rspData){
                        //失败回调
                        if (args["error"]) {
                            args["error"](xmlHttpRequest, "网络请求异常");
                        }
                        return;
                    } else {
                        try {
                            //解码数据
                            rspData = decode(rspData, args.dataType);
                        } catch (ex) {
                            //失败回调
                            if (args["error"]) {
                                args["error"](xmlHttpRequest, ex.message);
                            }
                            return;
                        }
                    }
                    //成功回调
                    args["success"](rspData, xmlHttpRequest.status, xmlHttpRequest);
                }
                else if (args["error"]) {
                    args["error"](xmlHttpRequest, xmlHttpRequest.status);
                }
            };

            var reqData = null;
            var method = args.type.toUpperCase();
            try {
                if (args.data && args.processData && typeof args.data !== "string" ) {
                    reqData = encode(args.data, method == "GET" ? "application/x-www-form-urlencoded" : args.headers["Content-Type"]);
                } else {
                    reqData = args.data;
                }
            } catch (ex) {
                core.logger.error("ajax：请求参数格式化错误；" + ex.Message, ex);
            }
            // 初始化HTTP请求参数
            args.url += method == "GET" && reqData ?((args.url.indexOf('?') === -1 ? '?' : '&') + reqData)  : '';

            xmlHttpRequest.open(args.type, args.url, args.async);
            //设置请求头
            //xmlHttpRequest.setRequestHeader("Content-type", contentType + "; charset=" + charset);
            //设置缓存策略
            if (!args.cache) {
                xmlHttpRequest.setRequestHeader("Cache-Control", "no-cache");
            }
            if (typeof args.headers === 'object'){
                for (var key in args.headers) {
                    xmlHttpRequest.setRequestHeader(key, args.headers[key]);
                }
            }
            try {
                //发送数据
                xmlHttpRequest.send(method != "GET" && reqData ? reqData : null);
            } catch (ex) {
                if (args["error"]) {
                    args["error"](xmlHttpRequest, ex.message);
                }
            }
            return xmlHttpRequest;
        }
        core.ajax = ajax;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by 江成 on 2016/08/05.
 */
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 导出logger
         * @type {yufp.Logger}
         */
        core.logger = !window.console ? new Logger() : window.console;
        /**
         * Logger
         */
        var Logger = (function () {
            function Logger() {
            }
            /**
             * warn
             * @param message
             * @param ex
             */
            Logger.prototype.warn = function (message, ex) {
                return this;
            };
            /**
             * error
             * @param message
             * @param ex
             */
            Logger.prototype.error = function (message, ex) {
                return this;
            };
            /**
             * info
             * @param message
             * @returns {yufp.core.Logger}
             */
            Logger.prototype.info = function (message) {
                return this;
            };
            /**
             * debug
             * @param message
             * @returns {yufp.core.Logger}
             */
            Logger.prototype.debug = function (message) {
                return this;
            };
            return Logger;
        }());
        core.Logger = Logger;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2016/10/31.
 */
///<reference path="Logger.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 树节点
         * @param id
         * @param data
         * @constructor
         */
        var TreeNode = (function () {
            /**
             * 构造函数
             * @param id
             */
            function TreeNode(id) {
                /**
                 * children
                 * @type {{}}
                 */
                this.children = {};
                this.id = id;
            }
            return TreeNode;
        }());
        /**
         * 数据bus
         */
        var Bus = (function () {
            /**
             * 构造函数
             */
            function Bus() {
                //创建root节点
                this.root = new TreeNode("_root_");
            }
            /**
             * 加入数据
             * @param args
             * @returns {boolean}
             */
            Bus.prototype.put = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                //获取参数长度
                var argLen = args.length;
                //参数至少必须有一个key和value
                if (argLen < 2) {
                    core.logger.error("参数至少包括一个(key,value)");
                    return false;
                }
                //当前节点
                var node = this.root;
                for (var i = 0; i < argLen - 1; i++) {
                    var name_2 = args[i];
                    if (!node.children[name_2]) {
                        node.children[name_2] = new TreeNode(name_2);
                    }
                    node = node.children[name_2];
                }
                //保存数据
                node.data = arguments[argLen - 1];
                //返回操作成功标志
                return true;
            };
            /**
             * 获取内容
             * @param args
             * @returns {any}
             */
            Bus.prototype.get = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                //获取参数长度
                var argLen = args.length;
                if (argLen == 0) {
                    return undefined;
                }
                //当前节点
                var node = this.root;
                for (var i = 0; i < argLen; i++) {
                    var name_3 = args[i];
                    if (node.children[name_3]) {
                        node = node.children[name_3];
                    }
                    else {
                        return undefined;
                    }
                }
                return node.data;
            };
            /**
             * 移除数据
             * @param args
             * @returns {any}
             */
            Bus.prototype.remove = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                //获取参数长度
                var argLen = args.length;
                if (argLen == 0) {
                    return false;
                }
                //当前节点
                var node = this.root;
                for (var i = 0; i < argLen - 1; i++) {
                    var name_4 = args[i];
                    if (node.children[name_4]) {
                        node = node.children[name_4];
                    }
                    else {
                        return false;
                    }
                }
                var name = args[argLen - 1];
                //如果找到对应的数据,则删除
                if (node.children[name]) {
                    delete node.children[name];
                    return true;
                }
                return false;
            };
            return Bus;
        }());
        core.Bus = Bus;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by 江成 on 2016/08/05.
 */
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 工具类
         */
        var Utils = (function () {
            function Utils() {
            }
            /**
             * 判断类型
             * @param obj
             * @returns {any}
             */
            Utils.type = function (obj) {
                var toString = Object.prototype.toString;
                var t = toString.call(obj);
                return obj == null ? String(obj) : this.class2type[t] || "object";
            };
            /**
             * 判断是否为函数
             * @param obj
             * @returns {boolean}
             */
            Utils.isFunction = function (obj) {
                return Utils.type(obj) === "function";
            };
            /**
             * 判断是否为数组
             * @type {(function(any): boolean)|(function(any): boolean)}
             */
            Utils.isArray = function (obj) {
                return Utils.type(obj) === "array";
            };
            /**
             * 创建数组
             * @param arr
             * @param results
             * @returns {Array<any>|Array}
             */
            Utils.makeArray = function (arr, results) {
                var ret = results || [];
                if (arr != null) {
                    if (Utils.isArrayLike(Object(arr))) {
                        Utils.merge(ret, typeof arr === "string" ?
                            [arr] : arr);
                    }
                    else {
                        ret.push(arr);
                    }
                }
                return ret;
            };
            /**
             * 合并数组
             * @param first
             * @param second
             * @returns {Array<any>}
             */
            Utils.merge = function (first, second) {
                var len = +second.length, j = 0, i = first.length;
                for (; j < len; j++) {
                    first[i++] = second[j];
                }
                first.length = i;
                return first;
            };
            /**
             * 判断是否为window对象
             * @param obj
             * @returns {any|boolean}
             */
            Utils.isWindow = function (obj) {
                return obj && typeof obj === "object" && "setInterval" in obj;
            };
            /**
             * 是否为普通对象
             * @param obj
             * @returns {any}
             */
            Utils.isPlainObject = function (obj) {
                if (!obj || Utils.type(obj) !== "object" || obj.nodeType || Utils.isWindow(obj)) {
                    return false;
                }
                var hasOwn = Object.prototype.hasOwnProperty;
                if (obj.constructor && !hasOwn.call(obj, "constructor")
                    && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
                var key;
                for (key in obj) {
                }
                return key === undefined || hasOwn.call(obj, key);
            };
            /**
             * 继承（是否深度拷贝,dest,src1,src2,src3...）
             * @returns {any|{}}
             */
            Utils.extend = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var target = args[0] || {}, i = 1, length = args.length, deep = false;
                // Handle a deep copy situation
                if (typeof target === "boolean") {
                    deep = target;
                    // Skip the boolean and the target
                    target = args[i] || {};
                    i++;
                }
                // Handle case when target is a string or something (possible in deep copy)
                if (typeof target !== "object" && !Utils.isFunction(target)) {
                    target = {};
                }
                // Extend itself if only one argument is passed
                if (i === length) {
                    target = this;
                    i--;
                }
                for (; i < length; i++) {
                    // Only deal with non-null/undefined values
                    if (args[i] != null && args[i] != undefined) {
                        var options = args[i];
                        // Extend the base object
                        for (var name_5 in options) {
                            var src = target[name_5];
                            var copy = options[name_5];
                            // Prevent never-ending loop
                            if (target === copy) {
                                continue;
                            }
                            // Recurse if we're merging plain objects or arrays
                            var copyIsArray = false;
                            if (deep && copy && (Utils.isPlainObject(copy) || (copyIsArray = Utils.isArray(copy)))) {
                                var clone = void 0;
                                if (copyIsArray) {
                                    clone = src && Utils.isArray(src) ? src : [];
                                }
                                else {
                                    clone = src && Utils.isPlainObject(src) ? src : {};
                                }
                                // Never move original objects, clone them
                                target[name_5] = Utils.extend(deep, clone, copy);
                                // Don't bring in undefined values
                            }
                            else if (copy !== undefined) {
                                target[name_5] = copy;
                            }
                        }
                    }
                }
                // Return the modified object
                return target;
            };
            /**
             * 克隆
             * @param source
             * @param target
             * @returns {any}
             */
            Utils.clone = function (src, dest) {
                dest = Utils.extend(true, dest, src);
                return dest;
            };
            /**
             * 是否数组
             * @param obj
             * @returns {boolean}
             */
            Utils.isArrayLike = function (obj) {
                var length = !!obj && "length" in obj && obj.length, type = Utils.type(obj);
                if (type === "function" || Utils.isWindow(obj)) {
                    return false;
                }
                return type === "array" || length === 0 ||
                    typeof length === "number" && length > 0 && (length - 1) in obj;
            };
            /**
             * 循环访问
             * @param target
             * @param callback
             * @param hasOwnProperty
             * @returns {any}
             */
            Utils.each = function (target, callback, hasOwnProperty) {
                if (Utils.isArrayLike(target)) {
                    var length_1 = target.length;
                    for (var i = 0; i < length_1; i++) {
                        if (callback.call(target[i], i, target[i]) === false) {
                            break;
                        }
                    }
                }
                else {
                    for (var key in target) {
                        if (hasOwnProperty) {
                            if (target.hasOwnProperty(key)) {
                                if (callback.call(target[key], key, target[key]) === false) {
                                    break;
                                }
                            }
                        }
                        else {
                            if (callback.call(target[key], key, target[key]) === false) {
                                break;
                            }
                        }
                    }
                }
                return target;
            };
            //获dom对象的innerText的取值
            Utils.getInnerText = function (element) {
                //判断浏览器是否支持innerText
                if (typeof element.innerText === "string") {
                    return element.innerText;
                }
                else {
                    return element.textContent;
                }
            };
            //设置dom对象innerText的值
            Utils.setInnerText = function (element, content) {
                if (typeof element.innerText === "string") {
                    element.innerText = content;
                }
                else {
                    element.textContent = content;
                }
            };
            /**
             * 获取下一个element node
              * @param node
             * @returns {any}
             */
            //兼容浏览器   获取下一个兄弟元素
            Utils.getNextElementSibling = function (element) {
                if (element.nextElementSibling) {
                    return element.nextElementSibling;
                }
                else {
                    //获取下一个兄弟节点
                    var node = element.nextSibling;
                    return node;
                }
            };
            //兼容浏览器 获取第一个子元素
            Utils.getFirstElementChild = function (element) {
                if (element.firstElementChild) {
                    return element.firstElementChild;
                }
                else {
                    //获取下一个节点
                    var node = element.firstChild;
                    return node;
                }
            };
            return Utils;
        }());
        /**
         * 类型映射表
         */
        Utils.class2type = {
            '[object Boolean]': 'boolean',
            '[object Number]': 'number',
            '[object String]': 'string',
            '[object Function]': 'function',
            '[object Array]': 'array',
            '[object Date]': 'date',
            '[object RegExp]': 'regExp',
            '[object Object]': 'object'
        };
        core.Utils = Utils;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2016/08/05.
 */
///<reference path="Utils.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 状态
         */
        var Status;
        (function (Status) {
            Status[Status["Running"] = 0] = "Running";
            Status[Status["Done"] = 1] = "Done";
            Status[Status["Fail"] = 2] = "Fail";
        })(Status || (Status = {}));
        /**
         * Deffered类
         */
        var Deferred = (function () {
            /**
             * 构造函数
             */
            function Deferred() {
                /**
                 * 成功函数
                 */
                this.doneFns = [];
                /**
                 * 失败函数
                 */
                this.failFns = [];
                /**
                 * always函数
                 */
                this.alwaysFns = [];
                //运行状态
                this.status = Status.Running;
            }
            /**
             * fire
             */
            Deferred.prototype.fire = function () {
                if (this.status == Status.Running) {
                    return;
                }
                if (this.alwaysFns) {
                    while (this.alwaysFns.length > 0) {
                        var fn = this.alwaysFns.shift();
                        fn.apply(this, this.args);
                    }
                }
                if (this.status == Status.Done) {
                    while (this.doneFns.length > 0) {
                        var fn = this.doneFns.shift();
                        fn.apply(this, this.args);
                    }
                }
                else if (this.status == Status.Fail) {
                    while (this.failFns.length > 0) {
                        var fn = this.failFns.shift();
                        fn.apply(this, this.args);
                    }
                }
            };
            /**
             * 注册成功函数
             * @param fn
             */
            Deferred.prototype.done = function (fn) {
                this.doneFns.push(fn);
                this.fire();
                return this;
            };
            /**
             * 注册失败函数
             * @param fn
             */
            Deferred.prototype.fail = function (fn) {
                this.failFns.push(fn);
                this.fire();
                return this;
            };
            /**
             * 注册always函数
             * @param fn
             */
            Deferred.prototype.always = function (fn) {
                this.alwaysFns.push(fn);
                this.fire();
                return this;
            };
            /**
             * 成功
             * @param params
             */
            Deferred.prototype.resolve = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                this.args = params;
                this.status = Status.Done;
                this.fire();
                return this;
            };
            /**
             * 拒绝
             * @param params
             */
            Deferred.prototype.reject = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                this.args = params;
                this.status = Status.Fail;
                this.fire();
                return this;
            };
            return Deferred;
        }());
        core.Deferred = Deferred;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by 江成 on 2016/10/31.
 */
///<reference path="Utils.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 状态
         */
        var Status = (function () {
            function Status() {
            }
            return Status;
        }());
        /**
         * 繁忙状态
         */
        Status.Busy = "busy";
        /**
         * 空闲状态
         */
        Status.Free = "free";
        /**
         * 任务链路
         */
        var EventChain = (function () {
            /**
             * 构造函数
             */
            function EventChain() {
                /**
                 * 等待函数
                 */
                this.waitFns = [];
                this.chain = [];
                this.status = Status.Free;
            }
            /**
             * 触发链路中的下一个事件
             */
            EventChain.prototype.fire = function () {
                var params = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    params[_i] = arguments[_i];
                }
                //更新参数
                this.args = params;
                //设置状态为空闲
                if (this.chain.length == 0) {
                    //判断是否有等待回调函数
                    while (this.waitFns.length > 0) {
                        var fn = this.waitFns.shift();
                        //触发wait函数
                        fn.apply(this, this.args);
                    }
                    this.status = Status.Free;
                    return;
                }
                //设置状态为繁忙
                this.status = Status.Busy;
                if (this.chain.length > 0) {
                    //获取队列的第一个元素
                    var task = this.chain.shift();
                    //触发下一个任务
                    task.apply(this, this.args);
                }
            };
            /**
             * 结束事件链调用，直接触发wait函数
             */
            EventChain.prototype.reject = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                //设置busy状态
                this.status = Status.Busy;
                //更新参数
                this.args = arguments;
                //清空事件队列
                this.chain = [];
                //判断是否有等待回调函数
                while (this.waitFns.length > 0) {
                    var fn = this.waitFns.shift();
                    //触发wait函数
                    fn.apply(this, this.args);
                }
                //设置空闲状态
                this.status = Status.Free;
            };
            /**
             * 加入任务
             * @param task
             * @returns {yufp.core.TaskChain}
             */
            EventChain.prototype.post = function (task) {
                if (core.Utils.type(task) == "array") {
                    //加入事件队列(数组)
                    this.chain = [].concat(this.chain, task);
                }
                else {
                    //加入事件队列(单元素)
                    this.chain.push(task);
                }
                //如果状态处于busy状态,则不进行处理，直接返回
                if (this.status == Status.Busy) {
                    return this;
                }
                //如果状态处于free状态，则执行任务
                this.fire(this.args);
                return this;
            };
            /**
             * 加入等待任务
             * @param task
             * @returns {yufp.core.EventChain}
             */
            EventChain.prototype.wait = function (task) {
                //保存wait回调函数
                this.waitFns.push(task);
                //如果状态处于busy状态,则不进行处理，直接返回
                if (this.status == Status.Busy) {
                    return this;
                }
                //触发事件链，继续执行
                this.fire(this.args);
                return this;
            };
            /**
             * 判断事件链是否已经执行完成
             * @returns {boolean}
             */
            EventChain.prototype.isFinish = function () {
                if (this.status == Status.Free && this.chain.length == 0) {
                    return true;
                }
                return false;
            };
            return EventChain;
        }());
        core.EventChain = EventChain;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2016/08/18.
 */
///<reference path="Logger.ts"/>
///<reference path="Utils.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 策略
         */
        var Policy;
        (function (Policy) {
            //无限制
            Policy[Policy["limitless"] = 0] = "limitless";
            //只触发一次
            Policy[Policy["once"] = 1] = "once";
        })(Policy || (Policy = {}));
        /**
         * 事件代理
         */
        var EventProxy = (function () {
            /**
             * 构造函数
             */
            function EventProxy() {
                /**
                 * 注册表
                 * @type {{}}
                 */
                this.register = {};
            }
            /**
             * 绑定事件
             *
             * @param key
             * @param callback
             * @returns {yufp.core.EventProxy}
             */
            EventProxy.prototype.bind = function (key, callback, once) {
                //尝试从注册表中获取
                var queue = this.register[key];
                if (!queue) {
                    //创建空队列
                    queue = [];
                    //加入记录
                    this.register[key] = queue;
                }
                var policy = (once == true) ? Policy.once : Policy.limitless;
                var node = {
                    policy: policy,
                    callback: callback
                };
                //加入队列
                queue.push(node);
                return this;
            };
            /**
             * 解除绑定
             * @param key
             */
            EventProxy.prototype.unbind = function (key) {
                //移除
                delete this.register[key];
            };
            /**
             * 绑定一次性触发函数
             * @param key
             * @param callback
             */
            EventProxy.prototype.once = function (key, callback) {
                return this.bind(key, callback, true);
            };
            /**
             * 绑定多条件触发函数
             * @param args
             */
            EventProxy.prototype.all = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var len = args.length;
                if (len < 1) {
                    return;
                }
                //获取callback
                var callback = args[len - 1];
                if (!core.Utils.isFunction(callback)) {
                    core.logger.error("callback can not benn empty");
                    return;
                }
                //记录未触发次数
                var remaining = len - 1;
                //记录已经触发的值
                var values = new Array(remaining);
                //获取条件数组
                var keys = [].splice.call(args, 0, remaining);
                var _loop_1 = function (i) {
                    this_1.once(keys[i], function (value) {
                        values[i] = value;
                        remaining -= 1;
                        //判断是否具备触发条件
                        if (remaining == 0) {
                            callback.apply(_this, values);
                        }
                    });
                };
                var this_1 = this;
                for (var i = 0; i < keys.length; i++) {
                    _loop_1(i);
                }
                return this;
            };
            /**
             * 触发函数
             * @param key
             * @param value
             */
            EventProxy.prototype.trigger = function (key, value) {
                //获取callback记录
                var queue = this.register[key];
                //判断是否找到记录
                if (!queue) {
                    return;
                }
                for (var i = 0; i < queue.length; i++) {
                    //获取记录
                    var node = queue[i];
                    if (node.policy == Policy.once) {
                        queue.slice(i, 1);
                    }
                    if (node.callback) {
                        try {
                            //触发函数
                            node.callback.call(this, value);
                        }
                        catch (ex) {
                            core.logger.error(ex.message, ex);
                        }
                    }
                }
                return this;
            };
            /**
             * 触发函数(别名)
             * @param key
             * @param value
             * @returns {EventProxy}
             */
            EventProxy.prototype.emit = function (key, value) {
                return this.trigger(key, value);
            };
            return EventProxy;
        }());
        core.EventProxy = EventProxy;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2017/4/17.
 */
///<reference path="Utils.ts"/>
///<reference path="Ajax.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 资源
         */
        var Resource = (function () {
            /**
             * 构造函数
             */
            function Resource() {
                //初始化缓存
                this.cache = {};
            }
            /**
             * 获取资源
             * @param url
             * @returns {string}
             */
            Resource.prototype.get = function (url, timeout, callback) {
                //判断缓存中是否存在数据
                if (this.cache[url]) {
                    var data = this.cache[url];
                    callback.call(this, 0, data);
                    return;
                }
                var _this = this;
                //发起ajax请求
                core.ajax({
                    url: url,
                    type: 'GET',
                    cache: false,
                    data: {},
                    timeout: timeout,
                    async: true,
                    success: function (data, status, xhr) {
                        //保存缓存
                        _this.cache[url] = data;
                        callback(0, data);
                    },
                    error: function (xhr, status) {
                        callback(1, status);
                    }
                });
            };
            return Resource;
        }());
        core.Resource = Resource;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2017/4/18.
 */
///<reference path="Utils.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 模块状态
         */
        var ModuleStatus;
        (function (ModuleStatus) {
            /**
             * 加载中
             */
            ModuleStatus[ModuleStatus["Loading"] = 0] = "Loading";
            /**
             * 加载完成
             */
            ModuleStatus[ModuleStatus["Loaded"] = 1] = "Loaded";
            /**
         * 定义中状态
         */
            ModuleStatus[ModuleStatus["Defining"] = 2] = "Defining";
            /**
             * 定义完成状态
             */
            ModuleStatus[ModuleStatus["Defined"] = 3] = "Defined";
        })(ModuleStatus = core.ModuleStatus || (core.ModuleStatus = {}));
        /**
         * 模块
         */
        var Module = (function () {
            function Module() {
            }
            return Module;
        }());
        core.Module = Module;
        /**
         * 模块管理器
         */
        var Modules = (function () {
            /**
             * 构造函数
             */
            function Modules() {
                this.register = {};
            }
            /**
             * 获取模块
             * @param path
             * @returns {any}
             */
            Modules.prototype.get = function (path) {
                return this.register[path];
            };
            /**
             * 加入模块
             * @param path
             * @param module
             */
            Modules.prototype.put = function (path, module) {
                this.register[path] = module;
            };
            /**
             * 移除模块
             * @param path
             * @returns {any}
             */
            Modules.prototype.remove = function (path) {
                var module = this.register[path];
                delete this.register[path];
                return module;
            };
            /**
             * 判断模块是否存在
             * @param path
             */
            Modules.prototype.contains = function (path) {
                if (this.register[path]) {
                    return true;
                }
                return false;
            };
            /**
             * 清空模块
             */
            Modules.prototype.clear = function () {
                this.register = {};
            };
            return Modules;
        }());
        core.Modules = Modules;
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2016/08/06.
 */
///<reference path="Utils.ts"/>
///<reference path="Modules.ts"/>
///<reference path="Ajax.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 状态
         */
        var Status;
        (function (Status) {
            /**
             * 繁忙状态
             */
            Status[Status["Busy"] = 0] = "Busy";
            /**
             * 空闲状态
             */
            Status[Status["Free"] = 1] = "Free";
        })(Status || (Status = {}));
        /**
         * 进程
         */
        var Progress = (function () {
            /**
             * 构造函数
             */
            function Progress(n, fn) {
                this.size = n;
                this.callback = fn;
                this.status = true;
                this.values = new Array(n);
            }
            /**
             * work
             * @param flag
             * @param index
             * @param value
             */
            Progress.prototype.work = function (flag, index, value) {
                this.status = flag;
                if (this.status == true) {
                    //设置工作量完成度
                    this.size--;
                    //保存值
                    this.values[index] = value;
                }
                if (this.size == 0 || this.status == false) {
                    //调用回调函数
                    try {
                        this.callback.call(this, this.status, this.values);
                    }
                    catch (ex) {
                        //打印日志
                        core.logger.error(ex.Message, ex);
                    }
                }
            };
            /**
             * 判断进程是否为正常状态
             * @returns {boolean}
             */
            Progress.prototype.isOK = function () {
                return this.status;
            };
            return Progress;
        }());
        /**
         * 任务节点
         */
        var TaskNode = (function () {
            /**
             * 构造函数
             * @param index
             * @param src
             * @param params
             * @param progress
             */
            function TaskNode(index, src, params, progress) {
                this.index = index;
                this.src = src;
                this.params = params;
                this.progress = progress;
            }
            return TaskNode;
        }());
        /**
         * 检查css是否已经加载
         * @param node
         * @param meta
         */
        function checkCss(node, meta) {
            var sheet = node.sheet;
            var isLoaded;
            // for WebKit < 536
            if (meta.isOldWebKit) {
                if (sheet) {
                    isLoaded = true;
                }
            }
            else if (sheet) {
                try {
                    if (sheet.cssRules) {
                        isLoaded = true;
                    }
                }
                catch (ex) {
                    // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
                    // to "SecurityError" since Fireyufp 13.0. But Fireyufp is less than 9.0
                    // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
                    if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
                        isLoaded = true;
                    }
                }
            }
            setTimeout(function () {
                meta.time += 20;
                if (isLoaded) {
                    meta.success();
                }
                else if (meta.time > meta.timeout) {
                    meta.error();
                }
                else {
                    checkCss(node, meta);
                }
            }, 20);
        }
        /**
         * require
         */
        var Require = (function () {
            /**
             * 构造函数
             */
            function Require() {
                //获取window
                this.win = window;
                //获取document
                this.doc = document;
                //获取head
                this.head = this.doc.head || this.doc.getElementsByTagName("head")[0] || this.doc.documentElement;
                //判断是否为老的webkit浏览器
                this.isOldWebKit = +navigator.userAgent.replace(/.*(?:AppleWebKit|AndroidWebKit)\/(\d+).*/, "$1") < 536;
                //路径简称配置
                this.paths = {};
                //别名配置
                this.alias = {};
                //根路径
                this.base = "";
                //字符编码
                this.charset = "UTF-8";
                //超时
                this.timeout = -1;
                //模块管理器
                this.modules = new core.Modules();
                //资源管理器
                this.resource = new core.Resource();
                //任务队列
                this.queue = [];
                //空闲状态
                this.status = Status.Free;
                //版本
                this.version = "1.0.0";
            }
            /**
             * 配置静态参数，用于初始化
             * @param setting
             * @returns {yufp.core.Require}
             */
            Require.prototype.config = function (setting) {
                if (!setting) {
                    return;
                }
                //设置路径映射
                this.paths = setting.paths ? core.Utils.extend({}, setting.paths) : this.paths;
                //设置别名
                this.alias = setting.alias ? core.Utils.clone({}, setting.alias) : this.alias;
                //设置是base路径
                if (setting.base != undefined) {
                    this.base = setting.base;
                }
                //设置请求编码
                if (setting.charset != undefined) {
                    this.charset = setting.charset;
                }
                //设置版本
                if (setting.version != undefined) {
                    //版本号
                    this.version = setting.version;
                }
                return this;
            };
            /**
             * 配置动态参数
             * @param args
             * @returns {yufp.core.Require}
             */
            Require.prototype.options = function (args) {
                //克隆settings
                this.settings = args ? core.Utils.extend(true, {}, args) : {};
                return this;
            };
            /**
             * 获取资源
             * @param url
             * @param callback
             * @returns {yufp.core.Require}
             */
            Require.prototype.get = function (url, callback) {
                //解析路径
                url = this.resolvePath(url);
                var t = this.timeout;
                if (this.settings && this.settings["timeout"]) {
                    t = this.settings["timeout"];
                }
                this.resource.get(url, t, callback);
                return this;
            };
            /**
             * 加载资源
             * @param args
             */
            Require.prototype.use = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return this.require.apply(this, args);
            };
            /**
             * 加载资源
             * @param args
             */
            Require.prototype.require = function () {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                //定义参数
                var libs = [], callback, len;
                len = args.length;
                if (core.Utils.type(args[args.length - 1]) == "function") {
                    callback = args[args.length - 1];
                    len--;
                }
                //解析路径
                for (var i = 0; i < len; i++) {
                    var t = core.Utils.type(args[i]);
                    if (t == "array") {
                        var list = args[i];
                        for (var j = 0; j < list.length; j++) {
                            if (list[j] == undefined) {
                                continue;
                            }
                            var s = this.resolvePath(list[j]);
                            libs.push(s);
                        }
                    }
                    else {
                        var ss = args[i].split(",");
                        for (var j = 0; j < ss.length; j++) {
                            if (ss[j] == undefined) {
                                continue;
                            }
                            var s = this.resolvePath(ss[j]);
                            libs.push(s);
                        }
                    }
                }
                var deferred = new core.Deferred();
                //判断是否加载完成
                if (libs.length == 1 && this.modules.contains(libs[0])) {
                    //获取模块
                    var module = this.modules.get(libs[0]);
                    //判断模块是否已经给定义
                    if (module.status == core.ModuleStatus.Defined) {
                        //获取exports
                        var exports = module.exports;
                        //添加done和fail函数
                        exports.done = function done(fn) {
                            deferred.done(fn);
                        };
                        exports.fail = function fail(fn) {
                            deferred.fail(fn);
                        };
                        try {
                            //调用回调函数
                            if (callback) {
                                callback.call(this, exports);
                            }
                        }
                        catch (ex) {
                            core.logger.error(ex.Message, ex);
                        }
                        try {
                            //通知加载成功
                            deferred.resolve(module);
                        }
                        catch (ex) {
                            core.logger.error(ex.Message, ex);
                        }
                        //返回结果
                        return exports;
                    }
                }
                //拷贝参数
                var params = {};
                core.Utils.extend(true, params, this.settings);
                //定义进程
                var progress = new Progress(libs.length, function (status, values) {
                    if (progress.isOK()) {
                        try {
                            //调用回调函数
                            if (callback) {
                                callback.apply(_this, values);
                            }
                        }
                        catch (ex) {
                            core.logger.error(ex.Message, ex);
                        }
                        try {
                            //通知加载成功
                            deferred.resolve(values);
                        }
                        catch (ex) {
                            core.logger.error(ex.Message, ex);
                        }
                    }
                    else {
                        try {
                            //调用回调函数
                            if (callback) {
                                callback.apply(_this, values);
                            }
                        }
                        catch (ex) {
                            core.logger.error(ex.Message, ex);
                        }
                        try {
                            //通知加载成功
                            deferred.reject(values);
                        }
                        catch (ex) {
                            core.logger.error(ex.Message, ex);
                        }
                    }
                });
                for (var i = 0; i < libs.length; i++) {
                    //定义任务节点
                    var taskNode = new TaskNode(i, libs[i], params, progress);
                    //加入队列
                    this.queue.push(taskNode);
                }
                if (this.status == Status.Free) {
                    this.execMountTask();
                }
                return deferred;
            };
            /**
             * 执行mount task
             */
            Require.prototype.execMountTask = function () {
                //获取队列长度
                var len = this.queue.length;
                if (len == 0) {
                    //设置空闲状态
                    this.status = Status.Free;
                    return;
                }
                //设置运行状态
                this.status = Status.Busy;
                //获取任务节点
                var node = this.queue.shift();
                //判断任务进程是否有效
                if (node.progress.isOK() == false) {
                    this.execMountTask();
                    return;
                }
                //加载资源
                this.mount(node);
            };
            /**
             * 加载
             * @param taskNode
             */
            Require.prototype.mount = function (taskNode) {
                //获取类型
                var type = this.getFileNamePostfix(taskNode.src);
                if (type == "js") {
                    //尝试获取js加载点
                    var point = taskNode.params["jsPoint"];
                    if (point == undefined) {
                        point = this.head;
                    }
                    this.mountJS(taskNode, point);
                    return;
                }
                else if (type == "css") {
                    //尝试获取js加载点
                    var point = taskNode.params["cssPoint"];
                    if (point == undefined) {
                        point = this.head;
                    }
                    this.mountCSS(taskNode, point);
                    return;
                }
                else {
                    //尝试获取js加载点
                    var point = taskNode.params["htmlPoint"];
                    if (point == undefined) {
                        point = this.doc.body;
                    }
                    this.mountHTML(taskNode, point);
                    return;
                }
            };
            /**
             * 加载css
             * @param task
             * @param point
             */
            Require.prototype.mountCSS = function (task, point) {
                var _this = this;
                var path = task.src;
                var node = this.doc.createElement("link");
                if (this.charset) {
                    node.charset = this.charset;
                }
                node.setAttribute("crossorigin", true);
                var supportOnload = "onload" in node;
                // for Old WebKit and Old Fireyufp
                if (this.isOldWebKit || !supportOnload) {
                    var meta_1 = {
                        //定义超时
                        timeout: this.timeout || 3000,
                        //当前消耗时间
                        time: 0,
                        //是否为旧的webkit
                        isOldWebKit: this.isOldWebKit,
                        //定义成功回调函数
                        success: function () {
                            //通知成功
                            task.progress.work(true, task.index, task.src);
                            //继续执行任务
                            _this.execMountTask();
                        },
                        //定义错误回调函数
                        error: function () {
                            //css已经加载，node移除以便于节省内存
                            try {
                                point.removeChild(node);
                            }
                            catch (ex) {
                                core.logger.error(ex.message, ex);
                            }
                            //通知失败
                            task.progress.work(false);
                            //继续执行任务
                            _this.execMountTask();
                        }
                    };
                    setTimeout(function () {
                        checkCss(node, meta_1);
                    }, 1); // Begin after node insertion
                }
                else {
                    node.onload = function () {
                        //移除监听
                        node.onload = node.onerror = null;
                        //通知成功
                        task.progress.work(true, task.index, task.src);
                        //继续执行任务
                        _this.execMountTask();
                    };
                    node.onerror = function () {
                        //node移除以便于节省内存
                        try {
                            point.removeChild(node);
                        }
                        catch (ex) {
                            core.logger.error(ex.message, ex);
                        }
                        //移除监听
                        node.onload = node.onerror = null;
                        //通知失败
                        task.progress.work(false);
                        //继续执行任务
                        _this.execMountTask();
                    };
                }
                //判断是否有上一个节点
                var preNode = this.doc.getElementById(path);
                //如果存在旧的css节点，则删除
                if (preNode) {
                    preNode.parentNode.removeChild(preNode);
                }
                node.async = true;
                node.rel = "stylesheet";
                node.type = "text/css";
                node.id = path;
                //设置href
                node.href = path;
                //加入css脚本
                point.appendChild(node);
            };
            /**
             * 加载html
             * @param task
             * @param evtChain
             */
            Require.prototype.mountHTML = function (task, point) {
                var _this = this;
                var t = this.timeout;
                if (task.params["timeout"]) {
                    t = task.params["timeout"];
                }
                var path = task.src;
                //获取资源并加载
                this.resource.get(path, t, function (code, data) {
                    if (code == 0) {
                        point.innerHTML = data;
                        //通知成功
                        task.progress.work(true, task.index, data);
                    }
                    else {
                        core.logger.error("code:" + code + ",message:" + data);
                        //通知失败
                        task.progress.work(false);
                    }
                    //继续执行任务
                    _this.execMountTask();
                });
            };
            /**
             * 加载js
             * @param path
             * @param point
             * @param evtChain
             */
            Require.prototype.mountJS = function (task, point) {
                var _this = this;
                var path = task.src;
                //从缓存中获取module
                var module = this.modules.get(path);
                //判断module是否已经存在
                if (module && module.status == core.ModuleStatus.Defined) {
                    //通知任务完成
                    task.progress.work(true, task.index, module.exports);
                    //继续执行任务
                    this.execMountTask();
                    return;
                }
                //定义新的module
                module = new core.Module();
                //设置ID
                module.id = path;
                //保存source
                module.src = path;
                //设置状态
                module.status = core.ModuleStatus.Loading;
                //注册modules
                this.modules.put(path, module);
                var node = this.doc.createElement("script");
                node.setAttribute("crossorigin", 'true');
                if (this.charset) {
                    node.charset = this.charset;
                }
                //判断是否有onload函数
                var supportOnload = "onload" in node;
                if (supportOnload) {
                    node.onload = function () {
                        //移除监听
                        node.onload = node.onerror = null;
                        //判断是否为模块
                        if (module.status == core.ModuleStatus.Loading) {
                            task.progress.work(true, task.index, path);
                        }
                        //继续执行任务
                        _this.execMountTask();
                    };
                    node.onerror = function () {
                        //js已经加载，node移除以便于节省内存
                        try {
                            point.removeChild(node);
                        }
                        catch (ex) {
                            core.logger.error(ex.message, ex);
                        }
                        //移除监听
                        node.onload = node.onerror = null;
                        //通知失败
                        task.progress.work(false);
                        //继续执行任务
                        _this.execMountTask();
                    };
                }
                else {
                    node.onreadystatechange = function () {
                        if (/loaded|complete/.test(node.readyState)) {
                            //移除监听
                            node.onreadystatechange = null;
                            //判断是否为模块
                            if (module.status == core.ModuleStatus.Loading) {
                                task.progress.work(true, task.index, path);
                            }
                            //继续执行任务
                            _this.execMountTask();
                        }
                    };
                }
                //设置为非同步模式
                node.async = true;
                //设置src
                node.src = path;
                //重新定义define函数
                this.win.define = this.createDefine(module, task);
                //加入js脚本
                point.appendChild(node);
            };
            /**
             * 创建define函数
             * @param module
             * @param task
             * @returns {(id:any, deps:any, factory:any)=>undefined}
             */
            Require.prototype.createDefine = function (module, task) {
                var _this = this;
                //定义require
                var _require = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var exports = _this.require.apply(_this, args);
                    return exports;
                };
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    //设置模块状态
                    module.status = core.ModuleStatus.Defining;
                    var id, deps, factory;
                    //获取参数列表长度
                    var argsLen = args.length;
                    // 如果参数个数为1，代表函数为define(factory)
                    if (argsLen === 1) {
                        factory = args[0];
                        id = undefined;
                    }
                    else if (argsLen === 2) {
                        factory = args[1];
                        // define(deps, factory)
                        if (core.Utils.isArray(args[0])) {
                            deps = args[0];
                            id = undefined;
                        }
                        else {
                            deps = undefined;
                        }
                    }
                    else {
                        id = args[0];
                        deps = args[1];
                        factory = args[2];
                    }
                    if (id) {
                        module.id = id;
                        //加入别名(id作为别名)
                        _this.alias[id] = module.src;
                    }
                    //解析依赖关系
                    if (deps) {
                        var remain = deps.length;
                        _this.require(deps, function () {
                            if (core.Utils.type(factory) == "function") {
                                module.exports = {};
                                factory.call(module.exports, _require, module.exports, module);
                            }
                            else {
                                module.exports = factory;
                            }
                            //更新状态
                            module.status = core.ModuleStatus.Defined;
                            //通知成功
                            task.progress.work(true, task.index, module.exports);
                        });
                    }
                    else {
                        if (core.Utils.type(factory) == "function") {
                            module.exports = {};
                            factory.call(module.exports, _require, module.exports, module);
                        }
                        else {
                            module.exports = factory;
                        }
                        //更新状态
                        module.status = core.ModuleStatus.Defined;
                        //通知成功
                        task.progress.work(true, task.index, module.exports);
                    }
                };
            };
            /**
             * 解析路径
             * @param uri
             * @returns {string}
             */
            Require.prototype.resolvePath = function (uri) {
                try {
                    // 解析URI
                    uri = this.parserPath(uri, true);
                    //获取后缀
                    var postfix = this.getFileNamePostfix(uri);
                    postfix = postfix.toLowerCase();
                    //格式化文件名
                    if (postfix != "js" && postfix != "css" && postfix != "html") {
                        uri += ".js";
                    }
                    if (uri.indexOf("?") == -1) {
                        uri += "?version=";
                        uri += this.version;
                    }
                    else {
                        uri += "&version=";
                        uri += this.version;
                    }
                    return uri;
                }
                catch (e) {
                    core.logger.error("resolve path[" + uri + "] fail", e);
                    throw e;
                }
            };
            /**
             * 获取文件名后缀
             * @param name
             * @returns {any}
             */
            Require.prototype.getFileNamePostfix = function (name) {
                var lastIndex = name.lastIndexOf("?");
                if (lastIndex == -1) {
                    lastIndex = name.length;
                }
                var index = name.lastIndexOf(".", lastIndex);
                if (index == -1) {
                    return "";
                }
                //获取后缀
                var postfix = name.substring(index + 1, lastIndex);
                return postfix;
            };
            /**
             * 解析路径
             * @param uri
             * @param replace
             */
            Require.prototype.parserPath = function (uri, replace) {
                //绝对路径（http），不解析直接返回
                if (uri.indexOf("http://") == 0) {
                    return uri;
                }
                //绝对路径（https），不解析直接返回
                if (uri.indexOf("https://") == 0) {
                    return uri;
                }
                //绝对路径（file），不解析直接返回
                if (uri.indexOf("file:///") == 0) {
                    return uri;
                }
                // id"/lib/yufp/yufp.js"，代表路径从根目录起
                if (uri.indexOf("/") == 0) {
                    var path_1 = "", href_1 = this.doc.location.href, pathName_1 = this.doc.location.pathname;
                    if (this.doc.location.protocol == "file:") {
                        var index = href_1.lastIndexOf("/");
                        path_1 = href_1.slice(0, index + 1) + uri;
                    }
                    else if (pathName_1.length == 0) {
                        path_1 = href_1 + uri;
                    }
                    else {
                        var index = href_1.lastIndexOf(pathName_1);
                        var host = href_1.slice(0, index);
                        index = pathName_1.indexOf("/", 1);
                        var projectName = "";
                        if (index != -1) {
                            projectName = pathName_1.slice(0, index);
                        }
                        path_1 = host + projectName + "/" + uri;
                    }
                    return path_1;
                }
                // id"./lib/yufp/yufp.js"，代表路径从当前目录起
                if (uri.indexOf("./") == 0) {
                    var href_2 = this.doc.location.href, index = href_2.lastIndexOf("/"), path_2 = href_2.slice(0, index) + uri.slice(1);
                    return path_2;
                }
                //是否进行别名替换
                if (replace) {
                    //判断是否为别名
                    var path_3 = this.alias[uri];
                    if (!path_3) {
                        var index = uri.indexOf("/");
                        if (index == -1) {
                            path_3 = this.base + uri;
                        }
                        else {
                            //判断是否有路径映射
                            var mark = uri.slice(0, index), s = this.paths[mark];
                            if (s) {
                                path_3 = s + uri.slice(index);
                            }
                            else {
                                path_3 = this.base + uri;
                            }
                        }
                    }
                    return this.parserPath(path_3, false);
                }
                var href = this.doc.location.href;
                var pathName = this.doc.location.pathname;
                var path;
                if (this.doc.location.protocol == "file:") {
                    var index = href.lastIndexOf("/");
                    path = href.slice(0, index + 1) + uri;
                }
                else if (pathName.length == 0) {
                    path = href + uri;
                }
                else {
                    var index = href.lastIndexOf(pathName);
                    var host = href.slice(0, index);
                    index = pathName.indexOf("/", 1);
                    var projectName = "";
                    if (index != -1) {
                        projectName = pathName.slice(0, index);
                    }
                    path = host + projectName + "/" + uri;
                }
                return path;
            };
            return Require;
        }());
        core.Require = Require;
        /**
         * 定义require
         * @type {yufp.core.Require}
         */
        core.require = new Require();
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2016/08/06.
 */
///<reference path="Utils.ts"/>
///<reference path="Require.ts"/>
var yufp;
(function (yufp) {
    var core;
    (function (core) {
        /**
         * 过滤类型
         */
        var FilterType;
        (function (FilterType) {
            /**
             * before拦截
             */
            FilterType[FilterType["Before"] = 0] = "Before";
            /**
             * mount拦截
             */
            FilterType[FilterType["Mount"] = 1] = "Mount";
            /**
             * ready拦截
             */
            FilterType[FilterType["Ready"] = 2] = "Ready";
            /**
              *  mount拦截
              * */
            FilterType[FilterType["UnMount"] = 3] = "UnMount";
            /**
             * destroy拦截
             */
            FilterType[FilterType["Destroy"] = 4] = "Destroy";
        })(FilterType = core.FilterType || (core.FilterType = {}));
        /**
         * 定义路由
         */
        var Router = (function () {
            /**
             * 构造函数
             */
            function Router() {
                //保存document
                this.doc = document;
                //route table
                this.routeTable = {};
                //激活页面
                this.activePages = {};
                //历史记录
                this.history = [];
                //历史缓存大小
                this.historyCacheSize = 30;
                //过滤器
                this.filters = [];
                //参数配置
                this.settings = {};
                //初始化mount handlers
                this.mountHandlers = {};
                //创建event chain
                this.eventChain = new core.EventChain();
                //设默认mount handler
                this.addMountHandler("default", new DefaultMountHandler());
            }
            /**
             * 加入mount handler
             * @param type
             * @param handler
             */
            Router.prototype.addMountHandler = function (type, handler) {
                this.mountHandlers[type] = handler;
                return this;
            };
            /**
             * 获取mount handler
             * @param type
             * @returns {any}
             */
            Router.prototype.getMountHandler = function (type) {
                return this.mountHandlers[type];
            };
            /**
             * 移除mount handler
             * @param type
             * @returns {yufp.core.Router}
             */
            Router.prototype.removeMountHandler = function (type) {
                if (this.mountHandlers[type]) {
                    delete this.mountHandlers[type];
                }
                return this;
            };
            /**
             * 加入过滤器
             *
             * @param filter
             * @returns {yufp.core.Router}
             */
            Router.prototype.addFilter = function (filter) {
                //加入过滤器
                this.filters.push(filter);
                return this;
            };
            /**
             * 移除过滤器
             * @param name
             */
            Router.prototype.removeFilter = function (args) {
                //获取过滤器名称
                var name;
                if (core.Utils.type(args) == "string") {
                    name = args;
                } else {
                    name = args["name"];
                }
                //查找待删除过滤器
                var i = 0;
                for (; i < this.filters.length; i++) {
                    if (name == this.filters[i].name) {
                        break;
                    }
                }
                //删除过滤器
                if (i < this.filters.length) {
                    this.filters.splice(i, 1);
                }
                return this;
            };
            /**
             * 执行过滤器
             * @param type
             * @param args
             * @returns {any}
             */
            Router.prototype.doFilters = function (type) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                if (type == FilterType.Before) {
                    //按顺序执行
                    for (var i = 0; i < this.filters.length; i++) {
                        if (!this.filters[i].before) {
                            continue;
                        }
                        //获取before方法
                        var before = this.filters[i].before;
                        //调用before方法
                        var res = before.apply(this, args);
                        //判断是否中断执行
                        if (res == false) {
                            return res;
                        }
                    }
                    return true;
                }
                else if (type == FilterType.Mount) {
                    //按顺序执行
                    for (var i = 0; i < this.filters.length; i++) {
                        if (!this.filters[i].mount) {
                            continue;
                        }
                        //获取mount方法
                        var mount = this.filters[i].mount;
                        //调用mount方法
                        var res = mount.apply(this, args);
                        //判断是否中断执行
                        if (res == false) {
                            return res;
                        }
                    }
                    return true;
                }
                else if (type == FilterType.Ready) {
                    //按顺序执行
                    for (var i = 0; i < this.filters.length; i++) {
                        if (!this.filters[i].ready) {
                            continue;
                        }
                        //获取ready方法
                        var ready = this.filters[i].ready;
                        //调用ready方法
                        var res = ready.apply(this, args);
                        //判断是否中断执行
                        if (res == false) {
                            return res;
                        }
                    }
                    return true;
                }
                else if (type == FilterType.UnMount) {
                    //按顺序执行
                    for (var i = 0; i < this.filters.length; i++) {
                        if (!this.filters[i].unMount) {
                            continue;
                        }
                        //获取unMount方法
                        var unMount = this.filters[i].unMount;
                        //调用unMount方法
                        var res = unMount.apply(this, args);
                        //判断是否中断执行
                        if (res == false) {
                            return res;
                        }
                    }
                    return true;
                }
                else {
                    //按顺序执行
                    for (var i = 0; i < this.filters.length; i++) {
                        if (!this.filters[i].destroy) {
                            continue;
                        }
                        //获取destroy方法
                        var destroy = this.filters[i].destroy;
                        //调用destroy方法
                        var res = destroy.apply(this, args);
                        //判断是否中断执行
                        if (res == false) {
                            return res;
                        }
                    }
                    return true;
                }
            };
            /**
             * 加入路由信息
             * @param name
             * @param route
             * @returns {yufp.core.Router}
             */
            Router.prototype.addRoute = function (name, route) {
                var unit = {};
                core.Utils.extend(true, unit, route);
                //保存route信息
                this.routeTable[name] = unit;
            };
            /**
             * 移除路由信息
             * @param name
             * @returns {yufp.core.Router}
             */
            Router.prototype.removeRoute = function (name) {
                var route = this.routeTable[name];
                if (route) {
                    delete this.routeTable[name];
                }
                return route;
            };
            /**
             * 获取路由信息
             * @param name
             */
            Router.prototype.getRoute = function (name) {
                var route = {};
                core.Utils.extend(true, route, this.routeTable[name]);
                return route;
            };
            /**
             * 加入路由表
             * @param routeTable
             */
            Router.prototype.addRouteTable = function (routeTable) {
                //保存路由表数据
                for (var name_6 in routeTable) {
                    //获取路由信息
                    var route = routeTable[name_6];
                    //加入路由信息
                    this.addRoute(name_6, route);
                }
            };
            /**
             * 清空路由表
             */
            Router.prototype.clearRouteTable = function () {
                this.routeTable = {};
            };
            /**
             * 设置默认root id
             * @param rootId
             * @returns {yufp.core.Router}
             */
            Router.prototype.setDefaultRootId = function (rootId) {
                this.settings["rootId"] = rootId;
            };
            /**
             * 获取默认root id
             * @returns {any}
             */
            Router.prototype.getDefaultRootId = function () {
                return this.settings["rootId"];
            };
            /**
             * 设置历史缓存的大小
             * @param size
             */
            Router.prototype.setHistoryCacheSize = function (size) {
                this.historyCacheSize = size;
            };
            /**
             * 获取历史缓存大小
             * @returns {number}
             */
            Router.prototype.getHistoryCacheSize = function () {
                return this.historyCacheSize;
            };
            /**
             * 加入历史记录
             * @param id
             * @param data
             * @param rootId
             */
            Router.prototype.addHistory = function (id, data, rootId) {
                //计算历史记录数量超出最大限制的数量
                var n = this.history.length - this.historyCacheSize;
                if (n >= 0) {
                    n += 1;
                    //移除超出范围的记录
                    this.history.splice(0, n);
                }
                //创建历史记录
                var rec = {
                    id: id,
                    data: data,
                    rootId: rootId
                };
                //加入历史记录
                this.history.push(rec);
            };
            /**
             * 清空临时
             */
            Router.prototype.clearHistory = function () {
                this.history = [];
            };
            /**
             * 历史回退
             * @param term
             * @returns {yufp.core.Router}
             */
            Router.prototype.back = function (term) {
                //如果未指定条件，则默认回退一个
                var len = this.history.length;
                //判断是否有回退的记录
                if (len > 1) {
                    //有回退条件处理
                    if (term) {
                        if (term.id) {
                            var index_1 = -1;
                            for (var i = len - 2; i >= 0; i--) {
                                var node = this.history[i];
                                if (node.id == term.id) {
                                    index_1 = i;
                                    break;
                                }
                            }
                            //判断是否查找到满足条件的记录
                            if (index_1 >= 0) {
                                var n = len - index_1;
                                var recs_1 = this.history.splice(index_1, n);
                                //标志为回退
                                recs_1[0].isBack = true;
                                //重新跳转
                                return this.to(recs_1[0]);
                            }
                        }
                        else if (term.before) {
                            var index_2 = -1;
                            for (var i = 0; i < len; i++) {
                                var node = this.history[i];
                                if (node.id == term.before) {
                                    index_2 = i;
                                    break;
                                }
                            }
                            index_2 -= 1;
                            //判断是否查找到满足条件的记录
                            if (index_2 >= 0) {
                                var n = len - index_2;
                                var recs_2 = this.history.splice(index_2, n);
                                //标志为回退
                                recs_2[0].isBack = true;
                                //重新跳转
                                return this.to(recs_2[0]);
                            }
                        }
                    }
                    //无条件或条件不满足的默认处理
                    //删除记录
                    var index = len - 2;
                    var recs = this.history.splice(index, 2);
                    //标志为回退
                    recs[0].isBack = true;
                    //重新跳转
                    return this.to(recs[0]);
                }
                else {
                    core.logger.info("not more history record to back");
                }
                //定义deferred
                var deferred = new core.Deferred();
                deferred.reject("");
                return deferred;
            };
            /**
             * 路由跳转
             *
             * @returns {any}
             */
            Router.prototype.to = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                //获取跳转目标信息
                var target;
                if (args.length == 1 && core.Utils.type(args[0]) == "object") {
                    target = args[0];
                } else {
                    target = {};
                    for (var i = 0; i < args.length; i++) {
                        if (i == 0) {
                            target.id = args[i];
                        } else if (i == 1) {
                            target.data = args[i];
                        } else if (i == 2) {
                            target.rootId = args[i];
                        }
                    }
                }
                //获取路由信息
                var route = this.getRoute(target.id);
                if (!route) {
                    core.logger.error("路由信息未注册[" + target.id + "]");
                    return;
                }
                //如果root id未设置，从路由信息中获取
                if (!target.rootId) {
                    target.rootId = route["rootId"];
                }
                //默认root id
                if (!target.rootId) {
                    target.rootId = this.settings["rootId"];
                }
                //定义引用
                var cite = {
                    id: target.id,
                    rootId: target.rootId,
                    el: '#'+target.rootId+'>div',
                    startTime: new Date().getTime(),
                    isBack: target.isBack ? target.isBack : false
                };
                //执行before过滤器
                var res = this.doFilters(FilterType.Before, target.id, target.data, cite);
                //如果返回false，则不允许跳转
                if (res == false) {
                    return;
                }
                //定义deferred
                var deferred = new core.Deferred();
                //装载
                this.mount(target, route, cite, deferred);
                return deferred;
            };
            /**
             * 装载
             * @param target
             * @param route
             * @apram cite
             * @param deferred
             * @returns {boolean}
             */
            Router.prototype.mount = function (target, route, cite, deferred) {
                var _this = this;
                //卸载之前的页面
                this.unMount(target.rootId);
                //加入历史记录
                this.addHistory(target.id, target.data, target.rootId);
                var type = route["type"];
                if (type == undefined) {
                    type = "default";
                }
                //获取mount handler
                var handler = this.getMountHandler(type);
                this.eventChain.post(function () {
                    //处理mount
                    handler.mount(target.id, route, cite, _this, function (code, exports) {
                        //正常返回
                        if (code != 0) {
                            core.logger.error("mount失败");
                            //通知失败
                            deferred.reject(target.id);
                            _this.eventChain.fire();
                            return;
                        }
                        //设置默认值
                        if (exports == undefined) {
                            exports = {};
                        }
                        var page = {
                            target: target,
                            exports: exports,
                            cite: cite
                        };
                        //记录集合页面信息
                        _this.activePages[target.rootId] = page;
                        var curTime = new Date().getTime();
                        core.logger.debug("打开页面[" + target.id + "]耗时:" + (curTime - cite.startTime) + "毫秒");
                        if (exports.ready) {
                            //执行过滤器
                            _this.doFilters(FilterType.Ready, exports, target.id, target.data, cite);
                            //执行ready方法
                            try {
                                exports.ready(target.id, target.data, cite);
                            }
                            catch (ex) {
                                core.logger.error(ex.Message, ex);
                            }
                        }
                        //通知成功
                        deferred.resolve(target.id);
                        //通知下一个
                        _this.eventChain.fire();
                    });
                });
                return true;
            };
            /**
             * 卸载
             * @param rootId
             * @returns {boolean}
             */
            Router.prototype.unMount = function (rootId) {
                //查找并销毁前活动页面
                for (var id in this.activePages) {
                    // 试图获取元素
                    var el = this.doc.getElementById(id);
                    //判断是否为替代的页面及子页面
                    if (id == rootId || !el || this.isChildNode(rootId, id)) {
                        var page = this.activePages[id];
                        var exports = page.exports;
                        if (exports == undefined) {
                            //删除记录
                            delete this.activePages[id];
                            continue;
                        }
                        //获取路由
                        var route = this.getRoute(id);
                        var type = route["type"];
                        if (type == undefined) {
                            type = "default";
                        }
                        //获取mount handler
                        var handler = this.getMountHandler(type);
                        try {
                            handler.unMount(id, route, page.cite, exports, this);
                        }
                        catch (ex) {
                            core.logger.error(ex.Message, ex);
                        }
                        var target = this.activePages[id].target;
                        //调用destroy方法
                        if (exports.destroy) {
                            //执行destroy过滤器
                            this.doFilters(FilterType.Destroy, exports, target.id, page.cite);
                            //获取destroy
                            var destroy = exports.destroy;
                            //调用模块的destroy方法
                            destroy.call(exports, target.id, page.cite);
                        }
                        //删除记录
                        delete this.activePages[id];
                    }
                }
                return true;
            };
            /**
             * 判断元素是否为父子关系
             * @param parent
             * @param node
             */
            Router.prototype.isChildNode = function (parentId, childId) {
                //获取parent node
                var parentNode = this.doc.getElementById(parentId);
                //如果parent node不存在，则不存在父子关系
                if (!parentNode) {
                    return false;
                }
                //获取child node
                var childNode = this.doc.getElementById(childId);
                //如果child node不存在，则不存在父子关系
                if (!childNode) {
                    return false;
                }
                //查找
                var parent = childNode.parentNode;
                while (parent != parentNode && parent != this.doc) {
                    parent = parent.parentNode;
                }
                var res = parent == parentNode;
                return res;
            };
            /**
             * 发送消息
             * @param id
             * @param type
             * @param message
             * @returns {any}
             */
            Router.prototype.sendMessage = function (id, type, message) {
                //获取路由信息
                var route = this.getRoute(id);
                if (!route || !route.js) {
                    core.logger.error("路由信息未注册[" + id + "]，或无js模块");
                    return;
                }
                //获取exports
                var exports = core.require.require(route.js);
                //判断exports是否存在
                if (exports && exports.onmessage) {
                    //通知
                    var res = exports.onmessage(type, message);
                    return res;
                }
                else {
                    core.logger.error("exports或exports.onMessage未定义");
                }
            };
            return Router;
        }());
        core.Router = Router;
        /**
         * 默认mount handler
         */
        var DefaultMountHandler = (function () {
            function DefaultMountHandler() {
            }
            /**
             * 加载
             * @param id
             * @param route
             * @param cite
             * @param router
             * @param callback
             */
            DefaultMountHandler.prototype.mount = function (id, route, cite, router, callback) {
                //获取root id
                var rootId = cite.rootId;
                //获取root节点
                var root = document.getElementById(rootId);
                //css node节点数组
                var cssNodes = [];
                //js node节点数组
                var jsNodes = [];
                //html node节点
                var htmlNode;
                //获取第一节点
                var node = core.Utils.getFirstElementChild(root);
                while (node != null) {
                    //获取name
                    var name_7 = node.nodeName;
                    if (name_7) {
                        //转换为大写
                        name_7 = name_7.toUpperCase();
                    }
                    if (name_7 == "SCRIPT") {
                        jsNodes.push(node);
                    }
                    else if (name_7 = "LINK") {
                        cssNodes.push(node);
                    }
                    else if (name_7 = "DIV") {
                        htmlNode = node;
                    }
                    node = core.Utils.getNextElementSibling(node);
                }
                var libs = [];
                //1、加入css
                if (route.css) {
                    var list = route.css.split(",");
                    libs = libs.concat(list);
                }
                //2、加入js
                if (route.js) {
                    var list = route.js.split(",");
                    libs = libs.concat(list);
                }
                //获取html资源
                core.require.get(route.html, function (code, data) {
                    //正常返回
                    if (code != 0) {
                        core.logger.error("加載html资源失败");
                        callback(1);
                        return;
                    }
                    //数组参数
                    var args = {
                        'cssPoint': root,
                        'jsPoint': root
                    };
                    //加载css和js
                    core.require.options(args).require(libs, function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        //logger.debug("加载css/js耗时:"+(new Date().getTime()-startTime));//debug
                        //获取export函数
                        var exports;
                        for (var i = 0; i < args.length; i++) {
                            if (core.Utils.type(args[i]) == "object") {
                                exports = args[i];
                            }
                        }
                        if (exports && exports.mount) {
                            //执行过滤器
                            router.doFilters(FilterType.Mount, id, cite);
                            //执行mount方法
                            try {
                                exports.mount(id, cite);
                            }
                            catch (ex) {
                                core.logger.error(ex.Message, ex);
                            }
                        }
                        //删除旧的js节点
                        for (var i = 0; root.hasChildNodes() && i < jsNodes.length; i++) {
                            try {
                                root.removeChild(jsNodes[i]);
                            }
                            catch (ex) { }
                        }
                        //删除旧的css节点
                        for (var i = 0; root.hasChildNodes() && i < cssNodes.length; i++) {
                            try {
                                root.removeChild(cssNodes[i]);
                            }
                            catch (ex) { }
                        }
                        //设置html内容
                        setTimeout(function () {
                            if (htmlNode) {
                                //替换html节点
                                htmlNode.innerHTML = data;
                            }
                            else {
                                //创建新的node节点
                                var newHtmlNode = document.createElement("div");
                                newHtmlNode.innerHTML = data;
                                //新增html节点
                                root.appendChild(newHtmlNode);
                            }
                            //调用回调函数
                            callback(0, exports);
                        }, 0);
                    });
                });
            };
            /**
             * 卸载
             * @param id
             * @param route
             * @param rootId
             * @param metadata
             * @param exports
             * @param router
             */
            DefaultMountHandler.prototype.unMount = function (id, route, metadata, exports, router) {
                //执行过滤器
                router.doFilters(FilterType.UnMount, id, metadata);
                //执行unMount方法
                if (exports.unMount) {
                    try {
                        exports.unMount(id, metadata);
                    }
                    catch (ex) {
                        core.logger.error(ex.Message, ex);
                    }
                }
            };
            return DefaultMountHandler;
        }());
        /**
         * 导出router
         * @type {yufp.core.Router}
         */
        core.router = new Router();
    })(core = yufp.core || (yufp.core = {}));
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2016/12/18.
 */
var yufp;
(function (yufp) {
    /**
     * 检测系统
     * @param ua
     */
    function detect(ua) {
        var os = {};
        var fns = [
            function (os) {
                var windows = ua.match(/(Windows)[\s\/]+/);
                if (windows) {
                    os.windows = true;
                    //是否为支持触摸
                    os.isTouch = ("ontouchstart" in window) || (ua.indexOf("touch") !== -1) || (ua.indexOf("mobile") !== -1);
                }
                return os.windows == true;
            },
            function (os) {
                var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
                if (android) {
                    os.android = true;
                    os.version = android[2];
                    os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
                    //是否为支持触摸
                    os.isTouch = ("ontouchstart" in window) || (ua.indexOf("touch") !== -1) || (ua.indexOf("mobile") !== -1);
                }
                return os.android === true;
            },
            function (os) {
                var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
                if (iphone) {
                    os.ios = os.iphone = true;
                    os.version = iphone[2].replace(/_/g, '.');
                    //是否为支持触摸
                    os.isTouch = ("ontouchstart" in window) || (ua.indexOf("touch") !== -1) || (ua.indexOf("mobile") !== -1);
                }
                else {
                    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
                    if (ipad) {
                        os.ios = os.ipad = true;
                        os.version = ipad[2].replace(/_/g, '.');
                        //是否为支持触摸
                        os.isTouch = ("ontouchstart" in window) || (ua.indexOf("touch") !== -1) || (ua.indexOf("mobile") !== -1);
                    }
                }
                return os.ios === true;
            }
        ];
        for (var i = 0; i < fns.length; i++) {
            if (fns[i](os) == true) {
                break;
            }
        }
        return os;
    }
    /**
     * 导出os
     * @type {{}}
     */
    yufp.os = detect(window.navigator.userAgent);
})(yufp || (yufp = {}));
/**
 * Created by jiangcheng on 2016/08/15.
 */
///<reference path="Utils.ts"/>
///<reference path="Resource.ts"/>
///<reference path="Require.ts"/>
///<reference path="Router.ts"/>
///<reference path="Bus.ts"/>
///<reference path="EventChain.ts"/>
///<reference path="OS.ts"/>
var yufp;
(function (yufp) {
    //导出继承方法，主要目的是为了插件安装
    yufp.extend = yufp.core.Utils.extend;
    //安装工具类
    yufp.extend(yufp.core.Utils);
    //安装require方法
    yufp.require = yufp.core.require;
    //安装路由方法
    yufp.router = yufp.core.router;
    //导出日志
    yufp.logger = yufp.core.logger;
    //消息代理
    yufp.eventproxy = new yufp.core.EventProxy();
    //数据篮子
    yufp.bus = new yufp.core.Bus();
    //事件链
    yufp.EventChain = yufp.core.EventChain;
    /**
     * 配置函数
     */
    function config(setting) {
        //配置require
        yufp.core.require.config(setting);
    }
    yufp.config = config;
})(yufp || (yufp = {}));
//# sourceMappingURL=yufp.js.map