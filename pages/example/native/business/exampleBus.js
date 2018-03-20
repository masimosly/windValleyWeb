/**
 *
 * @authors lupan
 * @date    2017-12-25 21:20:41
 * @version $1.0$
 */
define([
        './custom/widgets/js/yufpOrgTree.js',
        './custom/widgets/js/yufpRoleSelector.js',
        './custom/widgets/js/yufpDutySelector.js',
        './custom/widgets/js/YufpUserSelector.js',
        './pages/example/native/business/tabdata.js',
        './pages/example/native/business/test.js',
        './custom/widgets/js/yufpUploadTable.js'
    ],
    function (require, exports) {
        exports.ready = function (hashCode, data, cite) {
            var bus = yufp.custom.vue({
                el: "#bus-component",
                data: function () {
                    var me = this;
                    return {
                        height: 160,
                        content: 'Tinymce',
                        action: yufp.util.addTokenInfo(backend.adminService + "/api/adminfileuploadinfo/uploadfile"),
                        orgTree: {
                            editFields: [{
                                columnCount: 1,
                                fields: [{
                                    field: 'orgCode',
                                    label: '机构',
                                    type: 'custom',
                                    is: "yufp-org-tree",
                                    params: {
                                        dataId: "orgId",
                                        needCheckbox: true,
                                        dataParams: {}
                                    }
                                }]
                            }],
                            buttons: [{
                                label: '修改url',
                                type: 'primary',
                                click: function (model, valid) {
                                    var temp = yufp.clone(me.orgTree.editFields[0].fields[0].params);
                                    if (me.first) {
                                        temp.dataUrl = backend.adminService + "/api/util/getdpt";
                                        temp.dataId = "orgCode";
                                        me.first = false;
                                    } else {
                                        temp.dataUrl = backend.adminService + "/api/util/getorgtree";
                                        temp.dataId = "orgId";
                                        me.first = true;
                                    }
                                    me.orgTree.editFields[0].fields[0].params = yufp.clone(temp);
                                }
                            }],
                            param: orgTreeParams
                        },
                        progress: 0,
                        user: {
                            editFields: [{
                                columnCount: 1,
                                fields: [{
                                    field: 'orgCode',
                                    label: '用户',
                                    type: 'custom',
                                    is: "yufp-user-selector",
                                    params: {
                                        dataId: "orgId",
                                        needCheckbox: true,
                                        user: {
                                            dataParams: {
                                                dutyId: "0eb56db8e9b047d8829918615a33b8db"
                                            }
                                        }
                                    }
                                }, {
                                    field: 'roleCode',
                                    label: "角色",
                                    type: "custom",
                                    is: "yufp-role-selector",
                                    params: {}
                                }, {
                                    field: 'dutyCode',
                                    label: "岗位",
                                    type: "custom",
                                    is: "yufp-duty-selector",
                                    params: {
                                        org: {
                                            searchType: "ALL_ORG"
                                        }
                                    }
                                }]
                            }],
                            buttons: [],
                            param: userTableParams
                        },
                        first: true,
                        dataUrl:backend.adminService+"/api/adminfileuploadinfo/",
                        fileList:[],
                        tableColumns:[{
                            label: '文件名称',
                            prop: 'fileName'
                        },{
                            label:"文件路径",
                            prop:"filePath"
                        },{
                            label:"文件大小",
                            prop:"fileSize"
                        },{
                            label:"扩展名",
                            prop:"extName"
                        },{
                            label:"业务流水号",
                            prop:"busNo"
                        },{
                            label:"上传时间",
                            prop:"uploadTime"
                        },{
                            label:"文件备注",
                            prop:"fileRemark"
                        }]
                    };
                },
                methods: {
                    saveFn: function () {
                        var me = this;
                        var tt = me.$refs.tinymce;
                        var content = this.content;
                        var bl = tinymce.activeEditor.editorUpload.blobCache;
                        // var temp=yufp.extend({},bl);
                        var data=[];
                        while(bl.findFirst()){
                            var blob=bl.findFirst();
                            data.push({
                                value:blob.blob()
                            });
                            bl.removeByUri(blob.blobUri());
                        }

                        data.push({
                            name:"busNo",
                            value:"业务流水号"
                        });


                        upload({
                            url: backend.adminService+"/api/adminfileuploadinfo/uploadfile",
                            data:data,
                            onSuccess: function (e) {
                                debugger
                            },
                            onError:function(){}
                        });
                    },
                    downloadFile:function(){
                        yufp.util.download(backend.adminService + "/api/util/io/download?fileId=group1/M00/00/02/wKj7l1phW0WAblgGAAAKlRuVZDc599.jpg");
                    },
                    setFn: function () {
                        this.$refs.tinymce.hasChange = false
                        this.content = '<p>123456789</p>'
                        this.$alert(this.content, {
                            confirmButtonText: '确定'
                        })
                    },
                    upload: function () {
                        var me = this;
                        var url = backend.adminService + "/api/log/exportasync";
                        url += "?access_token=" + yufp.service.getToken();
                        var params = {};
                        params.url = url;
                        var url = yufp.service.getUrl(params);

                        yufp.service.request({
                            url: backend.adminService + "/api/log/exportasync",
                            method: "get",
                            callback: function (code, message, response) {
                                if (response != null) {
                                    yufp.service.request({
                                        url: backend.adminService + "/api/util/io/querytaskinfo?taskId=" + response,
                                        method: "get",
                                        callback: function (code, message, response) {
                                            if (response != null && response != "failure") {
                                                debugger
                                                me.progress = response;
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        };
        exports.onmessage = function (type, message) {
        };

        exports.destroy = function (id, cite) {
        };
    });