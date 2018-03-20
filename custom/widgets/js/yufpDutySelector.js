/**
 * 角色选择器yufp-role-selector
 * @param treeUrl-树的url必须
 * @param dataRoot-根节点
 * @param tabCheckbox-表格复选框
 * @param maxHeight-最大高度
 * @authors lupan
 * @date    2017-12-25 21:20:41
 * @version $1.0$
 */
(function(vue, $, name) {
    //注册岗位组件
    vue.component(name, {
        template: '<div>\
            <el-input :size="size" :icon="icon" :placeholder="placeholder" :disabled="disabled"\
             @focus="dialogVisible = true" :on-icon-click="onIconClickFn" readonly name="岗位" v-model="selectedVal" ></el-input>\
            <el-dialog-x title="机构岗位管理" :visible.sync= "dialogVisible" :height="height" :width = "width">\
            <el-row :gutter="20">\
            <el-col :span="5">\
            <el-tree-x ref="orgtree" :show-checbox="false" :checkStrictly="org.checkStrictly" :defaultExpandAll="org.defaultExpandAll"\
            :expandLevel="org.expandLevel" :rootVisible="org.rootVisible" :height="org.height"\
            :data-url="org.dataUrl" :data-root="org.dataRoot" :data-id="org.dataId" :data-label="org.dataLabel" :data-pid="org.dataPid"\
            :data-params="org.dataParams" @node-click="treeClickFn"></el-tree-x>\
            </el-col>\
            <el-col :span="19">\
            <el-form-q ref="queryCondition" from="query"\
            :fieldData="duty.fieldData" :buttons="duty.buttons"></el-form-q>\
            <el-table-x ref="dutytable" :checkbox="duty.checkbox" :max-height="duty.maxHeight"\
            :data-url="duty.dataUrl" :data-params="duty.dataParams"\
            :table-columns="duty.tableColumns"></el-table-x>\
            </el-col>\
            </el-row>\
            <div slot="footer" class="dialog-footer"  align="center">\
            <el-button @click="dialogVisible = false">取 消</el-button>\
            <el-button type="primary" @click="confirmFn">确 定</el-button>\
            </div>\
            </el-dialog-x>\
            </div>',
        props: {
            value: {
                required: true
            },
            rawValue: String,
            size: String,
            disabled: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请选择岗位'
            },
            icon: {
                type: String,
                default: 'search'
            },
            params: Object
        },

        data: function() {
            return this.createData();
        },
        created: function() {
            this.selectedVal = this.rawValue ? this.rawValue : this.value;
        },
        methods: {
            createData: function() {
                var me = this;
                var temp = me.getDefaultData();
                yufp.extend(true,temp, me.params);
                temp.duty.dataParams.searchType=temp.org.searchType;
                return temp;
            },
            getDefaultData: function() {
                var me = this;
                var maxHeight;
                return {
                    height: "400px",
                    width: "1000px",
                    selectedVal: "",
                    dialogVisible: false,
                    org: {
                        rootVisible: true, //根节点可见性
                        // needCheckbox: false,设置为默认单选
                        height: 500,
                        checkStrictly: false,
                        defaultExpandAll: false,
                        expandLevel: 2, //默认展开层级
                        dataUrl: backend.adminService + "/api/util/getorgtree",
                        //节点参数属性
                        dataId: "orgId",
                        dataLabel: "orgName",
                        dataPid: "upOrgId",
                        dataRoot: "",
                        //数据参数
                        dataParams: {
                            userId: yufp.session.userId,
                            orgCode: yufp.session.org.code,
                            needFin: false,
                            needManage: false,
                            needDpt: false,
                            orgLevel: "",
                        },
                        searchType: "CUR_ORG"
                    },
                    duty: {
                        checkbox: true,
                        maxHeight: maxHeight,
                        fieldData: [{
                            placeholder: '岗位代码',
                            field: 'dutyCde',
                            type: 'input'
                        }, {
                            placeholder: '岗位名称',
                            field: 'dutyName',
                            type: 'input'
                        }],
                        buttons: [{
                            label: '搜索',
                            op: 'submit',
                            type: 'primary',
                            icon: "search",
                            click: function(model, valid) {
                                if (valid) {
                                    me.queryFn(model);
                                }
                            }
                        }, {
                            label: '重置',
                            op: 'reset',
                            type: 'primary',
                            icon: 'information'
                        }],
                        dataUrl: backend.adminService + "/api/util/getduty",
                        dataParams: {
                            orgCode: yufp.session.org.code
                        },
                        tableColumns: [{
                            label: '岗位代码',
                            prop: 'dutyCde'
                        }, {
                            label: '岗位名称',
                            prop: 'dutyName'
                        }, {
                            label: '状态',
                            prop: 'dutySts'
                        }, {
                            label: '所属机构编号',
                            prop: 'belongOrgId'
                        }]
                    }
                };
            },
            onIconClickFn: function(val) {
                this.dialogVisible = true;
            },
            queryFn: function(params) {
                var temp = params;
                temp.orgCode = (temp.orgCode == "" || temp.orgCode == undefined) ? this.duty.dataParams.orgCode : temp.orgCode;
                this.$refs.dutytable.remoteData(params);
            },
            getCondition: function() {
                return this.$refs.queryCondition.fm;
            },
            treeClickFn: function(nodeData, node, self) {
                var params = this.getCondition();
                params.orgCode = nodeData.id;
                this.queryFn(params);
            },
            confirmFn: function() {
                var me = this;
                var data = this.$refs.dutytable.selections;
                if (data.length == 0) {
                    this.$message("请至少选择一条数据!", "提示");
                    return false;
                }
                if (!this.tabCheckbox && data.length > 1) {
                    this.$message("你只能选择一条数据!", "提示");
                    return;
                }
                this.$emit("input", this.array2String(data, "dutyCde"));
                this.$emit("select-fn", data);
                this.$nextTick(function() {
                    me.selectedVal = me.array2String(data, "dutyName");
                });
                this.dialogVisible = false;
            },
            // 对外提供选择器显示值
            getRawValue: function() {
                return this.selectedVal;
            },
            array2String: function(array, label) {
                var s = "";
                for (var i = 0; i < array.length; i++) {
                    if (i == 0) {
                        s += (array[i])[label];
                    } else {
                        s += "," + (array[i])[label];
                    }
                }
                return s;
            }
        },
        watch: {
            value: function(val) {},
            rawValue: function(val) {
                this.selectedVal = val;
            },
            params: function(val) {
                var me = this;
                yufp.extend(true, me, val);
            }
        }
    });
})(Vue, yufp.$, "yufp-duty-selector");