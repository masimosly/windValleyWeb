/**
 * @Authoer: dusong
 * @Description: 密码管理
 * @Date 2017/12/20
 * @Modified By:
 *
 */
define([
    './libs/jsencrypt/jsencrypt.min.js'
],function (require, exports) {

    exports.ready = function (hashCode, data, cite){

        var vm;
        vm = yufp.custom.vue({
            el: "#password",
            data: function() {
                var me = this;
                return {
                    editFields: [{
                        columnCount: 1,
                        fields: [
                            {field: 'oldPassWord', label: '原密码', type: 'password', placeholder: '原密码',
                                rules:[{ required: true, message: '请输入原密码', trigger: 'blur' }]
                            },
                            {field: 'newPassWord', label: '密码', type: 'password', placeholder: '密码',
                                rules:[{ required: true, message: '请输入密码', trigger: 'blur' },
                                    { min: 6, max: 40, message: '长度在6到25个字符', trigger: 'blur' }]
                            },
                            {
                                field: 'confirmPassWord', label: '确认密码', type: 'password',  placeholder: '确认密码',
                                rules: [{required: true, message: '请输入确认密码', trigger: 'blur'},
                                    {min: 6, max: 40, message: '长度在6到25个字符', trigger: 'blur'}]
                            }
                        ]
                    }],
                    buttons:[
                        {
                            label: '重置',  type: 'primary',icon: "yx-loop2", op: 'reset', click: function (model) {
                                //do something
                            }
                        },
                        {
                            label: '保存', type: 'primary', icon: "check", op: 'submit', click: function (model, valid) {
                                if (valid) {
                                    me.saveFn();
                                }
                            }
                        }
                    ]
                }
            },

            methods: {
                saveFn: function (formName) {
                    var vue=this;
                    var fields=vue.$refs.passwdform.formModel;
                    console.log(fields);
                    if (fields.newPassWord === fields.oldPassWord){
                        vue.$message({message: '原密码与新密码不能重复！',type: 'error'});
                        return;
                    }

                    if (fields.newPassWord !== fields.confirmPassWord){
                        vue.$message({message: '确认密码与密码不一致！',type: 'error'});
                        return;
                    }
                    var param =
                    {
                        "newPassword": fields.newPassWord,
                        "oldPassword": fields.oldPassWord
                    }
                    var encrypt = new JSEncrypt();
		            encrypt.setPublicKey(yufp.util.getRSAPublicKey());
		            var info=encrypt.encrypt(fields.newPassWord);
		            yufp.service.request({
		                 url:backend.uaaService+"/api/passwordcheck/checkpwd",
		                        method:"get",
		                        data:{
		                        	sysId:yufp.session.logicSys.id,
		                        	pwd:encodeURI(info),
		                        	userId:yufp.session.userId,
		                        	passwordTyp:'2'
		                        },
		                         callback:function(code,message,response){
		                            if(response.code==='1001'){
		                              yufp.service.request({
					                        method: 'POST',
					                        url: backend.uaaService+'/api/account/change_password',
					                        data: param,
					                        callback: function (code, message, response) {
					                            if (code === 0) {
					                                vue.$message({message: '密码修改成功！'}, 'success');
					                            }else{
					                                vue.$message({message: message}, 'error');
					                            }
					                        }
					                    });
		                            }else{
		                            	me.$message({message: response.message, type: 'warning'});
		                            	return false;
		                            }
		                        }
		                    });
                    
                },
            }
        });
    };

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    };
});