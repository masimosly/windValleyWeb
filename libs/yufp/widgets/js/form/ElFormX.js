/**
 * Created by sunxiaojun on 2017/11/27.
 */
/**
 *
 * el-form-x
 */
(function (vue, $, name) {
    //注册el-form-x组件
    vue.component(name, {
        //模板
        template: '<div class="el-form-x">\
         <el-form :model="formModel" :rules="formRules" :style="{height: height,overflow: \'auto\',overflowX: \'hidden\'}"\
           :inline="inline" :label-position="labelPosition" :label-width="labelWidth"\
           :label-suffix="labelSuffix" :showMessage="showMessage">\
             <el-row v-for="row in rows" :key="row" :gutter="20">\
               <el-col v-for="i in row.field" v-show="i.hidden !== true" :key="i" :span="24/row.columnCount" >\
                 <el-form-item :prop="i.field" :label="i.label">\
                    <el-input \
                      v-if="!i.type || i.type==\'input\'||i.type==\'password\'||i.type==\'textarea\'" \
                      :type="i.type" v-model="formModel[i.field]" \
                      :maxlength="i.maxlength" :minlength="i.minlength" :placeholder="i.placeholder"\
                      :disabled="i.calcDisabled" :size="i.size" :icon="i.icon" :rows="i.rows" :autosize="i.autosize" \
                      :autoComplete="i.autoComplete" :name="i.name" :readonly="i.readonly" :max="i.max" :min="i.min" \
                      :step="i.step" :resize="i.resize"\
                      :autofocus="i.autofocus" :form="i.form" :on-icon-click="i.onIconClick"\
                      :validateEvent="i.validateEvent"\
                      @click="i.click&&i.click(formModel[i.field],formModel,arguments)"\
                      @blur="i.blur&&i.blur(formModel[i.field],formModel,arguments)"\
                      @focus="i.focus&&i.focus(formModel[i.field],formModel,arguments)"\
                      @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                    </el-input>\
                    <el-date-picker \
                      v-else-if="i.type==\'date\'||i.type==\'week\'||i.type==\'year\'||i.type==\'month\'\
                        ||i.type==\'datetime\'||i.type==\'datetimerange\'||i.type==\'daterange\'" \
                      :type="i.type" v-model="formModel[i.field]" :readonly="i.readonly" :disabled="i.calcDisabled"\
                      :editable="i.editable" :clearable="i.clearable" :size="i.size" :placeholder="i.placeholder" \
                      :format="i.format" :align="i.align" :popperClass="i.popperClass" :picker-options="i.pickerOptions"\
                      :range-separator="i.rangeSeparator" \
                      @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                    </el-date-picker>\
                    <el-time-select \
                      v-else-if="i.type==\'time\'"\
                      v-model="formModel[i.field]" :isRange="i.isRange" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
                      :readonly="i.readonly" :disabled="i.calcDisabled" :clearable="i.clearable" :popperClass="i.popperClass"\
                      :editable="i.editable" :align="i.align" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
                      @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                    </el-time-select>\
                    <el-time-picker \
                      v-else-if="i.type==\'timePicker\'" \
                      v-model="formModel[i.field]" :isRange="i.isRange" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
                      :readonly="i.readonly" :disabled="i.calcDisabled" :clearable="i.clearable" :popperClass="i.popperClass"\
                      :editable="i.editable" :align="i.align" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
                      @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                    </el-time-picker>\
                    <el-select-x \
                      v-else-if="i.type==\'select\'" \
                      v-model="formModel[i.field]" :options="i.options" :props="i.props" :data-url="i.dataUrl"\
                      :data-code="i.dataCode" :disabled="i.calcDisabled"\
                      @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                    </el-select-x>\
                    <el-radio-x\
                      v-else-if="i.type==\'radio\'" \
                      v-model="formModel[i.field]" :options="i.options" :data-url="i.dataUrl" :disabled="i.calcDisabled"\
                      :data-code="i.dataCode"\
                      :option-button="i.optionButton" @change="i.change">\
                    </el-radio-x>\
                    <el-checkbox-x \
                      v-else-if="i.type==\'checkbox\'"\
                      v-model="formModel[i.field]" :options="i.options" :data-url="i.dataUrl" :min=i.min :max=i.max \
                      :data-code="i.dataCode"\
                      :option-button="i.optionButton" :disabled="i.calcDisabled" @change="i.change">\
                    </el-checkbox-x>\
                    <el-switch v-else-if="i.type==\'switch\'"\
                      v-model="formModel[i.field]" :on-text="i.onText" :off-text="i.offText"\
                      @change="i.change && i.change(formModel[i.field],formModel,arguments)">\
                    </el-switch>\
                    <component v-else-if="i.type==\'custom\'"\
                     v-model="formModel[i.field]" :params="i.params"\
                     :disabled="i.calcDisabled" :readonly="i.readonly" :size="i.size" :raw-value="i.rawValue" \
                     @click-fn="i.clickFn && i.clickFn(formModel[i.field],formModel,arguments)"\
                     :is="i.is" :ref="i.ref" @select-fn="i.selectFn && i.selectFn(formModel[i.field],formModel,arguments)">\
                    </component>\
                 </el-form-item>\
               </el-col>\
             </el-row>\
         </el-form>\
         <el-row :gutter="20" class="el-form-x-footer">\
             <el-button v-for="(i,idx) in buttons" :key="i" v-show="!i.hidden" :type="i.type" :size="i.size" :plain="i.plain" :round="i.round"\
               :loading="i.loading" :disabled="i.disabled" :icon="i.icon" :autofocus="i.autofocus" :native-type="i.nativeType"\
               @click="(i.click||i.op==\'reset\')&&click(i.click,i.op)" >{{i.label}}</el-button>\
         </el-row>\
        </div>',
        props: {
            groupFields: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            buttons: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            //是否采用分组表单
            collapse : {
                type: Boolean,
                default: false
            },
            //分组表单默认展开项
            expand: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            hasLabel: {
                type: Boolean,
                default: true
            },
            disabled: Boolean,
            height: {
                type: String,
                default: 'auto',
            },

            //ElForm自带属性
            model: Object,
            rules: Object,
            labelPosition: {
                type: String,
                default: 'right'
            },
            labelWidth: String,
            labelSuffix: {
                type: String,
                default: ''
            },
            inline: Boolean,
            showMessage: {
                type: Boolean,
                default: true
            }
        },
        data: function () {
            
            return {
                groupField: this.groupFields,
                expandCollapseName:this.expand,
                rows: [],
                formModel: {},
                formRules: []
            }
        },
        created: function(){
            var pt = this.collapse?this.preGroupTreat():this.preTreat();
            pt.formRules = yufp.extend(this.rules || {},pt.formRules);
            this.rows = pt.rows;
            this.formModel = pt.formModel;
            this.formRules = pt.formRules;
            if(this.collapse){
                this.$options.template = '<div class="el-form-x" :collapse="collapse"><el-collapse v-model="expandCollapseName" @change="change"><el-collapse-item v-for="item in rows" :key="item.title" :title="item.title" :name="item.name">\
                <el-form :model="formModel" :rules="formRules" :style="{height: height,overflow: \'auto\',overflowX: \'hidden\'}"\
                  :inline="inline" :label-position="labelPosition" :label-width="labelWidth"\
                  :label-suffix="labelSuffix" :showMessage="showMessage">\
                    <el-row v-for="row in item.rows" :key="row" :gutter="20">\
                      <el-col v-for="i in row.field" v-show="i.hidden !== true" :key="i" :span="24/row.columnCount" >\
                        <el-form-item :prop="i.field" :label="i.label">\
                           <el-input \
                             v-if="!i.type || i.type==\'input\'||i.type==\'password\'||i.type==\'textarea\'" \
                             :type="i.type" v-model="formModel[i.field]" \
                             :maxlength="i.maxlength" :minlength="i.minlength" :placeholder="i.placeholder"\
                             :disabled="i.calcDisabled" :size="i.size" :icon="i.icon" :rows="i.rows" :autosize="i.autosize" \
                             :autoComplete="i.autoComplete" :name="i.name" :readonly="i.readonly" :max="i.max" :min="i.min" \
                             :step="i.step" :resize="i.resize"\
                             :autofocus="i.autofocus" :form="i.form" :on-icon-click="i.onIconClick"\
                             :validateEvent="i.validateEvent"\
                             @click="i.click&&i.click(formModel[i.field],formModel,arguments)"\
                             @blur="i.blur&&i.blur(formModel[i.field],formModel,arguments)"\
                             @focus="i.focus&&i.focus(formModel[i.field],formModel,arguments)"\
                             @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                           </el-input>\
                           <el-date-picker \
                             v-else-if="i.type==\'date\'||i.type==\'week\'||i.type==\'year\'||i.type==\'month\'\
                               ||i.type==\'datetime\'||i.type==\'datetimerange\'||i.type==\'daterange\'" \
                             :type="i.type" v-model="formModel[i.field]" :readonly="i.readonly" :disabled="i.calcDisabled"\
                             :editable="i.editable" :clearable="i.clearable" :size="i.size" :placeholder="i.placeholder" \
                             :format="i.format" :align="i.align" :popperClass="i.popperClass" :picker-options="i.pickerOptions"\
                             :range-separator="i.rangeSeparator" \
                             @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                           </el-date-picker>\
                           <el-time-select \
                             v-else-if="i.type==\'time\'"\
                             v-model="formModel[i.field]" :isRange="i.isRange" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
                             :readonly="i.readonly" :disabled="i.calcDisabled" :clearable="i.clearable" :popperClass="i.popperClass"\
                             :editable="i.editable" :align="i.align" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
                             @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                           </el-time-select>\
                           <el-time-picker \
                             v-else-if="i.type==\'timePicker\'" \
                             v-model="formModel[i.field]" :isRange="i.isRange" :placeholder="i.placeholder" :size="i.size" :format="i.format"\
                             :readonly="i.readonly" :disabled="i.calcDisabled" :clearable="i.clearable" :popperClass="i.popperClass"\
                             :editable="i.editable" :align="i.align" :range-separator="i.rangeSeparator" :picker-options="i.pickerOptions"\
                             @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                           </el-time-picker>\
                           <el-select-x \
                             v-else-if="i.type==\'select\'" \
                             v-model="formModel[i.field]" :options="i.options" :props="i.props" :data-url="i.dataUrl"\
                             :data-code="i.dataCode" :disabled="i.calcDisabled"\
                             @change="i.change&&i.change(formModel[i.field],formModel,arguments)">\
                           </el-select-x>\
                           <el-radio-x\
                             v-else-if="i.type==\'radio\'" \
                             v-model="formModel[i.field]" :options="i.options" :data-url="i.dataUrl" :disabled="i.calcDisabled"\
                             :data-code="i.dataCode"\
                             @change="i.change">\
                           </el-radio-x>\
                           <el-checkbox-x \
                             v-else-if="i.type==\'checkbox\'"\
                             v-model="formModel[i.field]" :options="i.options" :data-url="i.dataUrl" :min=i.min :max=i.max \
                             :data-code="i.dataCode"\
                             :disabled="i.calcDisabled" @change="i.change">\
                           </el-checkbox-x>\
                           <component v-else-if="i.type==\'custom\'"\
                            v-model="formModel[i.field]" :params="i.params"\
                            :disabled="i.calcDisabled" :readonly="i.readonly" :size="i.size" :raw-value="i.rawValue" \
                            @click-fn="i.clickFn && i.clickFn(formModel[i.field],formModel,arguments)"\
                            :is="i.is" :ref="i.ref" @select-fn="i.selectFn && i.selectFn(formModel[i.field],formModel,arguments)">\
                           </component>\
                        </el-form-item>\
                      </el-col>\
                    </el-row>\
                </el-form>\
                </el-collapse-item> \
                </el-collapse>\
                <el-row :gutter="20" class="el-form-x-footer">\
                    <el-button v-for="(i,idx) in buttons" :key="i" v-show="!i.hidden" :type="i.type" :size="i.size" :plain="i.plain" :round="i.round"\
                      :loading="i.loading" :disabled="i.disabled" :icon="i.icon" :autofocus="i.autofocus" :native-type="i.nativeType"\
                      @click="(i.click||i.op==\'reset\')&&click(i.click,i.op)" >{{i.label}}</el-button>\
                </el-row>\
               </div>';
            }
        },
        methods: {
            rebuildFn: function () {
                var pt = this.collapse?this.preGroupTreat():this.preTreat();
                pt.formRules = yufp.extend(this.rules || {},pt.formRules);
                this.formRules = pt.formRules;
                // this.formModel = pt.formModel
                this.rows = pt.rows;
            },
            resetFn: function () {
                var pt = this.collapse?this.preGroupTreat():this.preTreat();
                pt.formRules = yufp.extend(this.rules || {},pt.formRules);
                this.formRules = pt.formRules;
                this.formModel = pt.formModel
                this.rows = pt.rows;
            },
            change:  function(activeName) {
                this.$emit( 'change', activeName);
            },
            preTreat: function () {
                var formModel = {}, formRules = {}, lastIndex = 0, rows = [], cols = [];
                for (var i = 0, iLen = this.groupField.length; i < iLen; i++) {
                    var gf = this.groupField[i];
                    var columnCount = gf.columnCount ? gf.columnCount : 1;
                    var fields = gf.fields;
                    for (var j = 0, jLen = fields.length; j < jLen; j++) {
                        var f = fields[j];
                        f.calcDisabled = f.disabled ? f.disabled : this.disabled;
                        if (!this.hasLabel) {
                            f.placeholder = f.placeholder ? f.placeholder : f.label;
                            delete f.label;
                            delete f.labelWidth;
                        }
                        formModel[f.field] = f.value || '';
                        if (f.rules) {
                            formRules[f.field] = f.rules;
                        }
                        // if (f.hidden !== true) {
                            cols.push(f);
                            if(cols.length == columnCount) {
                                rows.push({
                                    field: cols,
                                    columnCount: columnCount
                                });
                                cols = [];
                            }
                        // } 
                    }
                    if (cols.length > 0) {
                        rows.push({
                            field: cols,
                            columnCount: columnCount
                        });
                        cols = [];
                        lastIndex = 0;
                    }
                }
                return {
                    rows: rows,
                    formModel: formModel,
                    formRules: formRules
                };
            },
            preGroupTreat: function () {
                var formModel = {}, formRules = {}, lastIndex = 0, rows = [], cols = [], formArray = [],formdata={};
                for (var i = 0, iLen = this.groupFields.length; i < iLen; i++) {
                    var gf = this.groupFields[i];
                    var title = gf.title;
                    var name = gf.name;
                    var columnCount = gf.columnCount ? gf.columnCount : 1;
                    var fields = gf.fields;
                    for (var j = 0, jLen = fields.length; j < jLen; j++) {
                        var f = fields[j];
                        f.calcDisabled = f.disabled ? f.disabled : this.disabled;
                        if (!this.hasLabel) {
                            f.placeholder = f.placeholder ? f.placeholder : f.label;
                            delete f.label;
                            delete f.labelWidth;
                        }
                        formModel[f.field] = f.value || '';
                        if (f.rules) {
                            formRules[f.field] = f.rules;
                        }
                        cols.push(f);
                        if (cols.length == columnCount) {
                            rows.push({
                                field: cols,
                                columnCount: columnCount
                            });
                            cols = [];
                        }
                    }
                    if (cols.length > 0) {
                        rows.push({
                            field: cols,
                            columnCount: columnCount
                        });
                        cols = [];
                        rows = [];
                        lastIndex = 0;
                    }
                    formdata.title =  title;
                    formdata.name = name;
                    formdata.rows = rows;
                    formArray.push(formdata);
                    rows = [];
                    formdata = {};
                }
                return {
                    rows: formArray,
                    formModel: formModel,
                    formRules: formRules
                };
            },
            validate: function (callback) {
                return this.$children[0].validate(callback);
            },
            resetFields: function () {
                this.$children[0].resetFields();
            },
            switch: function (field, params, value) {
                var dataArr = this.groupField;
                this.groupField = [];
                dataArr.filter(function ( cur, index, arr){
                    var _index = index;
                    fields = cur.fields;
                    fields.filter(function (cur, index, arr){
                        if(cur.field == field) {
                            cur[params] = value
                        }
                    })
                })
                this.groupField = dataArr
            },
            click: function (fn, op) {
                var me = this;
                if (op === 'reset') {
                    me.$children[0].resetFields();
                    fn && fn(me.formModel);
                } else if (op === 'submit') {
                    me.$children[0].validate(function (valid) {
                        fn(me.formModel, valid)
                    });
                } else {
                    fn(this.formModel)
                }
            }
        },
        watch: {
            groupField: function (val) {
                this.rebuildFn();
            },
            disabled: function (val) {
                this.rebuildFn();
            }
        }
    })
})(Vue, yufp.$, "el-form-x");