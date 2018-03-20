/**
 * Created by sunxiaojun on 2017/11/24.
 */
/**
 *
 * el-form-time-picker
 */
(function (vue,$, name) {
    //注册el-form-time-picker组件
    vue.component(name, {
        //模板
        template: '<el-form-item :label="label" :prop="prop" :required="required" \
        :rules="rules" :error="error" :label-width="labelWidth" :showMessage="showMessage">\
                <el-time-picker v-model="model" :isRange="isRange" :placeholder="placeholder" :size="size" :format="format"\
                :readonly="readonly" :disabled="disabled" :clearable="clearable" :popperClass="popperClass"\
                :editable="editable" :align="align" :rangeSeparator="rangeSeparator" :pickerOptions="pickerOptions"\
                @change="change"></el-time-picker>\
            </el-form-item>',

        props: {
            /** 标签名 */
            label: {
                type: String,
                required: true
            },
            // 下述字段为el-form-item组件中部分属性，配置文档参见element-ui
            prop: String,
            required:Boolean,
            rules:Object,
            error:String,
            labelWidth:String,
            showMessage:{
                type:Boolean,
                default:true
            },
            // 下述字段为el-input组件中部分属性，配置文档参见element-ui
            size: String,
            format: String,
            readonly: Boolean,
            placeholder: String,
            disabled: Boolean,
            clearable: {
                type: Boolean,
                default: true
            },
            popperClass: String,
            editable: {
                type: Boolean,
                default: true
            },
            align: {
                type: String,
                default: 'left'
            },
            value: {},
            defaultValue: {},
            rangeSeparator: {
                default: ' - '
            },
            pickerOptions: {},
            isRange: Boolean
        },

        data: function() {
            return {
                model: ''
            }
        },
        watch: {
            model: function(val) {
                this.$emit('input', val)
            },
            value: function(val) {
                if (this.model !== val) {
                    this.model = val
                }
            }
        },
        created: function() {
        },
        methods: {
            change:function (val) {
                this.$emit('change',val)
            }
        }

    });
})(Vue, yufp.$, "el-form-time-picker");