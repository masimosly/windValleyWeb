/**
 * Created by jiangcheng on 2017/11/13.
 */

/**
 * el-select-x
 */
(function (vue, $, name) {
    //注册select组件
    vue.component(name, {
        //模板
        template: '<el-select \
            v-model="selectedVal"   \
            :multiple="multiple" \
            :disabled="disabled"\
            :multiple-limit="multipleLimit"\
            :size="size" \
            :name="name"\
            :clearable="clearable" \
            :placeholder="placeholder"\
            :filterable="filterable"\
            :filter-method="filterMethod"\
            @change="change" \
            @visible-change="visibleChange" \
            @remove-tag="removeTag" \
            @clear="clear">\
              <el-option v-for="item in typeOptions" :key="item.key" :value="item.key" :label="item.value">\
                <slot name="option" :item="item"></slot>\
              </el-option>\
          </el-select>',

        props: {
            /** 字典类型 */
            props: {
                type: Object,
                default: function () {
                    return {key: "key", value: "value", label: "label"};
                }
            },
            /** 字典查询参数 */
            dataParams: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            /** 字典类型查询URL */
            dataUrl: String,
            /** 字典code */
            dataCode: String,
            /** 请求类型 */
            requestType: {
                type: String,
                default: 'GET'
            },
            jsonData: {
                type: String,
                default: 'data'
            },
            options: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            // 下述字段为el-select组件中部分属性，配置文档参见element-ui
            name: {
                type: String,
                default: "el-select-x"
            },
            size: String,
            disabled: {
                type: Boolean,
                default: false
            },
            clearable: {
                type: Boolean,
                default: true
            },
            multiple: Boolean,
            multipleLimit: {
                type: Number,
                default: 0
            },
            placeholder: {
                type: String,
                default: ''
            },
            filterable: {
                type: Boolean,
                default: true
            },
	    filterMethod: Function,
            options: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            value: {
                required: true
            }
        },

        data: function () {
            var selValue = this.multiple ? [] : "";
            selValue = this.value ? this.value : selValue;
            return {
                selectedVal: selValue,
                typeOptions: this.options
            }
        },
        watch: {
            selectedVal: function (val) {
                this.$emit('input', val)
            },
            value: function (val) {
                if (this.selectedVal !== val) {
                    this.selectedVal = val;
                }
            },
            dataUrl: function (url) {
                if (url) {
                    this.query();
                }
            },
            options: function (data) {
                if (data) {
                    this.typeOptions = data;
                }
            },
            dataCode: function (code) {
                if (code) {
                    var _this = this;
                    yufp.lookup.bind(code, function (options) {
                        _this.typeOptions = options;
                    });
                }
            }
        },
        created: function () {
            if (!this.dataUrl && !this.dataCode) {
                var listData = [];
                for (var i = 0, len = this.typeOptions.length; i < len; i++) {
                    var obj = this.typeOptions[i]
                    listData.push({key: obj[this.props.key], value: obj[this.props.value]})
                }
                this.typeOptions = listData;
            } else if (!this.dataUrl && this.dataCode) {
                var thiz = this;
                yufp.lookup.bind(this.dataCode, function (options) {
                    thiz.typeOptions = options;
                });
            } else {
                this.query()
            }
        },
        methods: {
            change: function (val) {
                this.$emit('change', val);
            },
            visibleChange: function (val) {
                this.$emit('visible-change', val)
            },
            removeTag: function (tag) {
                this.$emit('remove-tag', tag)
            },
            getSelectdText: function () {
                var text = "";
                for (var i = 0; i < this.typeOptions.length; i++) {
                    var obj = this.typeOptions[i];
                    if (obj[this.props.key] == this.selectedVal) {
                        text = obj[this.props.value];
                        break;
                    }
                }
                return text;
            },
            getSelectdValue: function (value) {
                return this.selectedVal;
            },
            setSelectdByValue: function (value) {
                var isok = false;
                for (var i = 0; i < this.typeOptions.length; i++) {
                    var obj = this.typeOptions[i];
                    if (obj[this.props.value] == value) {
                        this.selectedVal = obj[this.props.key];
                        isok = true;
                        break;
                    }
                }
                if (!isok) {
                    alert("值不存在");
                }
            },
            setSelectdByItem: function (item) {
                if (item && !isNaN(item)) {
                    if (this.typeOptions.length < item) {
                        alert("设置的item超出下拉选项");
                    } else {
                        this.selectedVal = this.typeOptions[item][this.props.key];
                    }
                } else {
                    alert("值不存在或不是数字");
                }
            },
            clear: function () {
                this.selectedVal = "";
            },
            query: function () {
                var _this = this;
                _this.typeOptions = [];
                yufp.service.request({
                    method: _this.requestType,
                    name: _this.dataUrl,
                    data: _this.dataParams,
                    callback: function (code, message, response) {
                        var data1 = _this.getObjectKey(response, _this.jsonData);
                        data1 = data1 && data1.length > 0 ? data1 : [];
                        for (var i = 0, len = data1.length; i < len; i++) {
                            var obj = data1[i];
                            if (obj[_this.props.key]) {
                                _this.typeOptions.push({key: obj[_this.props.key], value: obj[_this.props.value]});
                            }
                        }
                    }
                });
            },
            getObjectKey : function (obj, ns) {
                if (!ns) {
                    return obj;
                }
                var keys = ns.split('.');
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (!obj) {
                        break;
                    }
                    obj = obj[keys[i]];
                }
                return obj;
            }
        }

    });
})(Vue, yufp.$, "el-select-x");

/**
 * el-cascader-x
 */
(function (vue, $, name) {
    //注册cascader组件
    vue.component(name, {
        //模板
        template: '<el-cascader \
                    v-model="selectedVal"\
                    :show-all-levels="showAllLevels" \
                    :options="optionsData" \
                    :disabled="disabled" \
                    :placeholder="placeholder" \
                    :filterable="filterable" \
                    @active-item-change="activeItemChange" \
                    @change="change" \
                    :change-on-select="changeOnSelect"> \
                    </el-cascader>',
        props: {
            /** 字典类型 */
            props: {
                type: Object,
                default: function () {
                    return {value: "value", label: "label", children: "children"};
                }
            },
            /** 字典查询参数 */
            dataParams: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            /** 字典类型查询URL */
            dataUrl: String,
            /** 字典code */
            dataCode: String,
            /** 请求类型 */
            requestType: {
                type: String,
                default: 'GET'
            },
            jsonData: {
                type: String,
                default: 'data'
            },
            // 下述字段为el-cascader组件中部分属性，配置文档参见element-ui
            name: {
                type: String,
                default: "el-cascader-x"
            },
            size: String,
            disabled: Boolean,
            clearable: {
                type: Boolean,
                default: true
            },
            filterable: {
                type: Boolean,
                default: true
            },
            placeholder: {
                type: String,
                default: '请选择'
            },
            options: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            showAllLevels: {
                type: Boolean,
                default: false
            },
            hangeOnSelect: {
                type: Boolean,
                default: true
            },
            value: {
                required: true
            },
            changeOnSelect: {
                type: Boolean,
                default: false
            }
        },

        data: function () {
            return {
                selectedVal: [],
                active: '',
                item: '',
                optionsData: this.options
            }
        },
        watch: {
            selectedVal: function (val) {
                this.$emit('input', val);
            },
            value: function (val) {
                if (this.selectedVal !== val) {
                    this.selectedVal = val;
                }
            },
            dataUrl: function (url) {
                if (url) {
                    this.query();
                }
            },
            options: function (data) {
                if (data) {
                    this.optionsData = data;
                }
            },
            dataCode: function (code) {
                if (code) {
                    var _this = this;
                    yufp.lookup.bind(code, function (options) {
                        _this.optionsData = options;
                    });
                }
            }
        },
        created: function () {
            if (this.dataUrl) {
                this.query()
            } else if (!this.dataUrl && this.dataCode) {
                var _this = this;
                yufp.lookup.bind(this.dataCode, function (options) {
                    _this.optionsData = options;
                });
            }
        },
        methods: {
            change: function (val) {
                this.$emit('change', val)
            },
            activeItemChange: function (val) {
                this.$emit('active-item-change', val);
            },
            getSelectdText: function () {
                var lis = this.selectedVal;
                var res = [];
                for (var i = 0; i < this.optionsData.length; i++) {
                    var value = this.optionsData[i][this.props.value];
                    if (lis[0] == value) {
                        res[0] = this.optionsData[i][this.props.label];
                        var child1 = this.optionsData[i][this.props.children];
                        for (var j = 0; j < child1.length; j++) {
                            var value = child1[j][this.props.value];
                            if (lis[1] == value) {
                                res[1] = child1[j][this.props.label];
                                var child2 = child1[j][this.props.children];
                                for (var x = 0; x < child2.length; x++) {
                                    var value = child2[x][this.props.value];
                                    if (lis[2] == value) {
                                        res[2] = child2[x][this.props.label];
                                    }
                                }
                            }
                        }
                    }
                }
                return res;
            },
            getSelectdValue: function (value) {
                return this.selectedVal;
            },
            setSelectdByValue: function (list) {
                this.selectedVal = list;
            },
            clear: function () {
                this.selectedVal = [];
            },
            query: function (val, para) {
                var _this = this;
                if (!val) {
                    _this.optionsData = [];
                }
                var params;
                if (para) {
                    params = para;
                } else {
                    params = _this.dataParams;
                }
                yufp.service.request({
                    method: _this.requestType,
                    name: _this.dataUrl,
                    data: _this.params,
                    callback: function (code, message, response) {
                        var data1 = _this.getObjectKey(response, _this.jsonData);
                        data1 = data1 && data1.length > 0 ? data1 : [];
                        if (data1.length > 0 && !val) {
                            _this.optionsData = data1;
                        } else if (data1.length > 0 && val) {
                            if (val.length == 1) {
                                for (var i = 0; i < _this.optionsData.length; i++) {
                                    var value = _this.optionsData[i][_this.props.value];
                                    if (val[0] == value) {
                                        _this.optionsData[i][_this.props.children] = data1;
                                        break;
                                    }
                                }
                            } else if (val.length == 2) {
                                for (var i = 0; i < _this.optionsData.length; i++) {
                                    var value = _this.optionsData[i][_this.props.value];
                                    if (val[0] == value) {
                                        var child_ = _this.optionsData[i][_this.props.children];
                                        for (var j = 0; j < child_.length; j++) {
                                            var value = child_[j][_this.props.value];
                                            if (val[1] == value) {
                                                child_[j][_this.props.children] = data1;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            },
            loadCascaderData: function (para) {
                if (para.dataUrl) {
                    this.dataUrl = para.dataUrl;
                }
                this.query(para.value, para.para);
            },
            getObjectKey : function (obj, ns) {
                if (!ns) {
                    return obj;
                }
                var keys = ns.split('.');
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (!obj) {
                        break;
                    }
                    obj = obj[keys[i]];
                }
                return obj;
            }
        }

    });
})(Vue, yufp.$, "el-cascader-x");

/**
 * el-tree-x
 */
(function (vue, $, name) {
    vue.component(name, {
        props: {
            nodeKey: {
                type: String,
                default: 'id'
            },
            // dataAsync: {
            //     type: Boolean,
            //     default: false
            // },
            renderContent: Function,
            highlightCurrent: {
                type: Boolean,
                default: true
            },
            currentNodeKey: [String, Number],
            defaultExpandAll: Boolean,
            expandOnClickNode: {
                type: Boolean,
                default: true
            },
            autoExpandParent: {
                type: Boolean,
                default: true
            },
            defaultExpandedKeys: Array,
            showCheckbox: {
                type: Boolean,
                default: false
            },
            checkStrictly: Boolean,
            defaultCheckedKeys: Array,
            filterNodeMethod: Function,
            accordion: Boolean,
            indent: {
                type: Number,
                default: 16
            },
            dataUrl: String,
            dataId: {
                type: String,
                default: 'ID'
            },
            dataLabel: {
                type: String,
                default: 'NAME'
            },
            dataPid: {
                type: String,
                default: 'PID'
            },
            dataRoot: [String,Object],
            height: {
                type: Number,
                default: 400
            },
            rootVisible: {
                type: Boolean,
                default: true
            },
            dataParams: {
                type: Object,
                default: function () {
                    return {};
                }
            },
            /** 请求类型 */
            requestType: {
                type: String,
                default: 'GET'
            },
            jsonData: {
                type: String,
                default: 'data'
            },
            expandLevel:{
                type:Number,
                default:2
            },
            lazyLoad:{
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                orginalData: [],
                data: [{id: 0, label: '', children: []}],
                props: {children: 'children', label: 'label'},
                styleObj: {height: (this.height - 2) + 'px', overflow: 'auto'}
            }
        },
        methods: {
            filter: function (value) {
                return this.$children[0].filter(value)
            },
            getCheckedNodes: function (leafOnly) {
                return this.$children[0].getCheckedNodes(leafOnly);
            },
            getCheckedKeys: function (leafOnly) {
                return this.$children[0].getCheckedKeys(leafOnly);
            },
            setCheckedNodes: function (nodes, leafOnly) {
                this.$children[0].setCheckedNodes(nodes, leafOnly);
            },
            setCheckedKeys: function (keys, leafOnly) {
                this.$children[0].setCheckedKeys(keys, leafOnly);
            },
            setChecked: function (data, checked, deep) {
                this.$children[0].setChecked(data, checked, deep);
            },
            load:function(node, resolve){
            	var clickData= node.data;
            	var data=null;
            	var dataId=this.dataId;
            	var dataPid=this.dataPid;
            	if(clickData[dataId]){
            		//非加载根节点
            		var me = this;
	                var params={}
	                params[dataPid]=clickData[dataId];
            		yufp.service.request({
	                   url: me.dataUrl,
                        method: me.requestType,
                        data: params,
                        callback: function (code, message, response) {
                            var data = me.getObjectKey(response, me.jsonData) || [];
	                       var nodeArray=[];
	                       for(var i=0;i<data.length;i++){
	                       		data[i].id=data[i][me.dataId];
	                       		data[i].label=data[i][me.dataLabel];
	                       		data[i].pid=data[i][me.dataPid];
	                       		nodeArray.push(data[i])
	                       }
                	       return resolve(nodeArray);
	                   }
	               });
            		
            	}else{
            		//加载根节点
            		var me = this;
	                var params={};
	                params[dataId]=me.dataRoot
            		yufp.service.request({
                        url: me.dataUrl,
                        method: me.requestType,
                        data: params,
                        callback: function (code, message, response) {
                            var data = me.getObjectKey(response, me.jsonData) || [];
	                       var nodeArray=[];
	                       for(var i=0;i<data.length;i++){
	                       		data[i].id=data[i][me.dataId];
	                       		data[i].label=data[i][me.dataLabel];
	                       		data[i].pid=data[i][me.dataPid];
	                       		nodeArray.push(data[i])
	                       }
                	       return resolve(nodeArray);
	                   }
	               });
            	}
            },
            //触发事件类型、私有方法
            nodeClick: function (nodeData, node, self) {
//                 var isleaf = nodeData.ISLEAF;
                // if (!isleaf && nodeData.children.length == 0) {
                //     var idField = this.dataId;
                //     var pidField = this.dataPid;
                //     var levelunit = nodeData.LEVELUNIT;
                //     var param = {
                //         rootData: nodeData,
                //         LEVELUNIT: parseInt(levelunit) + 1
                //     };
                //     param[idField] = nodeData[idField];
                //     this.asyncData(param);
                //     node.expanded=true;
                // }
                this.$emit('node-click', nodeData, node, self)
            },
            checkChange: function (nodeData, checked, indeterminate) {
                this.$emit('check-change', nodeData, checked, indeterminate)
            },
            currentChange: function (nodeData, node, self) {
                this.$emit('current-change', nodeData, node, self)
            },
            nodeExpand: function (nodeData, node, instance) {
                this.$emit('node-expand', nodeData, node, instance)
            },
            nodeCollapse: function (nodeData, node, self) {
                this.$emit('node-collapse', nodeData, node, self)
            },
            asyncData: function (params) {
               var me = this;
               yufp.service.request({
                   url: me.dataUrl,
                   method: me.requestType,
                   data: params,
                   callback: function (code, message, response) {
                       var data = me.getObjectKey(response, me.jsonData) || [];
                       return data;
                   }
               });
           },
            remoteData: function () {
                var me = this;
                yufp.service.request({
                    url: me.dataUrl,
                    method: me.requestType,
                    data: me.dataParams,
                    callback: function (code, message, response) {
                        var data = me.getObjectKey(response, me.jsonData) || [];
                        me.orginalData = data;
                        me.$emit("get-tree-datas", me.orginalData);
                        // data = me.array2tree({data: data, root: me.dataRoot});
                        // me.data = me.rootVisible ? [data]: data.children;
                        data=me.genTreeData(data);
                        me.data = me.rootVisible ? data: data[0].children;
                        setTimeout(function () {
                            // 默认展开根节点
                            me.expandNode();
                        }, 1);
                    }
                });
            },
            array2tree: function (params) {
                var data = params.data;
                var idField = this.dataId;
                var labelField = this.dataLabel;
                var pidField = this.dataPid;
                var children = [], tempObj = {};
                tempObj[idField] = params.root;
                var root = typeof params.root === 'object' ? params.root : tempObj;
                var rId = '' + root[idField];
                for (var i in data) {
                    var d = data[i];
                    if (rId === '' + d[idField]) {
                        root = d;
                    } else if (rId === '' + d[pidField]) {
                        children.push(d);
                    }
                }
                root.id = root[idField];
                root.label = root[labelField];
                root.children = children;
                for (var i = 0, len = root.children.length; i < len; i++) {
                    root.children[i] = this.array2tree({data: data, root: root.children[i]});
                }
                return root;
            },
            genTreeData:function(data){
                var me=this;
                var attr={
                    id:me.dataId,
                    label:me.dataLabel,
                    pid:me.dataPid,
                    root:me.dataRoot
                };
                return yufp.util.genTree(data,attr);
            },
            // 只会默认展示第一个子节点
            expandNode:function(){
                var me = this;
                var temp = me.$children[0].root.childNodes[0];
                if(!me.defaultExpandAll){
                     for (i = 0; i < me.expandLevel; i++) {
                        if (temp) {
                            temp.expanded = true;
                            temp = temp.childNodes[0];
                        }
                    }
                }
            },
            getObjectKey : function (obj, ns) {
                if (!ns) {
                    return obj;
                }
                var keys = ns.split('.');
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (!obj) {
                        break;
                    }
                    obj = obj[keys[i]];
                }
                return obj;
            }
        },
        created:function(){
        	var lazyrender=this.lazyLoad?'lazy="" ':'';
        	var renderXtemplate=function(){
        	    var template = '<el-tree class="el-tree-x" :style="styleObj" :node-key="nodeKey" '+lazyrender+' :load="load" :render-content="renderContent" :highlight-current="highlightCurrent"\
		        :current-node-key="currentNodeKey" :default-expand-all="defaultExpandAll" :expand-on-click-node="expandOnClickNode"\
		        :auto-expand-parent="autoExpandParent" :default-expanded-keys="defaultExpandedKeys" :show-checkbox="showCheckbox"\
		        :check-strictly="checkStrictly" :default-checked-keys="defaultCheckedKeys" :filter-node-method="filterNodeMethod"\
		        :accordion="accordion" @node-click="nodeClick" @check-change="checkChange"\
		        @current-change="currentChange" @node-expand="nodeExpand" @node-collapse="nodeCollapse"\
		        :data="data" :props="props" ></el-tree>';
		        return template;
        	}
        	this.$options.template = renderXtemplate.call(this);
        },
        mounted: function () {
            if (!this.lazyLoad) {
                this.remoteData()
            }else{}
        },
        watch: {
            dataUrl: function(val){
                this.remoteData();
            },
            dataParams:function(val){
                this.remoteData();
            }
        }
    })
})(Vue, yufp.$, "el-tree-x");

/**
 * el-table-x
 */
(function (Vue, $, name) {
    Vue.component(name, {
        props: {
            height: [String, Number],
            maxHeight: [String, Number],
            fit: {
                type: Boolean,
                default: true
            },
            stripe: {
                type: Boolean,
                default: true
            },
            border: {
                type: Boolean,
                default: true
            },
            rowKey: [String, Function],
            showHeader: {
                type: Boolean,
                default: true
            },
            //默认参数
            baseParams:{
                type: Object,
                default: function () {
                    return null;
                }
            },
          	//是否开启隐藏列
            hideColumn:{
                type: Boolean,
                default: false
            },
            showSummary: Boolean,
            sumText: String,
            summaryMethod: Function,
            rowClassName: [String, Function],
            rowStyle: [Object, Function],
            highlightCurrentRow: {
                type: Boolean,
                default: true
            },
            currentRowKey: [String, Number],
            emptyText: String,
            expandRowKeys: Array,
            defaultExpandAll: Boolean,
            defaultSort: Object,
            tooltipEffect: String,
            defaultLoad: {
                type: Boolean,
                default: true
            },
            pageable: {
                type: Boolean,
                default: true
            },
            dataUrl: String,
            dataParams: {
                type: Object,
                default: function () {
                    return {};
                }
            },
	    /**请求类型**/
	    requestType: {
                type: String,
                default: 'GET'
            },
            rowIndex: Boolean,
            radiobox: {
                type: Boolean
            },
            checkbox: {
                type: Boolean,
                default: false
            },
            tableColumns: {
                type: Array,
                default: function () {
                    return []
                }
            },
            tableFilters: Object,
            jsonData: {
                type: String,
                default: 'data'
            },
            jsonTotal: {
                type: String,
                default: 'total'
            },
            pageKey: {
                type: String,
                default: 'page'
            },
            sizeKey: {
                type: String,
                default: 'size'
            },
            conditionKey: {
                type: String,
                default: 'condition'
            }
        },
        data: function () {
            return {
                radio: '',
                data: [],
                total: 0,
                queryParam: {},
                page: 1,
                size: 10,
                loading: false,
                selections: [],
                _tc: [],
                tableKey: 0,
                contextMenuId: 'c_menu_id_' + new Date().getTime()
            }
        },
        methods: {
            pageChangeFn: function (val) {
                this.page = val
                this.remoteData()
            },
            sizeChangeFn: function (val) {
                this.page = 1
                this.size = val
                this.remoteData()
            },
            /**
             * private 获取namespace数据
             * @param obj 待获取对象
             * @param ns namespace，如：'json.data'
             * @returns {*}
             */
            getObjectKey : function (obj, ns) {
                if (!ns) {
                    return obj;
                }
                var keys = ns.split('.');
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (!obj) {
                        break;
                    }
                    obj = obj[keys[i]];
                }
                return obj;
            },
            remoteData: function (queryParam) {
                var me = this;
                me.data = [];
                me.selections = [];
                me.loading = true;
                if (!me.dataUrl) {
                    throw new Error("ElTableX dataUrl参数未配置");
                    return;
                }
                me.queryParam = queryParam ? queryParam : me.queryParam;

                queryParam = yufp.extend(true, {}, me.queryParam);
                var baseParams = yufp.extend(true, {}, me.baseParams);

                var bCondition = baseParams[me.conditionKey];
                var qCondition = queryParam[me.conditionKey];
                if (bCondition) {
                    if (qCondition) {
                        bCondition = typeof bCondition == 'object' ? bCondition : JSON.parse(bCondition);
                        qCondition = typeof qCondition == 'object' ? qCondition : JSON.parse(qCondition);
                        yufp.extend(true, bCondition, qCondition);
                    }
                    queryParam[me.conditionKey] = typeof bCondition == 'object' ? JSON.stringify(bCondition) : bCondition;
                } else if (qCondition) {
                    queryParam[me.conditionKey] = typeof qCondition == 'object' ? JSON.stringify(qCondition) : qCondition;
                }
                delete baseParams[me.conditionKey];
                queryParam = yufp.extend(baseParams, queryParam);
                if (me.pageable) {
                    var pageObj = {};
                    pageObj[me.pageKey] = me.page;
                    pageObj[me.sizeKey] = me.size;
                    yufp.extend(queryParam, pageObj);
                }
                yufp.service.request({
                    url: me.dataUrl,
                    data: queryParam,
                    method: me.requestType,
                    callback: function (code, message, response) {
                        me.data = me.getObjectKey(response, me.jsonData) || [];
                        me.total = me.getObjectKey(response, me.jsonTotal) || 0;
                        me.loading = false;
                    }
                });
            },

            clearSelection: function (selection) {
                return this.$children[0].clearSelection(selection);
            },
            toggleRowSelection: function (row, selected) {
                return this.$children[0].toggleRowSelection(row, selected);
            },
            setCurrentRow: function (row) {
                return this.$children[0].setCurrentRow(row);
            },
            //触发event类型方法
            select: function (selection, row) {
                this.$emit('select', selection, row)
            },
            selectAll: function (selection) {
                this.$emit('select-all', selection)
            },
            selectionChange: function (selection) {
                this.selections = selection
                this.$emit('selection-change', selection)
            },
            cellMouseEnter: function (row, column, cell, event) {
                this.$emit('cell-mouse-enter', row, column, cell, event)
            },
            cellMouseLeave: function (row, column, cell, event) {
                this.$emit('cell-mouse-leave', row, column, cell, event)
            },
            cellClick: function (row, column, cell, event) {
                this.$emit('cell-click', row, column, cell, event)
            },
            cellDblclick: function (row, column, cell, event) {
                this.$emit('cell-dblclick', row, column, cell, event)
            },
            rowClick: function (row, event, column) {
                if (!this.checkbox) {
                    this.setCurrentRow(row)
                    this.radio = row.id
                    this.selections = [ row ]
                } 
                else {
                    this.$children[0].toggleRowSelection(row);
                }
                this.$emit('row-click', row, event, column)
            },
            rowContextmenu: function (row, event) {
                this.$emit('row-contextmenu', row, event)
            },
            rowDblclick: function (row, event) {
                if (!this.checkbox) {
                    this.selections = [row]
                }
                this.$emit('row-dblclick', row, event)
            },
            headerClick: function (column, event) {
                this.$emit('header-click', column, event)
            },
            sortChange: function (obj) {
            	if(!obj.column){
            		return
            	}
            	var st = obj.column.sortable;
            	if(st&&(st=="custom")){
            		var order = obj.order.replace("ending","");
            		this.remoteData({
						sort:obj.prop+','+order
					});
            	}else{
            		this.$emit('sort-change', obj)
            	}
            },
            currentChange: function (currentRow, oldCurrentRow) {
                this.$emit('current-change', currentRow, oldCurrentRow)
            },
            /**
             * 表头右键菜单选项改变
             * @param {Object} e
             */
            headerContextChange: function (e) {
                this.$nextTick(function () {
                    var ex = e.target.parentElement.parentElement;
                    var label = ex.getAttribute('labels');
                    var flag = ex.childNodes[0].className.indexOf('is-checked');
                    flag = flag > 0 ? true : false;
                    var tc = this.tableColumns;
                    for (var i = 0; i < tc.length; i++) {
                        if (tc[i].label == label) {
                            //找到和多选对应的列
                            this.tableColumns[i].hidden = !flag;
                            this.tableKey++;
                            return;
                        }
                        //判断二级
                        if (tc[i].children) {
                            for (var j = 0; j < tc[i].children.length; j++) {
                                if (tc[i].children[j].label == label) {
                                    //找到和多选对应的列
                                    this.tableColumns[i].children[j].hidden = !flag;
                                    //循环此节点的所有子节点都已取消
                                    tf:for (var m = 0; m < this.tableColumns[i].children.length; m++) {
                                        if (this.tableColumns[i].children[m].hidden == false) {
                                            this.tableColumns[i].hidden = false;
                                            break tf;
                                        }
                                        this.tableColumns[i].hidden = true;

                                    }
                                    this.tableKey++;
                                    return;
                                }
                            }
                        }
                    }
                })
            },
            /**
             * 表头右键监听
             * @param e:鼠标事件
             * @param v:vue
             */
            contextMenuFun:function(e,v){
            	var contextmenuTab=v.$parent.$el.querySelector('#'+v.contextMenuId)
            	v.openMenu(contextmenuTab,e);
            	contextmenuTab.removeEventListener('mouseleave',function(e){
        			v.closeMenu(contextmenuTab);
        		});
        		contextmenuTab.addEventListener('mouseleave',function(e){
        			v.closeMenu(contextmenuTab);
        		});
            },
             openMenu:function(contextmenuTab,e){
           		contextmenuTab.style.left=e.clientX+'px';
				contextmenuTab.style.top=e.clientY+'px';
           		contextmenuTab.style.display='block';
           	
            },
            closeMenu:function(contextmenuTab){
           		contextmenuTab.style.display='none';
            },
            /**
             * 外部自定义事件方法
             * @param eventName
             * @param scope
             * @param other
             */
            _$event: function (eventName, scope, params) {
                this.$emit(eventName, scope, params);
            },
        },
        computed: {
            firstColumnType: function () {
                return this.checkbox ? 'selection' : 'index'
            }
        },
        watch: {
            tableColumns: function () {
                this.tableKey++;
            },
            dataUrl: function () {
                this.page = 1;
                this.remoteData();
            },
            dataParams: function (val) {
                this.queryParam = val;
            }
        },
        created: function () {
            var renderFormatter = function (tableColumns) {
                var formatterFn = function (dataCode, fn) {
                    return function (row, column) {
                        var val = yufp.lookup.convertKey(dataCode, row[column.property]);
                        return yufp.type(fn) == 'function' ? fn(row, column, val) : val;
                    };
                };
                if (tableColumns) {
                    for (var i = 0, len = tableColumns.length; i < len; i++) {
                        var tc = tableColumns[i];
                        if (tc.dataCode) {
                            tc.formatter = formatterFn(tc.dataCode, tc.formatter);
                        }
                    }
                }
            };
            var renderXtemplate = function (tableColumns) {
                if (!tableColumns) {
                    return '<div class="el-table-x"></div>';
                }
                var props = ['type','column-key', 'label', 'prop', 'width','hidden'

                    , 'min-width', 'fixed', 'render-header', 'sortable', 'sort-method'
                    , 'resizable', 'formatter', 'show-overflow-tooltip', 'align', 'header-align'
                    , 'class-name', 'label-class-name', 'selectable', 'reserve-selection', 'filters'
                    , 'filter-placement', 'filter-multiple', 'filter-method', 'filtered-value'];
                var joinProp = function (varPrefix, tc, flag) {
                    var str = ' :key="' + varPrefix + '"';
                    varPrefix += '.';
                    for (var i = 0, len = props.length; i < len; i++) {
                        var key = props[i];
                        var value = key.replace(/\-(\w)/g, function (all, letter) {
                            return letter.toUpperCase();
                        })
                        if (tc.hasOwnProperty(value) ) {//&& (!flag || (flag && key != 'prop'))此代码影响排序prop获取
                            if(value!='hidden'){
                            	str += ' :' + key + '="' + varPrefix + value + '"';
                            }else{
                            	str += ' v-if="!' + varPrefix + value + '"';
                            }
                        }
                    }
                    return str;
                }
                var menuTpl = '<div class="yu-gridContextMenu" :id="contextMenuId" >';
                for(var i=0;i<tableColumns.length;i++){
                	var hidden = tableColumns[i].label;
                	if(!tableColumns[i].children){
                		menuTpl+='<el-checkbox @change="headerContextChange" :checked=!'+tableColumns[i].hidden+' labels="'+tableColumns[i].label+'">'+hidden+'</el-checkbox>';
                	}
                	//二级表头
                	if(tableColumns[i].children){
                		for(var j=0;j<tableColumns[i].children.length;j++){
                			menuTpl+='<el-checkbox @change="headerContextChange" :checked=!'+tableColumns[i].hidden+' labels="'+tableColumns[i].children[j].label+'">'+tableColumns[i].children[j].label+'</el-checkbox>';
                		}
                	}
                }
                menuTpl+='</div>'
                var prefixTpl = '<div class="el-table-x">'
//              	prefixTpl+=menuTpl;
                    prefixTpl+='<el-table  :key="tableKey" :data="data" :height="pageable?(height-48):height" :max-height="pageable?(maxHeight-48):maxHeight" :fit="fit"\
                      :stripe="stripe" :border="border" :row-key="rowKey" :show-header="showHeader"\
                      :show-summary="showSummary" :sum-text="sumText" :summary-method="summaryMethod"\
                      :row-class-name="rowClassName" :row-style="rowStyle" :highlight-current-row="checkbox?false:highlightCurrentRow"\
                      :current-row-key="currentRowKey" :empty-text="emptyText" :expand-row-keys="expandRowKeys"\
                      :default-expand-all="defaultExpandAll" :default-sort="defaultSort" :tooltip-effect="tooltipEffect"\
                      @select="select" @select-all="selectAll" @selection-change="selectionChange" @cell-dblclick="cellDblclick"\
                      @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @cell-click="cellClick"\
                      @row-click="rowClick" @row-contextmenu="rowContextmenu" @row-dblclick="rowDblclick" @header-click="headerClick"\
                      @sort-change="sortChange" @current-change="currentChange">';
                    var ifradio = this.radiobox;
                if (this.rowIndex) {
                    prefixTpl += '<el-table-column type="index" width="65"></el-table-column>';
                }
                if (this.checkbox) {
                    prefixTpl += '<el-table-column type="selection" width="65"></el-table-column>';
                } 
                else if (this.radiobox) {
                    prefixTpl += '<el-table-column type="index" width="35">\
                        <template scope="scope">\
                        <el-radio class="radio" v-model="radio" :label="scope.row.id"></el-radio>\
                        </template>\
                        </el-table-column>'
                    }
                var suffixTpl = '</el-table>';
                	suffixTpl+=menuTpl;
                    suffixTpl+='<el-pagination v-show="pageable" :total="total" :current-page.sync="page" :page-size="size"\
                      @size-change="sizeChangeFn" @current-change="pageChangeFn"\
                      layout="total, sizes, prev, pager, next, jumper">\
                    </el-pagination>\
                    </div>';
                //循环一级表头
                var middleTpl = '';
                for (var i = 0, ilen = tableColumns.length; i < ilen; i++) {
                    var tc = tableColumns[i], flag = yufp.type(tc.template) == 'function';
                    middleTpl += '<el-table-column ';
                    middleTpl += joinProp('tableColumns[' + i + ']', tc, flag);
                    middleTpl += '>';
                    middleTpl += flag ? tc.template() : '';
                    if (tc.children) {
                        //循环二级表头
                        for (var j = 0, jlen = tc.children.length; j < jlen; j++) {
                            var tc1 = tc.children[j], flag1 = yufp.type(tc1.template) == 'function';
                            middleTpl += '<el-table-column ';
                            middleTpl += joinProp('tableColumns[' + i + '].children[' + j + ']', tc1, flag1);
                            middleTpl += '>';
                            middleTpl += flag1 ? tc1.template() : '';
                            if (tc1.children) {
                                //循环三级表头
                                for (var k = 0, klen = tc1.children.length; k < klen; k++) {
                                    var tc2 = tc1.children[k], flag2 = yufp.type(tc2.template) == 'function';
                                    middleTpl += '<el-table-column ';
                                    middleTpl += joinProp('tableColumns[' + i + '].children[' + j + '].children[' + k + ']', tc2, flag2);
                                    middleTpl += '>';
                                    middleTpl += flag2 ? tc2.template() : '';
                                    middleTpl += '</el-table-column>';
                                }
                            }
                            middleTpl += '</el-table-column>';
                        }

                    }
                    middleTpl += '</el-table-column>';
                }
                return prefixTpl + middleTpl + suffixTpl;
            };
            //初始化是否显示
            var tableColumns = this.$options.propsData.tableColumns;
            for(var i = 0;i<tableColumns.length;i++){
            	if(!tableColumns[i].hidden){
            		tableColumns[i].hidden=false;
            	}
            	//初始化二级
            	if(tableColumns[i].children){
            		for(var j=0;j<tableColumns[i].children.length;j++){
            			if(!tableColumns[i].children[j].hidden){
            				tableColumns[i].children[j].hidden=false;
            			}
	            		//初始化三级
//	            		if(tableColumns[i].children[j].children){
//	            			for(var m=0;m<tableColumns[i].children[j].children.length;m++){
//		            			tableColumns[i].children[j].children[m].hidden=true;
//		            		}
//	            		}
	            		
	            	}
            	}
            	
            }
            renderFormatter.call(this, tableColumns);
            this.$options.template = renderXtemplate.call(this, tableColumns);
            this.$options.filters = this.$options.propsData.tableFilters;
        },
        updated:function(){
        	var _this = this;
        	if(_this.hideColumn){
        		var thead = this.$el.querySelector('.el-table__header-wrapper');
	        	thead.removeEventListener('contextmenu',function(e){
	        		e.preventDefault();
	        		_this.contextMenuFun(e,_this);
	        	
	        	}),
	        	thead.addEventListener('contextmenu',function(e){
	        		e.preventDefault();
	        		_this.contextMenuFun(e,_this);
	        	});
        	}
        },
        mounted: function () {
        	
            this.queryParam = this.dataParams;
            if (this.defaultLoad) {
                this.remoteData()
            }
            
        }

    })
})(Vue, yufp.$, "el-table-x");

/**
 * el-radio-x
 */
(function (vue, $, name) {
    // 注册单选框组件
    vue.component(name, {
        //模版
        template: '<el-radio-group v-model="radio" :disabled="disabled" :name="name" @change="change">\
          <template v-if="!optionButton">\
            <el-radio v-for="item in radioData" :label="item.value" :key="item.key" :disabled="disabled"></el-radio>\
          </template>\
          <template v-else>\
            <el-radio-button v-for="item in radioData" :label="item.value" :key="item.key" :disabled="disabled"></el-radio-button>\
          </template>\
        </el-radio-group>',

        props: {
            disabled: Boolean,
            name: String,
            dataUrl: String,
            defaultVal: String,
            dataCode: String,
            /** 字典查询参数 */
            dataParams: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            /** 请求类型 */
            requestType: {
                type: String,
                default: 'GET'
            },
            jsonData: {
                type: String,
                default: 'data'
            },
            options: {
                type: Array,
                default: function () {
                    return []
                }
            },
            value: {
                type: '',
                required: true
            },
            //选项是否为button，默认false
            optionButton: Boolean
        },

        mounted: function () {
            var _this = this;
            if (this.options) {
                var listData = [];
                for (var i = 0, len = this.options.length; i < len; i++) {
                    var obj = this.options[i]
                    listData.push({value: obj.value, key: obj.key})
                }
                this.radioData = listData;
            }
            if (this.dataUrl) {
                this.query()
            }
            if (this.dataCode) {
                this.setradioData(this.dataCode);
            }
        },
        data: function () {
            return {
                radio: this.defaultVal,
                radioData: '',
            }
        },
        watch: {
            dataCode: function (val) {
                this.setradioData(val);
            },
            radio: function (val) {
                this.$emit('input', val)
            },
            value: function (val) {
                if (this.radio !== val) {
                    this.radio = val
                }
            }
        },
        methods: {
            query: function () {
                var me = this;
                yufp.service.request({
                    method: me.requestType,
                    url: this.dataUrl,
                    data: this.dataParams,
                    callback: function (code, message, response) {
                        var data = me.getObjectKey(response, me.jsonData) || []
                        // var data = [{option: '北京',disabled: false },{option: '上海',disabled: true},{option: '广州',disabled: false },{option: '成都',disabled: false }]
                        data = data && data.length > 0 ? data : []
                        for (var i = 0; i < data.length; i++) {
                            var obj = data[i]
                            me.radioData.push({value: obj.value, key: obj.key})
                        }
                    }
                })
            },
            setradioData: function (dataCode) {
                var _this = this;
                yufp.lookup.bind(dataCode, function (options) {
                    _this.radioData = options;
                });
            },
            change: function (val) {
                for (var i = 0; i < this.radioData.length; i++) {
                    if (val == this.radioData[i].value) {
                        this.$emit('change', this.radioData[i].key)
                    }
                }
            },
            getObjectKey : function (obj, ns) {
                if (!ns) {
                    return obj;
                }
                var keys = ns.split('.');
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (!obj) {
                        break;
                    }
                    obj = obj[keys[i]];
                }
                return obj;
            }
        }
    })
})(Vue, yufp.$, 'el-radio-x');

/**
 * el-checkbox-x
 */
(function (vue, $, name) {
    vue.component(name, {
        template: '<el-checkbox-group v-model="checklist" :min="min"\
        :max="max" :name="name" @change="change">\
          <template v-if="!optionButton">\
            <el-checkbox v-for="item in checkdata" :label="item.value" :key="item.key" :disabled="disabled"></el-checkbox>\
          </template>\
          <template v-else>\
            <el-checkbox-button v-for="item in checkdata" :label="item.value" :key="item.key" :disabled="disabled"></el-checkbox-button>\
          </template>\
        </el-checkbox-group>',

        props: {
            min: Number,
            max: Number,
            disabled: Boolean,
            name: String,
            dataUrl: String,
            dataCode: String,
            /** 字典查询参数 */
            dataParams: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            /** 请求类型 */
            requestType: {
                type: String,
                default: 'GET'
            },
            jsonData: {
                type: String,
                default: 'data'
            },
            options: {
                type: Array,
                default: function () {
                    return []
                }
            },
            value: {
                required: true
            },
            //选项是否为button，默认flase
            optionButton: Boolean
        },

        created: function () {
            if (this.options) {
                var listData = [];
                for (var i = 0, len = this.checkdata.length; i < len; i++) {
                    var obj = this.checkdata[i]
                    listData.push({value: obj.value, key: obj.key})
                }
                this.checkdata = listData;
            }
            if (this.dataUrl) {
                this.query()
            }
            if (this.dataCode) {
                this.setcheckData(this.dataCode);
            }
        },

        watch: {
            dataCode: function (val) {
                this.setcheckData(val);
            },
            checklist: function (val) {
                this.$emit('input', val)
            },
            value: function (val) {
                if (this.checklist !== val) {
                    this.checklist = val
                }
            }
        },

        data: function () {
            return {
                checklist: [],
                checkdata: this.options
            }
        },

        methods: {
            change: function (val) {
                var checkid = [];
                for (var j = 0; j < val.length; j++) {
                    for (var i = 0; i < this.checkdata.length; i++) {
                        if (val[j] == this.checkdata[i].value) {
                            checkid.push(this.checkdata[i].key);
                        }
                    }
                }
                this.$emit('change', checkid)
            },
            setcheckData: function (dataCode) {
                var _this = this;
                yufp.lookup.bind(dataCode, function (options) {
                    _this.checkdata = options;
                });
            },
            query: function () {
                var me = this;
                yufp.service.request({
                    method: this.requestType,
                    url: this.dataUrl,
                    data: this.dataParams,
                    callback: function (code, message, response) {
                        var data = me.getObjectKey(response, me.jsonData) || []
                        data = data && data.length > 0 ? data : []
                        for (var i = 0; i < data.length; i++) {
                            var obj = data[i]
                            me.checkdata.push({value: obj.value, key: obj.key})
                        }
                    }
                })
            },
            getObjectKey : function (obj, ns) {
                if (!ns) {
                    return obj;
                }
                var keys = ns.split('.');
                for (var i = 0, len = keys.length; i < len; i++) {
                    if (!obj) {
                        break;
                    }
                    obj = obj[keys[i]];
                }
                return obj;
            }
        }
    })
})(Vue, yufp.$, 'el-checkbox-x');

/**
 * el-dialog-x
 */
(function (vue, $, name) {
    vue.component(name, {
        template: '<el-dialog\
          :style="styleRoot" :title="title" :modal="modal" v-if="dialogVisible" :visible.sync="dialogVisible" :modal-append-to-body="modalAppendToBody" :lock-scroll="lockScroll" \
          :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape"\
          :show-close="showClose" :size="xSize" :custom-class="customClass" :top="top"\
          :before-close="beforeClose" class="el-dialog__wrapper-x">\
        <template v-if="$slots.title" slot="title"><slot name="title"></slot></template>\
        <div v-if="height" :style="styleBody"><slot></slot></div>\
        <template v-else><slot></slot></template>\
        <template v-if="$slots.footer || needBar" slot="footer">\
        <el-button v-if="needBar" type="primary" icon="yx-undo2" @click="dialogVisible=false">{{cancelText}}</el-button>\
        <el-button v-if="needBar" type="primary" icon="check" @click="sureFn">{{sureText}}</el-button>\
        <slot name="footer"></slot>\
        </template>\
        </el-dialog>',
        props: {
            width: String,
            height: String,

            needBar : Boolean,
            sureFn : {
                type: Function,
                default: function () { }
            },
            cancelText: {
                type: String,
                default: '取消'
            },
            sureText: {
                type: String,
                default: '确认'
            },
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            modal: {
                type: Boolean,
                default: true
            },
            size: {
                type: String,
                default: 'x'
            },
            modalAppendToBody: {
                type: Boolean,
                default: true
            },
            lockScroll: {
                type: Boolean,
                default: true
            },
            closeOnClickModal: {
                type: Boolean,
                default: false
            },
            closeOnPressEscape: {
                type: Boolean,
                default: false
            },
            showClose: {
                type: Boolean,
                default: true
            },
            customClass: {
                type: String,
                default: ''
            },
            top: {
                type: String,
                default: '15%'
            },
            beforeClose: Function,
            appendToBody: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            return {
                dialogVisible: this.visible
            }
        },
        watch: {
            visible: function (val) {
                this.dialogVisible = val;
                if (val) {
                    if (this.appendToBody) {
                        document.body.appendChild(this.$el);
                    }
                }
            },
            dialogVisible: function (val) {
                this.$emit('update:visible', val);
                if (val) {
                    if (this.appendToBody) {
                        document.body.appendChild(this.$el);
                    }
                }
            }
        },
        computed: {
            xSize: function () {
                return this.size != 'full' ? 'x' : 'full';
            },
            styleRoot: function () {
                var ow = this.width;
                var nw = '50%', ml = '-25%';
                if (ow && ow != 'auto'){
                    nw = ow;
                    ml = '-' + (parseInt(ow, 10) / 2);
                    var pix = /^\d+(px)?$/i, percent = /^\d+%$/i;
                    ml += pix.test(ow) ? 'px' : '%';
                }
                return this.size!='x'?{}:{ width: nw, left: '50%', marginLeft: ml };
            },
            styleBody: function () {
                return this.size!='x'?{}:{height: this.height, overflow: 'hidden', overflowY: 'auto'};
            }
        },
        mounted :function(){
            if (this.dialogVisible) {
                if (this.appendToBody) {
                    document.body.appendChild(this.$el);
                }
            }
        }
    });
})(Vue, yufp.$, 'el-dialog-x');

/**
 * 富文本
 */
(function (vue, $, name) {
    vue.component(name, {
      template:'<textarea class="tinymce-textarea" :id="id" :action="action"></textarea>',
      name: "tinymce",
      props: {
        busNo: String,
        action: String,
        readonly: Boolean,
        value: {
          type: String,
          default: ""
        },
        id: String,
        toolbar: {
          type: Array,
          default: function(){
            return [
              "removeformat undo redo |  bullist numlist | outdent indent | forecolor | fullscreen code",
              "bold italic blockquote | h2 p | image media link | alignleft aligncenter alignright | table"
            ];
          }
        },
        menubar: {
          default: ""
        },
        height: {
          type: Number,
          required: false,
          default: 360
        }
      },
        data: function () {
            return {
                disabled: this.readonly,
                hasChange: false,
                hasInit: false,
                //保存上传文件对象
                filedata: [],
                //富文本编辑前内容
                content: '',
            }
        },
      watch: {
        value: function(val) {
          if (!this.hasChange && this.hasInit) {
            this.$nextTick(function(){
                window.tinymce.get(this.id).setContent(val)
            });
          }
       },
       disabled: function(val) {
       	var _this = this;
       	if(!this.hasInit) {
       		setTimeout(
	       		function(){
	       			window.tinymce.get(_this.id).getBody().setAttribute('contenteditable', !val)
	       		},1000)
       	} else {
       		window.tinymce.get(_this.id).getBody().setAttribute('contenteditable', !val);
       	}
       }
      },
      mounted: function(){
        var _this = this;
        window.tinymce.init({
          selector: 'textarea#' + _this.id,
          height: _this.height,
          body_class: "panel-body ",
          object_resizing: false,
          toolbar: _this.toolbar,
          menubar: _this.menubar,
          language: 'zh_CN',
          plugins:
            "advlist,autolink,code,paste,textcolor, colorpicker,fullscreen,link,lists,media,wordcount,image,imagetools,table",
          end_container_on_empty_block: true,
          powerpaste_word_import: "clean",
          code_dialog_height: 450,
          code_dialog_width: 1000,
          advlist_bullet_styles: "square",
          advlist_number_styles: "default",
          block_formats: "普通标签=p;小标题=h2;",
          imagetools_cors_hosts: [
            "wpimg.wallstcn.com",
            "wallstreetcn.com"
          ],
          media_live_embeds: true,
          imagetools_toolbar: "watermark",
          default_link_target: "_blank",
          link_title: false,
          images_upload_url:_this.action,
          image_title: true, 
          file_picker_types: "file image media",
        //   audio_template_callback: function(data) {
        //     return '<audio controls>' + '\n<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + '</audio>';
        //   },
        //   video_template_callback: function(data) {
        //     return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls">\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>';
        //   },
        images_upload_handler: function (blobInfo, success, failure) {
            var xhr, formData;
        
            var xhr=null;
            if(window.XMLHttpRequest){
                xhr=new XMLHttpRequest();
            }else if(window.ActiveXObject){
                xhr=new ActiveXObject("Microsoft.XMLHTTP");
            }else{
                yufp.$message("你的浏览器不支持XMLHttp!","提示");
                return;
            }
            xhr.withCredentials = false;
            var url =  yufp.service.getUrl({url:backend.adminService + _this.action});
            xhr.open('POST', url);
            xhr.setRequestHeader("Authorization",'Bearer ' + yufp.service.getToken());
            xhr.setRequestHeader('busNo', _this.busNo);
            xhr.onload = function() {
              var json;
        
              if (xhr.status != 200) {
                failure('HTTP Error: ' + xhr.status);
                return;
              }
        
              json = JSON.parse(xhr.responseText);
              var file = {};
              var filePath = json.data.filePath;
              var fileId = json.data.fileId;
              file.fileId = fileId;
              file.filePath = filePath;
              _this.filedata.push(file);
              if (!json || typeof  filePath!= 'string') {
                failure('Invalid JSON: ' + xhr.responseText);
                return;
              }
              var path = 'http://' + backend.remote + '/' + json.data.filePath + '?' + 'pathtrs'
              success(path);
            };
            
            formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());
            formData.append('busNo',_this.busNo);
            xhr.send(formData);
          },
          file_picker_callback: function(cb, value, meta) {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("id", "tinymceUpload");
//          input.click();
            // input.setAttribute("accept", "image/*");
			document.body.appendChild(input);
			document.getElementById('tinymceUpload').click();
            input.onchange = function() {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = function () {
                    var id = "blobid" + new Date().getTime();
                    var blobCache =
                        tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(",")[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
                    // call the callback and populate the Title field with the file name
                    cb(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
                document.body.removeChild(input);
            };
          },
          init_instance_callback: function(editor) {
            if (_this.value) {
              editor.setContent(_this.value);
            }
            _this.hasInit = true;
            editor.on("Change KeyUp", function(event){
              _this.hasChange = true;
              _this.$emit("input", editor.getContent({format: 'raw'}));
              _this.content = editor.getContent({format: 'raw'});
            });
            editor.on("KeyDown", function(event){
                if( event.keyCode == '08'){
                    //匹配img标签
                    var imgReg = /<img.*?(?:>|\/>)/gi;
                    //匹配src属性
                    var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
                    var img = _this.content.match(imgReg);
                    if(img !== null){
                        var imgArr = [];
                        var removeImg = [];
                        var curImg = event.target.innerHTML.match(imgReg)?event.target.innerHTML.match(imgReg):[];
                        for( var i = 0; i < curImg.length; i ++){
                            for ( var j = 0; j < img.length; j ++) {
                                if( curImg[i] !== img[j]){
                                    imgArr.push(img[j]);
                                }
                            }
                        }
                        removeImg = img.length == 1? img:imgArr;
                        var curSrc = removeImg[0].match(srcReg)[1];
                        if (curSrc.indexOf('?') !== -1) {
                            var url = curSrc.replace(/^.*?\:\/\/[^\/]+/, "").slice(1);
                            var path = url.slice(0, url.indexOf('?'));
//                          var filebob = _this.filedata.filter(function (cur, index, arr) {
//                          	if(cur.filePath == path) {
//                          		_this.filedata.splice(index, 1);
//                          		return cur
//                          	}
//                          })
//                          var fileid = filebob[0].fileId;
                            // 进行文件的删除
                            yufp.service.request({
                                url: backend.adminService + "/api/adminfileuploadinfo/deletericheditfile",
                                method: "post",
                                data:JSON.stringify({
                                    filePath: path
                                }),
                                callback: function(code, message, res) {
                                    if(res != null && res) {
                                     	_this.$message("删除成功!", "提示");
                                     	console.info('删除成功');
                                     	}
                                    }
                                   });
                                }
                    }
                }
              });
          },
          setup:function(editor) {
            editor.addButton("h2", {
              title: "小标题", 
              text: "小标题",
              onclick:function(){
                editor.execCommand("mceToggleFormat", false, "h2");
              },
              onPostRender:function(){
                var btn = this;
                editor.on("init", function(){
                  editor.formatter.formatChanged("h2", function(state){
                    btn.active(state);
                  });
                });
              }
            });
            editor.addButton("p", {
              title: "正文",
              text: "正文",
              onclick:function(){
                editor.execCommand("mceToggleFormat", false, "p");
              },
              onPostRender:function(){
                var btn = this;
                editor.on("init", function(){
                  editor.formatter.formatChanged("p", function(state){
                    btn.active(state);
                  });
                });
              }
            });
          }
        });
      },
      destroyed: function() {
        window.tinymce.get(this.id).destroy();
      }
    });
})(Vue, yufp.$, 'el-tinymce-x');