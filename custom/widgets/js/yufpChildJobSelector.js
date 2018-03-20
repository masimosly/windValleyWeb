/**
 * yufp-childjob-selector
 * 数据权限模板选择器
 * chenlin
 */
(function (vue, $, name) {
	yufp.lookup.reg('GLUE_TYPE');
    vue.component(name, {
        template: '<div>\
            <el-input v-model="selectedVal" readonly :placeholder="placeholder" :disabled="disabled"\
            :size="size" :name="name" :icon="icon" :on-icon-click="onIconClickFn" @click.native="clickFn">\
            </el-input>\
            <el-dialog-x title="子任务选择器" :visible.sync="dialogVisible" height="350px" width="850px">\
              <el-table-x ref="mytable" :data-url="dataUrl" @row-click="rowClickFn"\
               :table-columns="tableColumns" :max-height="350" :checkbox="true"> :data-params="dataParams"\
              </el-table-x>\
              <div slot="footer" class="dialog-footer">\
                <el-button @click="dialogVisible = false">取 消</el-button>\
                <el-button type="primary" @click="confirmFn">确 定</el-button>\
              </div>\
            </el-dialog-x>\
          </div>',

        props: {
            // 下述字段为el-input组件中部分属性，配置文档参见element-ui
            name: {
                type: String
            },
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
                default: ''
            },
            icon: {
                type: String,
                default: 'search'
            },
            params: Object
        },

        data: function () {
        	return this.createData();
        },
        methods: {
            clickFn: function () {
                this.$emit('click-fn', this);
            },
            onIconClickFn: function (val) {
                if (this.disabled){
                    return;
                }
                this.dialogVisible = true;
            },
            rowClickFn: function (row) {
                this.selections = this.$refs.mytable.selections;
            },
            confirmFn: function () {
                if(this.selections.length<1){
                    this.$message('请先选择一条数据');
                }
                this.selectedVal = '';
                var inputVal = '';
                
                for(var i=0;i<this.selections.length;i++){
                	if(i==this.selections.length-1){
                		this.selectedVal += this.selections[i].jobDesc;
                		inputVal += this.selections[i].id;
                	}else{
                		this.selectedVal += this.selections[i].jobDesc+",";
                		inputVal += this.selections[i].id+",";
                	}
                }
                this.$emit('input', inputVal);
                //这个是你自定义返回的接口事件
                this.$emit('select-fn', this.selections[0].id,this.selections[0]);
                this.dialogVisible = false;
            },
            // 对外提供选择器显示值
            getRawValue: function () {
                return this.selectedVal;
            },
            convertKey: function (val) {
                //将key转换为对应的value值
                return val;
            },
            createData: function() {
                var me = this;
                var temp = me.getDefaultData();
                // 深度拷贝
                yufp.extend(true, temp, me.params);
                return temp;
            },
			getDefaultData: function() {
                return {
	                selectedVal: '',
	                dialogVisible: false,
	                dataUrl: backend.adminService+'/api/xxljobinfo/childjoblist',
	                tableColumns: [
	                    { label: '任务名称', prop: 'jobDesc', width: 150, sortable: true, resizable: true },
	                    {label: '运行模式', prop: 'glueType', dataCode: 'GLUE_TYPE'},
	                    {label: 'Cron', prop: 'jobCron'},
	                    {label: '负责人', prop: 'userName'}
	                ]
	            }
            }
        },
        mounted: function () {
            this.selectedVal = this.rawValue ? this.rawValue: "";
        },
        watch: {
            value: function (val) {
                //将key转换为对应的value值
                this.selectedVal = this.selectedVal ? this.selectedVal : val;
            },
            rawValue: function (val) {
                this.selectedVal = val
            }
        }

    });
})(Vue, yufp.$, "yufp-childjob-selector");


