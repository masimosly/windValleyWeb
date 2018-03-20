/**
 * Created by jiangcheng on 2016/08/05.
 */
declare namespace yufp.core {
    /**
     * ajax请求
     * @param args
     * @returns {*}
     */
    function ajax(args: any): any;
}
/**
 * Created by 江成 on 2016/08/05.
 */
declare namespace yufp.core {
    /**
     * 导出logger
     * @type {yufp.Logger}
     */
    let logger: Logger;
    /**
     * Logger
     */
    class Logger {
        /**
         * warn
         * @param message
         * @param ex
         */
        warn(message: string, ex?: any): any;
        /**
         * error
         * @param message
         * @param ex
         */
        error(message: string, ex?: any): any;
        /**
         * info
         * @param message
         * @returns {yufp.core.Logger}
         */
        info(message: string): any;
        /**
         * debug
         * @param message
         * @returns {yufp.core.Logger}
         */
        debug(message: string): any;
    }
}
/**
 * Created by jiangcheng on 2016/10/31.
 */
declare namespace yufp.core {
    /**
     * 数据bus
     */
    class Bus {
        /**
         * root节点
         */
        private root;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 加入数据
         * @param args
         * @returns {boolean}
         */
        put(...args: any[]): boolean;
        /**
         * 获取内容
         * @param args
         * @returns {any}
         */
        get(...args: any[]): any;
        /**
         * 移除数据
         * @param args
         * @returns {any}
         */
        remove(...args: any[]): boolean;
    }
}
/**
 * Created by 江成 on 2016/08/05.
 */
declare namespace yufp.core {
    /**
     * 工具类
     */
    class Utils {
        /**
         * 类型映射表
         */
        static class2type: any;
        /**
         * 判断类型
         * @param obj
         * @returns {any}
         */
        static type(obj: any): string;
        /**
         * 判断是否为函数
         * @param obj
         * @returns {boolean}
         */
        static isFunction(obj: any): boolean;
        /**
         * 判断是否为数组
         * @type {(function(any): boolean)|(function(any): boolean)}
         */
        static isArray(obj: any): boolean;
        /**
         * 创建数组
         * @param arr
         * @param results
         * @returns {Array<any>|Array}
         */
        static makeArray(arr: any, results: Array<any>): any[];
        /**
         * 合并数组
         * @param first
         * @param second
         * @returns {Array<any>}
         */
        static merge(first: Array<any>, second: Array<any>): any[];
        /**
         * 判断是否为window对象
         * @param obj
         * @returns {any|boolean}
         */
        static isWindow(obj: any): boolean;
        /**
         * 是否为普通对象
         * @param obj
         * @returns {any}
         */
        static isPlainObject(obj: any): boolean;
        /**
         * 继承（是否深度拷贝,dest,src1,src2,src3...）
         * @returns {any|{}}
         */
        static extend(...args: any[]): any;
        /**
         * 克隆
         * @param source
         * @param target
         * @returns {any}
         */
        static clone(src: any, dest: any): any;
        /**
         * 是否数组
         * @param obj
         * @returns {boolean}
         */
        static isArrayLike(obj: any): boolean;
        /**
         * 循环访问
         * @param target
         * @param callback
         * @param hasOwnProperty
         * @returns {any}
         */
        static each(target: any, callback: {
            (index: number, element: any): boolean;
        }, hasOwnProperty?: any): void;
        static getInnerText(element: any): any;
        static setInnerText(element: any, content: string): void;
        /**
         * 获取下一个element node
          * @param node
         * @returns {any}
         */
        static getNextElementSibling(element: any): any;
        static getFirstElementChild(element: any): any;
    }
}
/**
 * Created by jiangcheng on 2016/08/05.
 */
declare namespace yufp.core {
    /**
     * Deffered类
     */
    class Deferred {
        /**
         * 成功函数
         */
        private doneFns;
        /**
         * 失败函数
         */
        private failFns;
        /**
         * always函数
         */
        private alwaysFns;
        /**
         * 参数
         */
        private args;
        /**
         * 状态
         */
        private status;
        /**
         * 构造函数
         */
        constructor();
        /**
         * fire
         */
        private fire();
        /**
         * 注册成功函数
         * @param fn
         */
        done(fn: {
            (...params: any[]): any;
        }): this;
        /**
         * 注册失败函数
         * @param fn
         */
        fail(fn: {
            (...args: any[]): any;
        }): this;
        /**
         * 注册always函数
         * @param fn
         */
        always(fn: {
            (...args: any[]): any;
        }): this;
        /**
         * 成功
         * @param params
         */
        resolve(...params: any[]): any;
        /**
         * 拒绝
         * @param params
         */
        reject(...params: any[]): any;
    }
}
/**
 * Created by 江成 on 2016/10/31.
 */
declare namespace yufp.core {
    /**
     * 回调事件
     */
    interface Task {
        (...params: any[]): void;
    }
    /**
     * 任务链路
     */
    class EventChain {
        /**
         * 事件链路
         */
        private chain;
        /**
         * 状态
         */
        private status;
        /**
         * 参数
         */
        private args;
        /**
         * 等待函数
         */
        private waitFns;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 触发链路中的下一个事件
         */
        fire(...params: any[]): void;
        /**
         * 结束事件链调用，直接触发wait函数
         */
        reject(...args: any[]): void;
        /**
         * 加入任务
         * @param task
         * @returns {yufp.core.TaskChain}
         */
        post(task: Task): this;
        /**
         * 加入等待任务
         * @param task
         * @returns {yufp.core.EventChain}
         */
        wait(task: Task): this;
        /**
         * 判断事件链是否已经执行完成
         * @returns {boolean}
         */
        isFinish(): boolean;
    }
}
/**
 * Created by jiangcheng on 2016/08/18.
 */
declare namespace yufp.core {
    /**
     * 事件代理
     */
    class EventProxy {
        /**
         * 注册表
         * @type {{}}
         */
        private register;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 绑定事件
         *
         * @param key
         * @param callback
         * @returns {yufp.core.EventProxy}
         */
        bind(key: string, callback: {
            (...params: any[]): any;
        }, once?: boolean): EventProxy;
        /**
         * 解除绑定
         * @param key
         */
        unbind(key: string): void;
        /**
         * 绑定一次性触发函数
         * @param key
         * @param callback
         */
        once(key: string, callback: {
            (...params: any[]): any;
        }): EventProxy;
        /**
         * 绑定多条件触发函数
         * @param args
         */
        all(...args: any[]): EventProxy;
        /**
         * 触发函数
         * @param key
         * @param value
         */
        trigger(key: string, value: any): EventProxy;
        /**
         * 触发函数(别名)
         * @param key
         * @param value
         * @returns {EventProxy}
         */
        emit(key: string, value: any): EventProxy;
    }
}
/**
 * Created by jiangcheng on 2017/4/17.
 */
declare namespace yufp.core {
    /**
     * 资源
     */
    class Resource {
        /**
         * 缓存
         */
        private cache;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 获取资源
         * @param url
         * @returns {string}
         */
        get(url: string, timeout: number, callback: {
            (flag: number, data: string): void;
        }): void;
    }
}
/**
 * Created by jiangcheng on 2017/4/18.
 */
declare namespace yufp.core {
    /**
     * 模块状态
     */
    enum ModuleStatus {
        /**
         * 加载中
         */
        Loading = 0,
        /**
         * 加载完成
         */
        Loaded = 1,
        /**
     * 定义中状态
     */
        Defining = 2,
        /**
         * 定义完成状态
         */
        Defined = 3,
    }
    /**
     * 模块
     */
    class Module {
        /**
         * exports
         */
        exports: any;
        /**
         * 状态
         */
        status: ModuleStatus;
        /**
         * id
         */
        id: string;
        /**
         * source
         */
        src: string;
    }
    /**
     * 模块管理器
     */
    class Modules {
        /**
         * 注册表
         */
        private register;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 获取模块
         * @param path
         * @returns {any}
         */
        get(path: string): Module;
        /**
         * 加入模块
         * @param path
         * @param module
         */
        put(path: string, module: Module): void;
        /**
         * 移除模块
         * @param path
         * @returns {any}
         */
        remove(path: string): Module;
        /**
         * 判断模块是否存在
         * @param path
         */
        contains(path: string): boolean;
        /**
         * 清空模块
         */
        clear(): void;
    }
}
/**
 * Created by jiangcheng on 2016/08/06.
 */
declare namespace yufp.core {
    /**
     * require
     */
    class Require {
        /**
         * window
         */
        private win;
        /**
         * document
         */
        private doc;
        /**
         * head
         */
        private head;
        /**
         * 是否是old webkit
         */
        private isOldWebKit;
        /**
         * 路径简称配置
         */
        private paths;
        /**
         * 别名配置
         */
        private alias;
        /**
         * 根路径
         */
        private base;
        /**
         * 字符
         */
        private charset;
        /**
         * 超时
         */
        private timeout;
        /**
         * 模块管理器
         */
        private modules;
        /**
         * 资源
         */
        private resource;
        /**
         * 配置
         */
        private settings;
        /**
         * 队列
         */
        private queue;
        /**
         * 状态
         */
        private status;
        /**
         * 版本号
         */
        private version;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 配置静态参数，用于初始化
         * @param setting
         * @returns {yufp.core.Require}
         */
        config(setting: any): Require;
        /**
         * 配置动态参数
         * @param args
         * @returns {yufp.core.Require}
         */
        options(args: any): Require;
        /**
         * 获取资源
         * @param url
         * @param callback
         * @returns {yufp.core.Require}
         */
        get(url: string, callback: ({
            (code: number, data: string): void;
        })): Require;
        /**
         * 加载资源
         * @param args
         */
        use(...args: any[]): any;
        /**
         * 加载资源
         * @param args
         */
        require(...args: any[]): any;
        /**
         * 执行mount task
         */
        private execMountTask();
        /**
         * 加载
         * @param taskNode
         */
        private mount(taskNode);
        /**
         * 加载css
         * @param task
         * @param point
         */
        private mountCSS(task, point);
        /**
         * 加载html
         * @param task
         * @param evtChain
         */
        private mountHTML(task, point);
        /**
         * 加载js
         * @param path
         * @param point
         * @param evtChain
         */
        private mountJS(task, point);
        /**
         * 创建define函数
         * @param module
         * @param task
         * @returns {(id:any, deps:any, factory:any)=>undefined}
         */
        private createDefine(module, task);
        /**
         * 解析路径
         * @param uri
         * @returns {string}
         */
        resolvePath(uri: string): string;
        /**
         * 获取文件名后缀
         * @param name
         * @returns {any}
         */
        private getFileNamePostfix(name);
        /**
         * 解析路径
         * @param uri
         * @param replace
         */
        private parserPath(uri, replace);
    }
    /**
     * 定义require
     * @type {yufp.core.Require}
     */
    let require: Require;
}
/**
 * Created by jiangcheng on 2016/08/06.
 */
declare namespace yufp.core {
    /**
     * 过滤类型
     */
    enum FilterType {
        /**
         * before拦截
         */
        Before = 0,
        /**
         * mount拦截
         */
        Mount = 1,
        /**
         * ready拦截
         */
        Ready = 2,
        /**
          *  mount拦截
          * */
        UnMount = 3,
        /**
         * destroy拦截
         */
        Destroy = 4,
    }
    /**
     * 过滤器
     */
    interface Filter {
        /**
         * 名称
         */
        name: string;
        /**
         * 路由跳转前执行
         * @param code
         * @param cite
         */
        before(code: string, cite: any): boolean;
        /**
         * 加载路由内容前执行
         * @param code
         * @param cite
         */
        mount(code: string, cite: any): any;
        /**
         * ready函数执行
         * @param exports
         * @param code
         * @param data
         * @param cite
         */
        ready(exports: any, code: string, data: any, cite: any): void;
        /**
         * 卸载路由内容前执行
         * @param code
         * @param cite
         */
        unMount(code: string, cite: any): any;
        /**
         * destroy函数执行
         * @param exports
         * @param code
         * @param cite
         */
        destroy(exports: any, code: string, cite: any): void;
    }
    /**
     * 加载完成回调
     */
    interface MountedCallback {
        /**
         * 回调处理
         * @param code
         * @param exports
         */
        (code: number, exports: any): void;
    }
    /**
     * mount handler
     */
    interface MountHandler {
        /**
         * 加载
         * @param id
         * @param route
         * @param metadata
         * @param router
         * @param callback
         */
        mount(id: string, route: any, metadata: any, router: Router, callback: MountedCallback): any;
        /**
         * 卸载
         * @param id
         * @param route
         * @param metadata
         * @param exports
         * @param router
         */
        unMount(id: string, route: any, metadata: any, exports: any, router: Router): any;
    }
    /**
     * 定义路由
     */
    class Router {
        /**
         * document对象
         */
        private doc;
        /**
         * 路由表
         */
        private routeTable;
        /**
         * 激活页面
         */
        private activePages;
        /**
         * 历史记录
         */
        private history;
        /**
         * 历史记录大小
         */
        private historyCacheSize;
        /**
         * 过滤器队列
         */
        private filters;
        /**
         * 参数配置
         */
        private settings;
        /**
         * 加载处理器集合
         */
        private mountHandlers;
        /**
         * event链路
         */
        private eventChain;
        /**
         * 构造函数
         */
        constructor();
        /**
         * 加入mount handler
         * @param type
         * @param handler
         */
        addMountHandler(type: string, handler: MountHandler): Router;
        /**
         * 获取mount handler
         * @param type
         * @returns {any}
         */
        getMountHandler(type: string): MountHandler;
        /**
         * 移除mount handler
         * @param type
         * @returns {yufp.core.Router}
         */
        removeMountHandler(type: string): Router;
        /**
         * 加入过滤器
         *
         * @param filter
         * @returns {yufp.core.Router}
         */
        addFilter(filter: Filter): Router;
        /**
         * 移除过滤器
         * @param name
         */
        removeFilter(args: any): Router;
        /**
         * 执行过滤器
         * @param type
         * @param args
         * @returns {any}
         */
        doFilters(type: FilterType, ...args: any[]): boolean;
        /**
         * 加入路由信息
         * @param name
         * @param route
         * @returns {yufp.core.Router}
         */
        addRoute(name: string, route: any): void;
        /**
         * 移除路由信息
         * @param name
         * @returns {yufp.core.Router}
         */
        removeRoute(name: string): any;
        /**
         * 获取路由信息
         * @param name
         */
        getRoute(name: string): any;
        /**
         * 加入路由表
         * @param routeTable
         */
        addRouteTable(routeTable: any): void;
        /**
         * 清空路由表
         */
        clearRouteTable(): void;
        /**
         * 设置默认root id
         * @param rootId
         * @returns {yufp.core.Router}
         */
        setDefaultRootId(rootId: string): void;
        /**
         * 获取默认root id
         * @returns {any}
         */
        getDefaultRootId(): string;
        /**
         * 设置历史缓存的大小
         * @param size
         */
        setHistoryCacheSize(size: number): void;
        /**
         * 获取历史缓存大小
         * @returns {number}
         */
        getHistoryCacheSize(): number;
        /**
         * 加入历史记录
         * @param id
         * @param data
         * @param rootId
         */
        private addHistory(id, data, rootId);
        /**
         * 清空临时
         */
        clearHistory(): void;
        /**
         * 历史回退
         * @param term
         * @returns {yufp.core.Router}
         */
        back(term?: any): Deferred;
        /**
         * 路由跳转
         *
         * @returns {any}
         */
        to(...args: any[]): Deferred;
        /**
         * 装载
         * @param target
         * @param route
         * @apram cite
         * @param deferred
         * @returns {boolean}
         */
        mount(target: any, route: any, cite: any, deferred: Deferred): boolean;
        /**
         * 卸载
         * @param rootId
         * @returns {boolean}
         */
        unMount(rootId: string): boolean;
        /**
         * 判断元素是否为父子关系
         * @param parent
         * @param node
         */
        private isChildNode(parentId, childId);
        /**
         * 发送消息
         * @param id
         * @param type
         * @param message
         * @returns {any}
         */
        sendMessage(id: string, type: string, message: any): any;
    }
    /**
     * 导出router
     * @type {yufp.core.Router}
     */
    let router: Router;
}
/**
 * Created by jiangcheng on 2016/12/18.
 */
declare namespace yufp {
    /**
     * 导出os
     * @type {{}}
     */
    let os: any;
}
/**
 * Created by jiangcheng on 2016/08/15.
 */
declare namespace yufp {
    let extend: typeof core.Utils.extend;
    let require: core.Require;
    let router: core.Router;
    let logger: core.Logger;
    let eventproxy: core.EventProxy;
    let bus: core.Bus;
    let EventChain: typeof core.EventChain;
    /**
     * 配置函数
     */
    function config(setting: any): void;
}
