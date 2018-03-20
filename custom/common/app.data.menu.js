/**
 * 全局静态菜单数据
 * Created by jiangcheng on 2017/10/30.
 */

//菜单
var my_menus=[
    {
        text:'首页',
        icon:'el-icon-yx-home',
        isIndex:true,  // 标记为首页,唯一指定
        id:'dashboard'
    },
    {
        text:'基础教程',
        icon:'el-icon-yx-books',
        children:[
            { id: 'blank', text: '空白模板'},
            {
                id: 'commonWidgets',
                text: '常用组件',
                icon:'el-icon-yx-stack',
                children: [
                    { id: 'lookup', text: '封装字典管理器'},
                    { id: 'elTreeX', text: '封装树'},
                    { id: 'elTableX', text: '封装表格'},
                    { id: 'elTableXDoc', text: '封装表格-文档'},
                    { id: 'demoSelector', text: '自定义选择器'},
                    { id: 'elSelect', text: '封装下拉框'},
                    { id: 'elCascader', text: '封装级联下拉框'},
                    { id: 'tinymce', text: '富文本组件'},
                    { id: 'elforminput',text:'FormInput输入框'},
                    { id: 'elformtimeselect',text:'日期、时间选择器'},
                    { id: 'elformx', text:'Form组件'},
                    { id: 'exampleDraggable', text: '拖拽'},
                    { id: 'normalUpload', text: '普通文件上传'},
                    { id: 'asynctree', text: '异步树'}
                ]
            },
            {
                id: 'demo',
                text: '原生示例(不建议)',
                icon:'el-icon-yx-price-tag',
                children: [
                    { id: 'gridCrud', text: '增删改查'},
                    { id: 'multiplegrid', text: '普通多表头'},
                    { id: 'dynamicMultipleGrid', text: '动态多表头'},
                    { id: 'editorGrid', text: '可编辑表格'},
                    { id: 'treedemo', text: '左树右表格'},
                    { id: 'tab', text: 'TAB页签'},
                    { id: 'security', text: '全局异常示例'},
                    { id: 'form', text: '表单（日期、校验）'}
                ]
            },
            {
                text: '模板示例',
                icon:'el-icon-yx-folder-plus',
                children: [
                    {text: '查询类',icon:'el-icon-yx-search',children: [
                        { id: 'exampleQuery', text: '普通查询'},
                        { id: 'exampleTree', text: '树+查询'},
                        { id: 'exampleEdit', text: '查询+表单（编辑）'},
                        { id: 'searchTable', text: '查询+表格（主从表）'},
                        { id: 'tabSearch', text: 'Tab页签+查询'},
                        { id: 'queryNestedTable', text: '查询嵌套表格'},
                        { id: 'queryNestedForm', text: '查询嵌套表单'}
                    ]},
                    {text: '表单类',icon:'el-icon-yx-ungroup',children: [
                        { id: 'exampleForm', text: '普通表单（编辑）'},
                        { id: 'exampleFormInfo', text: '普通表单（详情）'},
                        { id: 'exampleGroup', text: '分组表单'},
                        { id: 'tableList', text: '表单+列表'},
                        { id: 'tabform', text: 'Tab页签表单'},
                        { id: 'formNestTabs', text: '表单内嵌套Tabs'},
                        { id: 'exampleSteps1', text: 'Steps步骤表单'}
                    ]}
                ]
            }

            //响应式布局
            //定制化布局——首页                     ok
            //多tab页支持                          ok
            //表格（普通、可编辑、定制化显示、排序）  ok
            //图表（首页）                         ok
            //组件（日期、下拉列表、组合框、轮播图、模态框、分页、表单校验）
            //文件（上传、下载、预览、打印）
            //内容管理（发布、展示）是否富文本？
            //动静分离？
            //安全控件？移动APP?密码控件？
        ]
    }
];
