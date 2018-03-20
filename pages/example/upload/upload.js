/**
 * Created by helin3 on 2017/11/17.
 */
define(function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        //创建virtual model
         vm =  yufp.custom.vue({
            el: "#fx_upload_form",
            //以m_开头的属性为UI数据不作为业务数据，否则为业务数据
            data: function(){
                return {
                    upLoadData:{
                        busNo:"0001",
                        access_token:yufp.service.getToken()
                    }
                }
            },
            methods: {
                uploadUrl:function(){
                    var url = yufp.settings.ssl ? 'https://' : 'http://';
                    url += yufp.settings.url;
                    url += "/zuul"+backend.adminService;
                    return url + "/api/adminfileuploadinfo/uploadfile";
                },
                submitUpload: function(){
                    this.$message('submitUpload');
                    gg  =  this.$refs.upload;

                    this.$refs.upload.submit();
                },
                handleRemove: function(file, fileList){
                    this.$message('handleRemove');
                    console.log(file, fileList);
                },
                handlePreview: function(file){
                    this.$message('handlePreview');
                    console.log(file.fileId);

                    var url = yufp.settings.ssl ? 'https://' : 'http://';
                    url += yufp.settings.url;
                    url += backend.adminService;
                    url += "/api/adminfileuploadinfo/downloadfile";
                    url += "?fileId="+file.fileId;
                    console.log(yufp.util.addTokenInfo(url));
                    window.open(yufp.util.addTokenInfo(url));
                },
                handleUploadSuccess:function(response, file, fileList){
                    file.fileId = response.data.filePath;
                    this.$message(response.data.filePath);
                }
            }
        });

        window.vm=vm;
    };

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }

});