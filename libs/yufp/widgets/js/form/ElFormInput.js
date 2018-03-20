/**
 * Created by sunxiaojun on 2017/11/24.
 */
/**
 *
 * el-form-input
 */
(function (vue,$, name) {
    //注册el-form-input组件
    vue.component(name, {
        //模板
        template: '<el-form-item :label="label" :prop="prop" :required="required" \
        :rules="rules" :error="error" :label-width="labelWidth" :showMessage="showMessage">\
                <el-input v-model="model" :placeholder="placeholder" :size="size" :resize="resize"\
                :readonly="readonly" :autofocus="autofocus" :icon="icon" :disabled="disabled" :type="type"\
                :name="name" :autosize="autosize" :rows="rows" :autoComplete="autoComplete" :form="form"\
                :maxlength="maxlength" :minlength="minlength" :max="max" :min="min" :step="step" :validateEvent="validateEvent"\
                :onIconClick="onIconClick" @click="click" @blur="blur" @focus="focus" @change="change">\
                </el-input>\
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
            value: [String, Number],
            placeholder: String,
            size: String,
            resize: String,
            readonly: Boolean,
            autofocus: Boolean,
            icon: String,
            disabled: Boolean,
            type: {
                type: String,
                default: 'text'
            },
            name: String,
            autosize: {
                type: [Boolean, Object],
                default: false
            },
            rows: {
                type: Number,
                default: 2
            },
            autoComplete: {
                type: String,
                default: 'off'
            },
            form: String,
            maxlength: Number,
            minlength: Number,
            max: {},
            min: {},
            step: {},
            validateEvent: {
                type: Boolean,
                default: true
            },
            onIconClick: Function
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
            blur:function () {
                this.$emit('blur')
            },
            change:function (val) {
                this.$emit('change',val)
            },
            focus:function () {
                this.$emit('focus')
            },
            click:function () {
                this.$emit('click')
            }
        }

    });
})(Vue, yufp.$, "el-form-input");