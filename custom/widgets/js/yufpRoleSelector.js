/**
 * 机构树选择器yufp-org-tree
 * @param treeUrl-树的url必须
 * @param dataRoot-根节点
 * @param tabCheckbox-表格复选框
 * @param maxHeight-最大高度
 * @authors lupan
 * @date    2017-12-25 21:20:41
 * @version $1.0$
 */
(function(vue, $, name) {
    //注册角色组件
    vue.component(name, {
        template: '<div>\
            <el-input :size="size" :icon="icon" :placeholder="placeholder" :disabled="disabled"\
            @focus="dialogVisible = true" :on-icon-click="onIconClickFn" readonly name="角色" v-model="selectedVal"></el-input>\
            <el-dialog-x title="机构角色管理" :visible.sync= "dialogVisible" height="400px" width = "1000px">\
            <el-row :gutter="20">\
            <el-col :span="5">\
            <el-tree-x ref="orgtree" :show-checbox="false" :checkStrictly="org.checkStrictly" :defaultExpandAll="org.defaultExpandAll"\
            :expandLevel="org.expandLevel" :rootVisible="org.rootVisible" :height="org.height"\
            :data-url="org.dataUrl" :data-root="org.dataRoot" :data-id="org.dataId" :data-label="org.dataLabel" :data-pid="org.dataPid"\
            :data-params="org.dataParams" @node-click="treeClickFn"></el-tree-x>\
            </el-col>\
            <el-col :span="19">\
            <el-form-q ref="queryCondition" from="query"\
            :fieldData="role.fieldData" :buttons="role.buttons"></el-form-q>\
            <el-table-x ref="roletable" :checkbox="role.checkbox" :max-height="role.maxHeight"\
            :data-url="role.dataUrl" :data-params="role.dataParams"\
            :table-columns="role.tableColumns"></el-table-x>\
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
                default: '请选择角色'
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
                temp.role.dataParams.searchType=temp.org.searchType;
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
                    role: {
                        checkbox: true,
                        fieldData: [{
                            placeholder: '角色代码',
                            field: 'roleCode',
                            type: 'input'
                        }, {
                            placeholder: '角色名称',
                            field: 'roleName',
                            type: 'input'
                        }, {
                            placeholder: '角色层级',
                            field: 'roleLevel',
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
                        dataUrl: backend.adminService + "/api/util/getrole",
                        maxHeight: maxHeight,
                        dataParams: {
                            orgCode: yufp.session.org.code
                        },
                        tableColumns: [{
                            label: '角色代码',
                            prop: 'roleCode'
                        }, {
                            label: '角色名称',
                            prop: 'roleName'
                        }, {
                            label: '所属机构编号',
                            prop: 'orgId'
                        }, {
                            label: '角色层级',
                            prop: 'roleLevel'
                        }, {
                            label: '状态',
                            prop: 'roleSts'
                        }]
                    }
                };
            },
            onIconClickFn: function(val) {
                this.dialogVisible = true;
            },
            queryFn: function(params) {
                var temp = params;
                temp.orgCode = (temp.orgCode == "" || temp.orgCode == undefined) ? this.role.dataParams.orgCode : temp.orgCode;
                this.$refs.roletable.remoteData(temp);
            },
            getCondition: function() {
                return this.$refs.queryCondition.fm;
            },
            treeClickFn: function(nodeData, node, self) {
                var params = this.getCondition();
                params.orgCode = nodeData.id;
                this.queryFn(params);
            },
            currentChangeFn: function(nodeData, node, self) {
                // 仅用于复选框
                if (this.treeCheckbox) {
                    var params = this.getCondition();
                    var code = this.$refs.orgtree.getCheckedKeys().toString();
                    params.orgCode = code;
                    var param = {
                        condition: JSON.stringify(params)
                    };
                    this.queryFn(param);
                }
            },
            confirmFn: function() {
                var me = this;
                var data = this.$refs.roletable.selections;
                if (data.length == 0) {
                    this.$message("请至少选择一条数据!", "提示");
                    return false;
                }
                if (!this.tabCheckbox && data.length > 1) {
                    this.$message("你只能选择一条数据!", "提示");
                    return;
                }
                this.$emit("input", this.array2String(data, "roleCode"));
                this.$emit("select-fn", data);
                this.$nextTick(function() {
                    me.selectedVal = me.array2String(data, "roleName");
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
                var me=this;
                yufp.extend(true, me, val);
            }
        }
    });
})(Vue, yufp.$, "yufp-role-selector");