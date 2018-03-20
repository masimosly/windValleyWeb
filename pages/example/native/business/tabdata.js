/**
 *
 * @authors Your Name (you@example.org)
 * @date    2018-01-03 15:20:17
 * @version $Id$
 */

var orgTreeParams = [{
	name: "disabled",
	remark: "是否禁用放大镜",
	type: 'Boolean',
	option: '—',
	default: false
}, {
	name: "size",
	remark: "输入框尺寸",
	type: 'String',
	option: 'large, small, mini',
	default: 'small'
}, {
	name: "params",
	remark: "额外的参数,以下参数都是该参数的一个属性",
	type: 'Object',
	option: '-',
	default: '-'
}, {
	name: "need-checkbox",
	remark: "是否需要复选框",
	type: 'String',
	option: 'large, small, mini',
	default: 'small'
}, {
	name: "check-strictly",
	remark: "在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false",
	type: 'Boolean',
	option: '-',
	default: 'false'
}, {
	name: "default-expand-all",
	remark: "是否默认展开所有节点",
	type: 'Boolean',
	option: '-',
	default: 'false'
}, {
	name: "expand-level",
	remark: "树默认展开层级,默认展开两层,只有当default-expand-all为false才起作用",
	type: 'Number',
	option: '-',
	default: '2'
}, {
	name: "placeholder",
	remark: "输入框占位文本",
	type: 'String',
	option: '-',
	default: '请选择机构'
}, {
	name: "height",
	remark: "机构树高度",
	type: 'Number',
	option: '-',
	default: '400'
}, {
	name: "data-id",
	remark: "树数据子节点",
	type: 'String',
	option: '-',
	default: 'orgId'
}, {
	name: "data-label",
	remark: "树节点展示名称",
	type: 'String',
	option: '-',
	default: 'orgName'
}, {
	name: "data-pid",
	remark: "树节点父节点",
	type: 'String',
	option: '-',
	default: 'upOrgId'
}, {
	name: "data-root",
	remark: "树根节点,现在可以不填,也可以设置为对象",
	type: 'String',
	option: '-',
	default: '500'
}, {
	name: "root-visible",
	remark: "根节点可见性",
	type: 'Boolean',
	option: '-',
	default: 'true'
}, {
	name: "data-params",
	remark: "树查询传递参数",
	type: 'Object',
	option: '-',
	default: '-'
}, {
	name: "search-type",
	remark: "查询类型,默认为查询当前",
	type: 'String',
	option: 'ALL_ORG,CUR_ORG',
	default: 'CUR_ORG'
}, {
	name: "data-url",
	remark: "树查询url",
	type: 'String',
	option: '-',
	default: 'backend.adminService + "/api/util/getorg"'
}, {
	name: "data-params",
	remark: "树查询传递参数,以下为参数列表",
	type: 'Object',
	option: '-',
	default: '-'
}, {
	name: "userId",
	remark: "用户id,默认为session用户id",
	type: 'String',
	option: '-',
	default: '-'
}, {
	name: "orgCode",
	remark: "用户所属机构代码,默认为session用户机构code",
	type: 'String',
	option: '-',
	default: '-'
}, {
	name: "needFin",
	remark: "是否需要金融机构",
	type: 'Boolean',
	option: '-',
	default: 'false'
}, {
	name: "needManage",
	remark: "是否需要管理机构",
	type: 'Boolean',
	option: '-',
	default: 'false'
}, {
	name: "needDpt",
	remark: "是否需要部门",
	type: 'Boolean',
	option: '-',
	default: 'false'
}, {
	name: "orgLevel",
	remark: "机构层级,为0时查询所有层级,若为1-5时查询小该层级的数据",
	type: 'Number',
	option: '-',
	default: 0
}];

var userTableParams=[{
	name: "height",
	remark: "弹出框高度",
	type: 'String',
	option: '-',
	default: '400px'
},{
	name: "width",
	remark: "弹出框宽度",
	type: 'String',
	option: '-',
	default: '1000px'
},{
	name:"user",
	remark: "用户表格参数,以下参数均在该对象里面",
	type: 'Object',
	option: '-',
	default: '-'
},{
	name:"checkbox",
	remark: "table是否需要复选框",
	type: 'Boolean',
	option: '-',
	default: 'true'
},{
	name:"dataParams",
	remark: "用户信息查询传递参数,主要用来传递roleId,dutyId来控制条件输入框角色和岗位的显示和隐藏",
	type: 'Object',
	option: '-',
	default: '-'
}];