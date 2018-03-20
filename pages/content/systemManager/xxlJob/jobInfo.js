/**
 * Created by chenlin on 2018/1/16.任务管理
 */
define([
        './custom/codemirror/lib/codemirror.js',
        './custom/codemirror/addon/hint/show-hint.js',
        './custom/codemirror/addon/hint/anyword-hint.js',
        // './custom/codemirror/jobcode.index.1.js',

        './custom/codemirror/mode/clike/clike.js',
        './custom/codemirror/mode/shell/shell.js',
        './custom/codemirror/mode/python/python.js',
        './custom/codemirror/mode/javascript/javascript.js',
        './custom/widgets/js/yufpChildJobSelector.js'//子任务放大镜
    ],
    function (require, exports) {
        //page加载完成后调用ready方法
        exports.ready = function (hashCode, data, cite) {
            yufp.lookup.reg('JOB_GROUP', 'ROUTE_STRATEGY', 'GLUE_TYPE', 'BLOCK_STRATEGY', 'FAIL_STRATEGY');
			var groupOptions = [];
			var groupKeyValue =[];
		    //自定义字典（执行器）
		    yufp.service.request({
		        method: 'GET',
		        url: backend.adminService + "/api/triggergroup/querypage",
		        callback: function (code, message, response) {
		            var group = response.data;
		            for(var i=0;i<group.length;i++){
		                var option = {};
		                option.key = group[i].id;
		                option.value=group[i].title;
		                groupOptions.push(option);
		            }
		            groupKeyValue = groupOptions.reduce(function (acc, cur) {
		                acc[cur.key] = cur.value
		                return acc
		            }, {});
		        }
		    });
            var vm = yufp.custom.vue({
                el: "#jobInfo",
                data: function () {
                    var me = this;
                    return {
                        codeEditor:null,
                        ideEditor:{
                            glueSource:'//请补充JAVA代码',
                            glueRemark:'默认版本',
                            codeVersionOptions: [{
                                value: 'DEV',
                                label: '开发版本',
                                glueSource: ''
                            }],
                            thisSelectedCodeVersion:null,
                            sourceTemplate: [{
                                glueRemark:'GLUE模式(JAVA)代码初始化',
                                glueSource:'package com.xxl.job.service.handler;\n' +
                                '\n' +
                                'import com.xxl.job.core.log.XxlJobLogger;\n' +
                                'import com.xxl.job.core.biz.model.ReturnT;\n' +
                                'import com.xxl.job.core.handler.IJobHandler;\n' +
                                '\n' +
                                'public class DemoGlueJobHandler extends IJobHandler {\n' +
                                '\n' +
                                '\t@Override\n' +
                                '\tpublic ReturnT<String> execute(String param) throws Exception {\n' +
                                '\t\tXxlJobLogger.log("XXL-JOB, Hello World.");\n' +
                                '\t\treturn ReturnT.SUCCESS;\n' +
                                '\t}\n' +
                                '\n' +
                                '}'
                            },{
                                glueRemark:'GLUE模式(Shell)代码初始化',
                                glueSource:'#!/bin/bash\n' +
                                'echo "xxl-job: hello shell"\n' +
                                '\n' +
                                'echo "脚本位置：$0"\n' +
                                'echo "任务参数：$1"\n' +
                                'echo "分片序号 = $2"\n' +
                                'echo "分片总数 = $3"\n' +
                                '\n' +
                                'echo "Good bye!"\n' +
                                'exit 0\n' +
                                'Name\n' +
                                'add\n' +
                                'pageList\n' +
                                'add\n' +
                                'pageList\n' +
                                '4 requests ❘ 10.0 KB transferred\n' +
                                '\n' +
                                'Console\n' +
                                'Request blocking\n' +
                                'What\'s New\n' +
                                '\n' +
                                '\n'
                            },{
                                glueRemark:'GLUE模式(Python)代码初始化',
                                glueSource:'#!/usr/bin/python\n' +
                                '# -*- coding: UTF-8 -*-\n' +
                                'import time\n' +
                                'import sys\n' +
                                '\n' +
                                'print "xxl-job: hello python"\n' +
                                '\n' +
                                'print "脚本文件：", sys.argv[0]\n' +
                                'print "任务参数：", sys.argv[1]\n' +
                                'print "分片序号：", sys.argv[2]\n' +
                                'print "分片总数：", sys.argv[3]\n' +
                                '\n' +
                                'print "Good bye!"\n' +
                                'exit(0)'
                            },{
                                glueRemark:'GLUE模式(Nodejs)代码初始化',
                                glueSource:'#!/usr/bin/env node\n' +
                                'console.log("xxl-job: hello nodejs")\n' +
                                '\n' +
                                'var arguments = process.argv\n' +
                                '\n' +
                                'console.log("脚本文件: " + arguments[1])\n' +
                                'console.log("任务参数: " + arguments[2])\n' +
                                'console.log("分片序号: " + arguments[3])\n' +
                                'console.log("分片总数: " + arguments[4])\n' +
                                '\n' +
                                'console.log("Good bye!")\n' +
                                'process.exit(0)'
                            }],
                        },
						addButton:!yufp.session.checkCtrl('add'),//新增按钮控制
						modifyButton:!yufp.session.checkCtrl('modify'),//修改按钮控制
						deleteButton:!yufp.session.checkCtrl('delete'),//删除按钮控制
						triggerButton:!yufp.session.checkCtrl('trigger'),//执行
						suspendButton:!yufp.session.checkCtrl('suspend'),//暂停
						recoveryButton:!yufp.session.checkCtrl('recovery'),//恢复
						openLogButton:!yufp.session.checkCtrl('openLog'),//日志
						openCodeEditButton:!yufp.session.checkCtrl('openCodeEditFn'),//GULE
                        jobInfoTableUrl: backend.adminService + "/api/xxljobinfo/pagelist",
                        expandCollapseName: ['base'],
                        queryFields: [
                            {placeholder: '执行器', field: 'jobGroup', type: 'select', options: groupOptions},
                            {placeholder: '任务名称', field: 'jobDesc', type: 'input'}
                        ],
                        queryButtons: [
                            {
                                label: '搜索', op: 'submit', type: 'primary', icon: "search",
                                click: function (model, valid) {
                                    if (valid) {
                                        var param = {condition: JSON.stringify(model)};
                                        me.$refs.jobInfoTable.remoteData(param);
                                    }
                                }
                            },
                            {
                                label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2',
                                click: function () {
                                }
                            }
                        ],
                        tableColumns: [
                        	{label: '执行器', prop: 'jobGroup', formatter: function (row, me) {
                                var val = row[me.property];
                                val = groupKeyValue[val] || val;
                                return val;
                            }},
                            {label: '任务名称', prop: 'jobDesc', sortable: true, resizable: true, template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-detail-click\', scope)">{{ scope.row.jobDesc }}</a>\
                            </template>';
                            }},
                            {label: '运行模式', prop: 'glueType', dataCode: 'GLUE_TYPE'},
                            {label: 'Cron', prop: 'jobCron'},
                            {label: '负责人', prop: 'userName'},
                            {
                                label: '状态', prop: 'glueRemark', width: 120, template: function () {
                                return '<template scope="scope">\
                                	<el-tag type="gray" v-if="scope.row.glueRemark==\'NONE\'" >{{ scope.row.glueRemark }}</el-tag>\
                                    <el-tag type="gray" v-if="scope.row.glueRemark==\'PAUSED\'" >{{ scope.row.glueRemark }}</el-tag>\
                                    <el-tag type="success" v-if="scope.row.glueRemark==\'NORMAL\'" >{{ scope.row.glueRemark }}</el-tag>\
                                </template>';
                            }
                            }
                        ],
                        updateFields: [{
                            columnCount: 2,
                            fields: [
                                {
                                    field: 'jobGroup', label: '执行器', type: 'select', options: groupOptions,
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}]
                                },
                                {
                                    field: 'jobDesc',
                                    label: '任务名称',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'},
                                	{max: 80, message: '输入值过长', trigger: 'blur' }]
                                },
                                {
                                    field: 'executorRouteStrategy',
                                    label: '路由策略',
                                    type: 'select',
                                    dataCode: 'ROUTE_STRATEGY',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}]
                                },
                                {
                                    field: 'jobCron',
                                    label: 'Cron',
                                    placeholder: '例如:0 0 12 * * ?',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}]
                                },
                                {
                                    field: 'glueType', label: '运行模式', type: 'select', dataCode: 'GLUE_TYPE',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}],
                                    change: function (code, data, arry) {
	                                    if (code!='BEAN') {
	                                    	 me.$refs.jobInfoForm.switch('executorHandler','disabled',true);
	                                    	 me.$refs.jobInfoForm.formModel.executorHandler = '';
	                                    	 me.updateFields[0].fields[5].rules[0].required=false;
	                                    }else{
	                                    	 me.$refs.jobInfoForm.switch('executorHandler','disabled',false);
	                                    	 me.updateFields[0].fields[5].rules[0].required=true;
	                                    }
                                    }
                                },
                                {field: 'executorHandler', label: 'JobHandler',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'},
                                	{max: 80, message: '输入值过长', trigger: 'blur' }]},
                                {field: 'executorParam', label: '执行参数',
                                    rules: [{max: 170, message: '输入值过长', trigger: 'blur' }]},
                                {field: 'childJobid', label: '子任务', type: 'custom', is: 'yufp-childjob-selector',rawValue:'',
                                    rules: [{max: 3200, message: '选择的子任务过多', trigger: 'blur' }]},
                                {
                                    field: 'executorBlockStrategy',
                                    label: '阻塞处理策略',
                                    type: 'select',
                                    dataCode: 'BLOCK_STRATEGY',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}]
                                },
                                {
                                    field: 'executorFailStrategy',
                                    label: '失败处理策略',
                                    type: 'select',
                                    dataCode: 'FAIL_STRATEGY',
                                    rules: [{required: true, message: '必填项', trigger: 'blur'}],
                                    change: function (code, data, arry) {
	                                    if (code=='FAIL_ALARM') {
	                                    	me.updateFields[0].fields[10].rules[0].required=true;
	                                    }else{
	                                    	me.updateFields[0].fields[10].rules[0].required=false;
	                                    }
                                    }
                                },
                                {field: 'alarmEmail', label: '报警邮件', rules:[
                                {required: true, message: '必填项', trigger: 'blur'},
                                {validator: yufp.validator.email,message: '请输入正确信息', trigger: 'blur'}
                            	]}

                            ]
                        }],
                        updateButtons: [
                            {
                                label: '取消', icon: "yx-undo2", hidden: false, click: function (model) {
                                me.dialogVisible = false;
                            }
                            },
                            {
                                label: '保存',
                                type: 'primary',
                                op: 'submit',
                                icon: "check",
                                hidden: false,
                                click: function (model) {
                                    me.saveCreateFn();
                                }
                            },
                            {
                                label: '保存',
                                type: 'primary',
                                op: 'submit',
                                icon: "check",
                                hidden: false,
                                click: function (model) {
                                    me.saveEditFn();
                                }
                            }],

                        height: yufp.custom.viewSize().height - 10,
                        editCodeDialogFormVisible: false,
                        dialogVisible: false,
                        formDisabled: false,
                        viewType: 'DETAIL',
                        viewTitle: yufp.lookup.find('CRUD_TYPE', false)
                    }
                },
                filters: {
                    statusFilter: function (status) {
                        return groupKeyValue[status];
                    }
                },
                methods: {
                    //主列表维护
                    queryMainGridFn: function () {
                        var me = this;
                        var param = {
                            condition: JSON.stringify({
                                jobGroup: me.$refs.jobInfoQuery.fm.jobGroup ? me.$refs.jobInfoQuery.fm.jobGroup : null,
                                jobDesc: me.$refs.jobInfoQuery.fm.jobDesc ? me.$refs.jobInfoQuery.fm.jobDesc : null,
                                executorHandler: me.$refs.jobInfoQuery.fm.executorHandler ? me.$refs.jobInfoQuery.fm.executorHandler : null
                            })
                        }
                        me.$refs.jobInfoTable.remoteData(param);
                    },
                    switchStatus: function (viewType, editable) {
                        this.viewType = viewType;
                        this.dialogVisible = true;
                        this.formDisabled = !editable;
                        this.updateButtons[0].hidden = !editable;
                        if (viewType == 'ADD') {
                            this.updateButtons[1].hidden = !editable;
                            this.updateButtons[2].hidden = editable;
                        } else if (viewType == 'EDIT') {
                            this.updateButtons[1].hidden = editable;
                            this.updateButtons[2].hidden = !editable;
                        } else if (viewType == 'DETAIL') {
                            this.updateButtons[1].hidden = !editable;
                            this.updateButtons[2].hidden = !editable;
                        }
                    },
                    //新增页面初始化
                    addFn: function () {
                        this.switchStatus('ADD', true);
                        this.$nextTick(function () {
                            this.$refs.jobInfoForm.resetFields();
                            //新增页面进入修改子任务查询id
                            var temp = yufp.clone(this.updateFields[0].fields[7].params);
                            temp.dataUrl = backend.adminService+'/api/xxljobinfo/childjoblist';
                            this.updateFields[0].fields[7].params = yufp.clone(temp);
                            
                            //this.$refs.jobInfoForm.formModel.jobGroup = '1';
                            this.$refs.jobInfoForm.formModel.executorRouteStrategy = 'FIRST';
                            this.$refs.jobInfoForm.formModel.glueType = 'BEAN';
                            this.$refs.jobInfoForm.formModel.executorBlockStrategy = 'SERIAL_EXECUTION';
                            this.$refs.jobInfoForm.formModel.executorFailStrategy = 'FAIL_ALARM';
                            
                            this.$refs.jobInfoForm.switch('jobGroup','disabled',false);
                        	this.$refs.jobInfoForm.switch('glueType','disabled',false);
                        	this.$refs.jobInfoForm.switch('executorHandler','disabled',false);
                        });
                    },
                    //修改页面初始化
                    modifyFn: function () {
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请选择一条记录', type: 'warning'})
                            return;
                        }
                        this.switchStatus('EDIT', true);
                        this.$nextTick(function () {
                            yufp.extend(this.$refs.jobInfoForm.formModel, this.$refs.jobInfoTable.selections[0]);
                            //子任务id反显汉字
                            var childJobId = this.$refs.jobInfoTable.selections[0].childJobid;
                            var rawValue ='';
                            if(childJobId!=null){
                            	var childids = childJobId.split(',');
	                            var data = this.$refs.jobInfoTable.data;
	                            for(var i=0;i<childids.length;i++){
	                            	for(var j=0;j<data.length;j++){
	                            		if(data[j].id == childids[i]){
	                            			if(i==childids.length-1){
			                            		rawValue += data[j].jobDesc;
			                            	}else{
			                            		rawValue +=data[j].jobDesc+",";
			                            	}
	                            		}
	                            	}
	                            }
                            }
                            this.updateFields[0].fields[7].rawValue = rawValue;
                            //修改页面进入修改子任务查询id
                            var jobId =this.$refs.jobInfoTable.selections[0].id;
                            var temp = yufp.clone(this.updateFields[0].fields[7].params);
                            temp.dataUrl = backend.adminService+'/api/xxljobinfo/childjoblist?jobId='+jobId;
                            this.updateFields[0].fields[7].params = yufp.clone(temp);
                        	//设置编号不可编辑
                        	var jobHandler = this.$refs.jobInfoTable.selections[0].glueType;
                        	if(jobHandler!='BEAN'){
                        		this.$refs.jobInfoForm.switch('executorHandler','disabled',true);
                        	}else{
                        		this.$refs.jobInfoForm.switch('executorHandler','disabled',false);
                        	}
                        	this.$refs.jobInfoForm.switch('jobGroup','disabled',true);
                        	this.$refs.jobInfoForm.switch('glueType','disabled',true);
                        });
                    },
                    //详情
                    infoFn: function (row) {//详情弹出方法
                        //设置字段隐藏
                        this.switchStatus('DETAIL', false);
                        this.$nextTick(function () {
                            yufp.extend(this.$refs.jobInfoForm.formModel,row.row);
                        });
                    },
                    //新增保存
                    saveCreateFn: function () {
                        var fields = this.$refs.jobInfoForm;
                        var vue = this;
                        delete fields.formModel.id;
                        var commitData = fields.formModel;
                        commitData.author = yufp.session.userId;//新增负责人默认为登录人
                        var glueType = commitData.glueType;
                        if(glueType == "GLUE_GROOVY"){
                            commitData.glueRemark = this.ideEditor.sourceTemplate[0].glueRemark;
                            commitData.glueSource = this.ideEditor.sourceTemplate[0].glueSource;
                        }else if(glueType == "GLUE_SHELL"){
                            commitData.glueRemark = this.ideEditor.sourceTemplate[1].glueRemark;
                            commitData.glueSource = this.ideEditor.sourceTemplate[1].glueSource;
                        }else if(glueType == "GLUE_PYTHON"){
                            commitData.glueRemark = this.ideEditor.sourceTemplate[2].glueRemark;
                            commitData.glueSource = this.ideEditor.sourceTemplate[2].glueSource;
                        }else if(glueType == "GLUE_NODEJS"){
                            commitData.glueRemark = this.ideEditor.sourceTemplate[3].glueRemark;
                            commitData.glueSource = this.ideEditor.sourceTemplate[3].glueSource;
                        }else{
                            commitData.glueRemark = 'Bean模式代码初始化';
                            commitData.glueSource = '';
                        }
                        this.$refs.jobInfoForm.validate(function (valid) {
                            if (valid) {
                                yufp.service.request({
                                    method: 'POST',
                                    url: backend.adminService + "/api/xxljobinfo/add",
                                    data: commitData,
                                    callback: function (code, message, response) {
                                        if (response.code == 200) {
                                            vue.dialogVisible = false;
                                            vue.$message({message: '数据保存成功！'});
                                            vue.queryMainGridFn()
                                        } else {
                                            vue.$message({message: response.msg, type: 'warning'});
                                        }
                                    }
                                });
                            }
                        });
                    },
                    //修改保存
                    saveEditFn: function () {
                        var fields = this.$refs.jobInfoForm;
                        var vue = this;
                        fields.formModel.author = yufp.session.userId;//修改负责人默认改为登录人
                        this.$refs.jobInfoForm.validate(function (valid) {
                            if (valid) {
                                yufp.service.request({
                                    method: 'POST',
                                    url: backend.adminService + "/api/xxljobinfo/reschedule",
                                    data: fields.formModel,
                                    callback: function (code, message, response) {
                                        if (response.code == 200) {
                                            vue.dialogVisible = false;
                                            vue.$message({message: '数据保存成功！'});
                                            vue.queryMainGridFn()
                                        } else {
                                            vue.$message({message: response.msg, type: 'warning'});
                                        }
                                    }
                                });
                            }
                        });
                    },
                    //删除
                    deleteFn: function () {
                        var vue = this;
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        var id = this.$refs.jobInfoTable.selections[0].id;
                        vue.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            yufp.service.request({
	                            method: 'POST',
	                            url: backend.adminService + "/api/xxljobinfo/remove?id=" + id,
	                            callback: function (code, message, response) {
	                                vue.$message({message: '数据删除成功！'});
	                                vue.queryMainGridFn();
	                            }
                        	});
                        })
                    },
                    //执行
                    triggerFn: function () {
                        var vue = this;
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        var id = this.$refs.jobInfoTable.selections[0].id;
                        vue.$confirm('确认执行?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/xxljobinfo/trigger?id=" + id,
                                callback: function (code, message, response) {
                                    vue.$message({message: '执行成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        })
                    },
                    //暂停
                    suspendFn: function () {
                        var vue = this;
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        var row = this.$refs.jobInfoTable.selections[0];
                        var id = '';
                        if (row.glueRemark === 'NORMAL') {
                            id = row.id
                        } else {
                            vue.$message({message: '只能选择NORMAL状态的数据', type: 'warning'});
                            return;
                        }
                        this.$confirm('确认暂停?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/xxljobinfo/pause?id=" + id,
                                callback: function (code, message, response) {
                                    vue.$message({message: '暂停成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        });
                    },
                    //恢复
                    recoveryFn: function () {
                        var vue = this;
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        var row = this.$refs.jobInfoTable.selections[0];
                        var id = '';
                        if (row.glueRemark === 'PAUSED') {
                            id = row.id
                        } else {
                            this.$message({message: '只能选择PAUSED状态的数据', type: 'warning'});
                            return;
                        }
                        this.$confirm('确认恢复?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/xxljobinfo/resume?id=" + id,
                                callback: function (code, message, response) {
                                    vue.$message({message: '恢复成功！'});
                                    vue.queryMainGridFn()
                                }
                            });
                        })
                    },
                    //打开日志
                    openLogFn:function(){
                    	var vue = this;
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        var row = this.$refs.jobInfoTable.selections[0];
                        var id = row.id;
                    	//打开菜单页签
                    	yufp.frame.addTab({
                    		id: '0e81b99414cb4041ae753b4d19bae7e4',//FUNC_ID(业务功能编号)
                    		title: '调度日志', //MENU_NAME(菜单名称)
                    		key: '39c0cf27c05a4eff8aba3be93ccb4bf6', //UP_MENU_ID(上级菜单编号)
                    		data:id //给打开的页面传参
                    	});
                    },
                    //打开代码编辑器
                    openCodeEditFn: function () {
                        var vue = this;
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        var glueType = this.$refs.jobInfoTable.selections[0].glueType;

                        if(!(glueType == "GLUE_GROOVY" || glueType == "GLUE_SHELL" || glueType == "GLUE_PYTHON" || glueType == "GLUE_NODEJS")){
                            this.$message({message: '不支持的代码格式类型', type: 'warning'});
                            return;
                        }
                        this.editCodeDialogFormVisible = true;
                        this.$nextTick(function () {
                            var glueType = this.$refs.jobInfoTable.selections[0].glueType;
                            this.initIde(glueType);
                        });
                    },
                    //初始化代码编辑器
                    initIde: function (glueType) {
                        var ideEditor = this.$refs.ideEditor;
                        var mode = '';
                        if(glueType == "GLUE_GROOVY"){
                            mode = "text/x-java";
                        }else if(glueType == "GLUE_SHELL"){
                            mode = "text/x-sh";
                        }else if(glueType == "GLUE_PYTHON"){
                            mode = "text/x-python";
                        }else if(glueType == "GLUE_NODEJS"){
                            mode = "text/javascript";
                        }else{
                            this.$message({message: '不支持的代码格式类型', type: 'warning'});
                            return;
                        }
                        this.codeEditor = CodeMirror.fromTextArea(ideEditor, {
                            mode: mode,
                            styleActiveLine: true,
                            lineNumbers: true,
                            lineWrapping: true
                        });
                        this.codeEditor.setSize('1170px','400px');
                        this.codeEditor.setOption("theme", "3024-night");
                        this.initGetCode();
                    },
                    //读取服务器代码
                    initGetCode: function () {
                        // alert("选中的版本内容==>"+this.codeEditor.getValue());
                        var vue = this;
                        var row = this.$refs.jobInfoTable.selections[0];
                        vue.ideEditor.codeVersionOptions = [];
                        vue.ideEditor.thisSelectedCodeVersion = null;
                        vue.ideEditor.glueRemark = null;
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService + "/api/xxljobcode/getJobInfo",
                            data: {
                                jobId:row.id
                            },
                            callback: function (code, message, response) {
                                // debugger
                                vue.ideEditor.glueSource = response.content.jobInfo.glueSource;
                                vue.ideEditor.glueRemark = response.content.jobInfo.glueRemark;

                                if(response.content.jobInfo.glueSource == null){
                                    vue.codeEditor.setValue("");
                                }else{
                                    vue.codeEditor.setValue(response.content.jobInfo.glueSource);
                                }
                                var jobLogGlues = response.content.jobLogGlues;
                                if(jobLogGlues == null || jobLogGlues.length < 1){
                                    vue.ideEditor.codeVersionOptions = [];
                                }else{
                                    for(var i=0;i<jobLogGlues.length;i++){
                                        var option = {};
                                        option.value = jobLogGlues[i].id;
                                        option.label=jobLogGlues[i].glueRemark;
                                        option.glueSource=jobLogGlues[i].glueSource;
                                        vue.ideEditor.codeVersionOptions.push(option);
                                    }
                                }
                            }
                        })
                    },
                    //切换版本的时候读取新的内容
                    codeVersionChanged: function () {
                        var vue = this;
                        var codeVersionOptions =  vue.ideEditor.codeVersionOptions;
                        if(vue.ideEditor.thisSelectedCodeVersion == null && codeVersionOptions.length < 1){
                            //如果之前没选中过，则直接返回,解决清空历史版本选择框弹出提示的BUG
                            return;
                        }
                        vue.$confirm('此操作将替换正在编辑的代码, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(function () {
                            if(vue.ideEditor.thisSelectedCodeVersion !== null){
                                for(var i=0;i<codeVersionOptions.length;i++){
                                    if(codeVersionOptions[i].value == vue.ideEditor.thisSelectedCodeVersion){
                                        // vue.ideEditor.glueSource = codeVersionOptions[i].glueSource;
                                        vue.codeEditor.setValue(codeVersionOptions[i].glueSource);
                                        vue.ideEditor.glueRemark = codeVersionOptions[i].label;
                                        return;
                                    }
                                }
                            }
                        });
                    },
                    saveNewCode: function () {
                        if (this.$refs.jobInfoTable.selections.length != 1) {
                            this.$message({message: '请先选择一条记录', type: 'warning'});
                            return;
                        }
                        var row = this.$refs.jobInfoTable.selections[0];
                        var vue = this;
                        // var fields = this.$refs.ideEditorForm;
                        // this.$refs.ideEditorForm.resetFields();
                        if(vue.ideEditor.glueRemark == null || vue.ideEditor.glueRemark.length < 1){
                            vue.$message({message: "备注信息不能为空!", type: 'warning'});
                            return;
                        }
                        var jobLogGlues  = vue.ideEditor.codeVersionOptions;
                        for(var i=0;i<jobLogGlues.length;i++){
                            if(vue.ideEditor.glueRemark == jobLogGlues[i].label){
                                vue.$message({message: "备注信息不能和历史版本的重复!", type: 'warning'});
                                return;
                            }
                        }
                        yufp.service.request({
                            method: 'POST',
                            url: backend.adminService + "/api/xxljobcode/save",
                            data: {
                                id:row.id,
                                glueSource: vue.codeEditor.getValue(),
                                glueRemark: this.ideEditor.glueRemark,
                                // thisSelectedCodeVersion: this.ideEditor.thisSelectedCodeVersion
                            },
                            callback: function (code, message, response) {
                                if (response.code == 200) {
                                    vue.initGetCode();
                                    vue.$message({message: '数据保存成功！'});
                                } else {
                                    vue.$message({message: response.msg, type: 'warning'});
                                }
                            }
                        });
                    }
                }
            });
        };
    });