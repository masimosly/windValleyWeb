/**
 * Created by liaoxd on 2017/12/17.
 */
define([
    './custom/widgets/js/yufpOrgTree.js'
], function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
       
        //创建virtual filter model
        var vm =  yufp.custom.vue({
            //TODO 请替换此id参数这个id 需要和html 里面那个id 一致
            el: "#funcmng",
            //以m_开头的参数为UI数据不作为业务数据，否则为业务数据
            data: function(){
            	var me = this;
            	return{
            		serviceUrl:backend.adminService+'/funcmenu/list/',
	            	idView: false,
	                height: yufp.custom.viewSize().height - 140,
	                userId: yufp.session.userId,
	                iconDialogVisible:false,
	                queryFields: [
                        {placeholder: '菜单名称', field: 'menuName', type: 'input'},
                        {placeholder: '父级菜单名称', field: 'upMenuName', type: 'select',options:[{"key":"系统管理","value":"系统管理"},{"key":"服务管理","value":"服务管理"}]}
                    ],
                    queryButtons: [
                        {label: '搜索', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if(valid){
                                var param = { condition: JSON.stringify(model) };
                                me.$refs.filterTable.remoteData(param);                             
                            }
                        }},
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                    ],	
                    
                    
                    tableColumns: [
                        { label: '菜单ID',
                            prop: 'title',
                            width: 200,
                            sortable: true,
                            resizable: true,
                            template: function () {    
                                return '<template scope="scope">\
                                    <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-row-click\', scope)">{{ scope.row.menuId }}</a>\
                                </template>';
                            }
                        },
                        
                        
                        { label: '菜单名称', prop: 'menuName', width: 200 },                  
                        { label: '父级菜单名称', prop: 'upMenuName', width: 250 },
                        { label: '功能ID', prop: 'funcId', width: 130},
                        { label: '代码路径', prop: 'funcUrl', width: 214 }
                    ],
                    
                    updateFields: [{
                        columnCount: 1,
                        fields: [                        
                            { field: 'menuId', label: '菜单ID',disabled:true},
                            { field: 'menuName',label: '菜单名称'},
                            { field: 'menuIcon', label: '图标',icon:'search',click:function(){
								me.iconDialogVisible=true;
                    			}
                    		},
                    		{ field: 'leafFlag',label: '是否叶子菜单',type:'select',options:[{"key":"Y","value":"是"},{"key":"N","value":"否"}]},
                            { field: 'upMenuId',label: '上级菜单',type:'select',options:[{"key":"gm-30000","value":"系统管理"},{"key":"gm-40000","value":"服务管理"}]},
                            { field: 'funcId', label: '功能标识',rules: [{required: true, message: '必填项', trigger: 'blur'}]},
                            { field: 'funcUrl', label: '代码路径',rules: [{required: true, message: '必填项', trigger: 'blur'}]}
                        ]
                    }],
                    
                    detailFields:[{
                        columnCount:1,
                        fields: [                        
                            { field: 'menuId', label: '菜单ID'},
                            { field: 'menuName',label: '菜单名称'},
                            { field: 'upMenuName', label: '父级菜单名'},
                            { field: 'menuIcon', label: '功能图标'},
                            { field: 'funcId', label: '功能ID'},
                            { field: 'funcUrl', label: '代码路径'}
                        ]
                    }],
                    
                    
                    updateButtons: [
                        {label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.dialogVisible = false;
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
	                        	me.createFilter(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                       	}
                           
                        }},
                        {label: '保存', type: 'primary', icon: "check", hidden: false, op: 'submit',click: function (model,valid) {
                        	if(valid){
                        		model.lastChgUsr = me.userId;
	                        	me.dataFliterEditFn(model);                      	
	                            me.dialogVisible = false;
	                            me.$refs.filterTable.remoteData();
	                        }
                           
                        }}
                        
                    ],
                    //表单是否显示
                    icons:["el-icon-yx-chart-1", "el-icon-yx-chart-2", "el-icon-yx-chart-3", "el-icon-yx-flow-1", "el-icon-yx-flow-2", "el-icon-yx-flow-3", "el-icon-yx-menu-1", "el-icon-yx-menu-2", "el-icon-yx-menu-3", "el-icon-yx-menu-4", "el-icon-yx-msg-1", "el-icon-yx-msg-2", "el-icon-yx-msg-3", "el-icon-yx-msg-4", "el-icon-yx-switch-1", "el-icon-yx-switch-2", "el-icon-yx-switch-3", "el-icon-yx-themes-1", "el-icon-yx-themes-2", "el-icon-yx-themes-3", "el-icon-yx-themes-4", "el-icon-yx-home", "el-icon-yx-home2", "el-icon-yx-home3", "el-icon-yx-office", "el-icon-yx-newspaper", "el-icon-yx-pencil", "el-icon-yx-pencil2", "el-icon-yx-quill", "el-icon-yx-pen", "el-icon-yx-blog", "el-icon-yx-eyedropper", "el-icon-yx-droplet", "el-icon-yx-paint-format", "el-icon-yx-image", "el-icon-yx-images", "el-icon-yx-camera", "el-icon-yx-headphones", "el-icon-yx-music", "el-icon-yx-play", "el-icon-yx-film", "el-icon-yx-video-camera", "el-icon-yx-dice", "el-icon-yx-pacman", "el-icon-yx-spades", "el-icon-yx-clubs", "el-icon-yx-diamonds", "el-icon-yx-bullhorn", "el-icon-yx-connection", "el-icon-yx-podcast", "el-icon-yx-feed", "el-icon-yx-mic", "el-icon-yx-book", "el-icon-yx-books", "el-icon-yx-library", "el-icon-yx-file-text", "el-icon-yx-profile", "el-icon-yx-file-empty", "el-icon-yx-files-empty", "el-icon-yx-file-text2", "el-icon-yx-file-picture", "el-icon-yx-file-music", "el-icon-yx-file-play", "el-icon-yx-file-video", "el-icon-yx-file-zip", "el-icon-yx-copy", "el-icon-yx-paste", "el-icon-yx-stack", "el-icon-yx-folder", "el-icon-yx-folder-open", "el-icon-yx-folder-plus", "el-icon-yx-folder-minus", "el-icon-yx-folder-download", "el-icon-yx-folder-upload", "el-icon-yx-price-tag", "el-icon-yx-price-tags", "el-icon-yx-barcode", "el-icon-yx-qrcode", "el-icon-yx-ticket", "el-icon-yx-cart?", "el-icon-yx-coin-dollar", "el-icon-yx-coin-euro", "el-icon-yx-coin-pound", "el-icon-yx-coin-yen", "el-icon-yx-credit-card", "el-icon-yx-calculator", "el-icon-yx-lifebuoy", "el-icon-yx-phone", "el-icon-yx-phone-hang-up", "el-icon-yx-address-book", "el-icon-yx-envelop", "el-icon-yx-pushpin", "el-icon-yx-location", "el-icon-yx-location2", "el-icon-yx-compass", "el-icon-yx-compass2", "el-icon-yx-map", "el-icon-yx-map2", "el-icon-yx-history", "el-icon-yx-clock", "el-icon-yx-clock2", "el-icon-yx-alarm", "el-icon-yx-bell", "el-icon-yx-stopwatch", "el-icon-yx-calendar", "el-icon-yx-printer", "el-icon-yx-keyboard", "el-icon-yx-display", "el-icon-yx-laptop", "el-icon-yx-mobile", "el-icon-yx-mobile2", "el-icon-yx-tablet", "el-icon-yx-tv", "el-icon-yx-drawer", "el-icon-yx-drawer2", "el-icon-yx-box-add", "el-icon-yx-box-remove", "el-icon-yx-download", "el-icon-yx-upload", "el-icon-yx-floppy-disk", "el-icon-yx-drive", "el-icon-yx-database", "el-icon-yx-undo", "el-icon-yx-redo", "el-icon-yx-undo2", "el-icon-yx-redo2", "el-icon-yx-forward", "el-icon-yx-reply", "el-icon-yx-bubble", "el-icon-yx-bubbles", "el-icon-yx-bubbles2", "el-icon-yx-bubble2", "el-icon-yx-bubbles3", "el-icon-yx-bubbles4", "el-icon-yx-user", "el-icon-yx-users", "el-icon-yx-user-plus", "el-icon-yx-user-minus", "el-icon-yx-user-check", "el-icon-yx-user-tie", "el-icon-yx-quotes-left", "el-icon-yx-quotes-right", "el-icon-yx-hour-glass", "el-icon-yx-spinner", "el-icon-yx-spinner2", "el-icon-yx-spinner3", "el-icon-yx-spinner4", "el-icon-yx-spinner5", "el-icon-yx-spinner6", "el-icon-yx-spinner7", "el-icon-yx-spinner8", "el-icon-yx-spinner9", "el-icon-yx-spinner10", "el-icon-yx-spinner11", "el-icon-yx-binoculars", "el-icon-yx-search", "el-icon-yx-zoom-in", "el-icon-yx-zoom-out", "el-icon-yx-enlarge", "el-icon-yx-shrink", "el-icon-yx-enlarge2", "el-icon-yx-shrink2", "el-icon-yx-key", "el-icon-yx-key2", "el-icon-yx-lock", "el-icon-yx-unlocked", "el-icon-yx-wrench", "el-icon-yx-equalizer", "el-icon-yx-equalizer2", "el-icon-yx-cog", "el-icon-yx-cogs", "el-icon-yx-hammer", "el-icon-yx-magic-wand", "el-icon-yx-aid-kit", "el-icon-yx-bug", "el-icon-yx-pie-chart", "el-icon-yx-stats-dots", "el-icon-yx-stats-bars", "el-icon-yx-stats-bars2", "el-icon-yx-trophy", "el-icon-yx-gift", "el-icon-yx-glass", "el-icon-yx-glass2", "el-icon-yx-mug", "el-icon-yx-spoon-knife", "el-icon-yx-leaf", "el-icon-yx-rocket", "el-icon-yx-meter", "el-icon-yx-meter2", "el-icon-yx-hammer2", "el-icon-yx-fire", "el-icon-yx-lab", "el-icon-yx-magnet", "el-icon-yx-bin", "el-icon-yx-bin2", "el-icon-yx-briefcase", "el-icon-yx-airplane", "el-icon-yx-truck", "el-icon-yx-road", "el-icon-yx-accessibility", "el-icon-yx-target", "el-icon-yx-shield", "el-icon-yx-power", "el-icon-yx-switch", "el-icon-yx-power-cord", "el-icon-yx-clipboard", "el-icon-yx-list-numbered", "el-icon-yx-list", "el-icon-yx-list2", "el-icon-yx-tree", "el-icon-yx-menu", "el-icon-yx-menu2", "el-icon-yx-menu3", "el-icon-yx-menu4", "el-icon-yx-cloud", "el-icon-yx-cloud-download", "el-icon-yx-cloud-upload", "el-icon-yx-cloud-check", "el-icon-yx-download2", "el-icon-yx-upload2", "el-icon-yx-download3", "el-icon-yx-upload3", "el-icon-yx-sphere", "el-icon-yx-earth", "el-icon-yx-link", "el-icon-yx-flag", "el-icon-yx-attachment", "el-icon-yx-eye", "el-icon-yx-eye-plus", "el-icon-yx-eye-minus", "el-icon-yx-eye-blocked", "el-icon-yx-bookmark", "el-icon-yx-bookmarks", "el-icon-yx-sun", "el-icon-yx-contrast", "el-icon-yx-brightness-contrast", "el-icon-yx-star-empty", "el-icon-yx-star-half", "el-icon-yx-star-full", "el-icon-yx-heart", "el-icon-yx-heart-broken", "el-icon-yx-man", "el-icon-yx-woman", "el-icon-yx-man-woman", "el-icon-yx-happy", "el-icon-yx-happy2", "el-icon-yx-smile", "el-icon-yx-smile2", "el-icon-yx-tongue", "el-icon-yx-tongue2", "el-icon-yx-sad", "el-icon-yx-sad2", "el-icon-yx-wink", "el-icon-yx-wink2", "el-icon-yx-grin", "el-icon-yx-grin2", "el-icon-yx-cool", "el-icon-yx-cool2", "el-icon-yx-angry", "el-icon-yx-angry2", "el-icon-yx-evil", "el-icon-yx-evil2", "el-icon-yx-shocked", "el-icon-yx-shocked2", "el-icon-yx-baffled", "el-icon-yx-baffled2", "el-icon-yx-confused", "el-icon-yx-confused2", "el-icon-yx-neutral", "el-icon-yx-neutral2", "el-icon-yx-hipster", "el-icon-yx-hipster2", "el-icon-yx-wondering", "el-icon-yx-wondering2", "el-icon-yx-sleepy", "el-icon-yx-sleepy2", "el-icon-yx-frustrated", "el-icon-yx-frustrated2", "el-icon-yx-crying", "el-icon-yx-crying2", "el-icon-yx-point-up", "el-icon-yx-point-right", "el-icon-yx-point-down", "el-icon-yx-point-left", "el-icon-yx-warning", "el-icon-yx-notification", "el-icon-yx-question", "el-icon-yx-plus", "el-icon-yx-minus", "el-icon-yx-info", "el-icon-yx-cancel-circle", "el-icon-yx-blocked", "el-icon-yx-cross", "el-icon-yx-checkmark", "el-icon-yx-checkmark2", "el-icon-yx-spell-check", "el-icon-yx-enter", "el-icon-yx-exit", "el-icon-yx-play2", "el-icon-yx-pause", "el-icon-yx-stop", "el-icon-yx-previous", "el-icon-yx-next", "el-icon-yx-backward", "el-icon-yx-forward2", "el-icon-yx-play3", "el-icon-yx-pause2", "el-icon-yx-stop2", "el-icon-yx-backward2", "el-icon-yx-forward3", "el-icon-yx-first", "el-icon-yx-last", "el-icon-yx-previous2", "el-icon-yx-next2", "el-icon-yx-eject", "el-icon-yx-volume-high", "el-icon-yx-volume-medium", "el-icon-yx-volume-low", "el-icon-yx-volume-mute", "el-icon-yx-volume-mute2", "el-icon-yx-volume-increase", "el-icon-yx-volume-decrease", "el-icon-yx-loop", "el-icon-yx-loop2", "el-icon-yx-infinite", "el-icon-yx-shuffle", "el-icon-yx-arrow-up-left", "el-icon-yx-arrow-up", "el-icon-yx-arrow-up-right", "el-icon-yx-arrow-right", "el-icon-yx-arrow-down-right", "el-icon-yx-arrow-down", "el-icon-yx-arrow-down-left", "el-icon-yx-arrow-left", "el-icon-yx-arrow-up-left2", "el-icon-yx-arrow-up2", "el-icon-yx-arrow-up-right2", "el-icon-yx-arrow-right2", "el-icon-yx-arrow-down-right2", "el-icon-yx-arrow-down2", "el-icon-yx-arrow-down-left2", "el-icon-yx-arrow-left2", "el-icon-yx-circle-up", "el-icon-yx-circle-right", "el-icon-yx-circle-down", "el-icon-yx-circle-left", "el-icon-yx-tab", "el-icon-yx-move-up", "el-icon-yx-move-down", "el-icon-yx-sort-alpha-asc", "el-icon-yx-sort-alpha-desc", "el-icon-yx-sort-numeric-asc", "el-icon-yx-sort-numberic-desc", "el-icon-yx-sort-amount-asc", "el-icon-yx-sort-amount-desc", "el-icon-yx-command", "el-icon-yx-shift", "el-icon-yx-ctrl", "el-icon-yx-opt", "el-icon-yx-checkbox-checked", "el-icon-yx-checkbox-unchecked", "el-icon-yx-radio-checked", "el-icon-yx-radio-checked2", "el-icon-yx-radio-unchecked", "el-icon-yx-crop", "el-icon-yx-make-group", "el-icon-yx-ungroup", "el-icon-yx-scissors", "el-icon-yx-filter", "el-icon-yx-font", "el-icon-yx-ligature", "el-icon-yx-ligature2", "el-icon-yx-text-height", "el-icon-yx-text-width", "el-icon-yx-font-size", "el-icon-yx-bold", "el-icon-yx-underline", "el-icon-yx-italic", "el-icon-yx-strikethrough", "el-icon-yx-omega", "el-icon-yx-sigma", "el-icon-yx-page-break", "el-icon-yx-superscript", "el-icon-yx-subscript", "el-icon-yx-superscript2", "el-icon-yx-subscript2", "el-icon-yx-text-color", "el-icon-yx-pagebreak", "el-icon-yx-clear-formatting", "el-icon-yx-table", "el-icon-yx-table2", "el-icon-yx-insert-template", "el-icon-yx-pilcrow", "el-icon-yx-ltr", "el-icon-yx-rtl", "el-icon-yx-section", "el-icon-yx-paragraph-left", "el-icon-yx-paragraph-center", "el-icon-yx-paragraph-right", "el-icon-yx-paragraph-justify", "el-icon-yx-indent-increase", "el-icon-yx-indent-decrease", "el-icon-yx-share", "el-icon-yx-new-tab", "el-icon-yx-embed", "el-icon-yx-embed2", "el-icon-yx-terminal", "el-icon-yx-share2", "el-icon-yx-mail", "el-icon-yx-mail2", "el-icon-yx-mail3", "el-icon-yx-mail4", "el-icon-yx-amazon", "el-icon-yx-google", "el-icon-yx-google2", "el-icon-yx-google3", "el-icon-yx-google-plus", "el-icon-yx-google-plus2", "el-icon-yx-google-plus3", "el-icon-yx-hangouts", "el-icon-yx-google-drive", "el-icon-yx-facebook", "el-icon-yx-facebook2", "el-icon-yx-instagram", "el-icon-yx-whatsapp", "el-icon-yx-spotify", "el-icon-yx-telegram", "el-icon-yx-twitter", "el-icon-yx-vine", "el-icon-yx-vk", "el-icon-yx-renren", "el-icon-yx-sina-weibo", "el-icon-yx-rss", "el-icon-yx-rss2", "el-icon-yx-youtube", "el-icon-yx-youtube2", "el-icon-yx-twitch", "el-icon-yx-vimeo", "el-icon-yx-vimeo2", "el-icon-yx-lanyrd", "el-icon-yx-flickr", "el-icon-yx-flickr2", "el-icon-yx-flickr3", "el-icon-yx-flickr4", "el-icon-yx-dribbble", "el-icon-yx-behance", "el-icon-yx-behance2", "el-icon-yx-deviantart", "el-icon-yx-500px", "el-icon-yx-steam", "el-icon-yx-steam2", "el-icon-yx-dropbox", "el-icon-yx-onedrive", "el-icon-yx-github", "el-icon-yx-npm", "el-icon-yx-basecamp", "el-icon-yx-trello", "el-icon-yx-wordpress", "el-icon-yx-joomla", "el-icon-yx-ello", "el-icon-yx-blogger", "el-icon-yx-blogger2", "el-icon-yx-tumblr", "el-icon-yx-tumblr2", "el-icon-yx-yahoo", "el-icon-yx-yahoo2", "el-icon-yx-tux", "el-icon-yx-appleinc", "el-icon-yx-finder", "el-icon-yx-android", "el-icon-yx-windows", "el-icon-yx-windows8", "el-icon-yx-soundcloud", "el-icon-yx-soundcloud2", "el-icon-yx-skype", "el-icon-yx-reddit", "el-icon-yx-hackernews", "el-icon-yx-wikipedia", "el-icon-yx-linkedin", "el-icon-yx-linkedin2", "el-icon-yx-lastfm", "el-icon-yx-lastfm2", "el-icon-yx-delicious", "el-icon-yx-stumbleupon", "el-icon-yx-stumbleupon2", "el-icon-yx-stackoverflow", "el-icon-yx-pinterest", "el-icon-yx-pinterest2", "el-icon-yx-xing", "el-icon-yx-xing2", "el-icon-yx-flattr", "el-icon-yx-foursquare", "el-icon-yx-yelp", "el-icon-yx-paypal", "el-icon-yx-chrome", "el-icon-yx-firefox", "el-icon-yx-IE", "el-icon-yx-edge", "el-icon-yx-safari", "el-icon-yx-opera", "el-icon-yx-file-pdf", "el-icon-yx-file-openoffice", "el-icon-yx-file-word"],
                    dialogVisible: false,
                    //详情表单
                    detaildialogVisible :false,
                    //表单是否可用
                    formDisabled: false,
                    //表单操作状态
                    viewType: 'DETAIL',
                    //表单多选
	                selections:[],
	                defaultInstuId:'100',
	                
	                myoptions:[],
	                filterGrid: {
		               	//系统参数当前行
		                currentRow: null,	             
		                //系统参数多选ID
		                multipleSelection: '',	              
	                    data: null,
	                    subdata:null,
	                    total: null,
	                    loading: true,
	                    subloading:true,
	                    
	                    paging: {
	                        page: 1,
	                        pageSize: 10
	                    },
	                    //系统参数模糊查询表头
	                    query: {
		                    menuName: '',
		                    upMenuName: ''
	                	}
	               
	                } 
               }
            },
            mounted: function(){
            	
            	
            },
            methods: {
            	
            	iconSelect:function(event){
        			var iconName = event.target.className;
        			var formModel = yufp.extend({}, this.$refs.datafilterForm.formModel);
					formModel.menuIcon = iconName;
					this.$refs.datafilterForm.formModel = yufp.extend({},formModel);
            		this.iconDialogVisible=false;
        		}
              ,
                rowClickFn: function(selection,row) {

                	this.selections = selection;
                	//用于单个修改
                	this.filterGrid.currentRow = row;              
                }, 
                detailFn:function(scope){
          	 
                	this.viewType = 'DETAIL';
                	this.detaildialogVisible = true;
                	
                	this.$nextTick(function () {
                        this.$refs.detailForm.formModel = scope.row;
                  	});
                	
                },

                //编辑按钮
                lookuptableEditFn: function () {
                	
                	if(this.$refs.filterTable.selections.length < 1 ){
                		vm.$message({ message: '请选择一条记录修改!' });
                		return false;
                	}
                	if(this.$refs.filterTable.selections.length > 1 ){
                		vm.$message({ message: '只能选择一条记录修改!' });
                		return false;
                	}
                	          	 
                	this.viewType = 'UPDATE';
                	vm.dialogVisible = true;         	 
                	this.$nextTick(function () {
                        yufp.extend(this.$refs.datafilterForm.formModel, this.$refs.filterTable.selections[0]);
                    });
		             
                },
                
                
                //修改
                dataFliterEditFn: function (row) {
                	 this.filterGrid.currentRow = row ;  
                	 
		             yufp.service.request({
		                url: backend.adminService+'/funcmenu/update',		           
		                method: 'post',
		                data: this.filterGrid.currentRow,
		                callback: function (code, message, response) {
		                    if (code == '0') {		                        		                       
		                        vm.$message({ message: '修改成功!' });
		                        vm.$refs.filterTable.remoteData();
		                    } else {
		                        vm.$message({ message: '修改失败!' });
		                    }		
		                }
		            });
                },
                
                //增加系统参数空行
                 addFilterRecord:function(){
				    this.dialogVisible = true;
                 	this.viewType = 'ADD';
				    
				    this.$nextTick(function () {
                        this.$refs.datafilterForm.resetFields();
                    });
				   
				 },
				
				 //保存新增用户
				 createFilter: function (row) {
				 	this.filterGrid.currentRow = row;
                	yufp.service.request({
		                url: backend.adminService+'/funcmenu/add',		           
		                method: 'post',
		                data: this.filterGrid.currentRow,
		                callback: function (code, message, response) {
		                    if (code == '0') {		
				                vm.$message({ message: '保存成功!' });	
		                        vm.$refs.filterTable.remoteData();
		                    } else {
		                    	vm.$message({ message: '保存失败!' });	
		                    }
		
		                }
		            });
                },

                //批量删除
                dataFiltermultDeleteFn: function () {
                		var ids='';
	                	var filterSelecttions = this.$refs.filterTable.selections;  
	                	if(filterSelecttions.length > 0){
	                		for(var i=0;i<filterSelecttions.length;i++){
	                			//记录多选用于多删
	                			if(filterSelecttions.length === 1){
	                				ids = filterSelecttions[i].menuId;  
	                			}else{
	                				ids = ids + ',' + filterSelecttions[i].menuId;
	                			}
	                   			                      			
	                   		}               	
	                	}else{
	                		vm.$message({ message: '请选择需要删除的用户!' });	
	                		return false;
	                	}                              
	                	vm.$confirm('确认批量删除用户?', '提示', {
	              			confirmButtonText: '确定',
	              			cancelButtonText: '取消',
	              			type: 'warning'
	              		}).then(function() {
	              			yufp.service.request({
				                url: backend.adminService+'/funcmenu/deletes/'+ids,		           
				                method: 'post',
				                data: vm.filterGrid.currentRow,
				                callback: function (code, message, response) {
				                    if (code == '0') {
				                    	vm.$message({ message: '删除成功!' });	
				                        vm.$refs.filterTable.remoteData();		                        
				                    } else {
				                    	vm.$message({ message: '删除失败!' });	
				                    }
				
				                }
				            });

	              		});
		            
		            
                }
               
                
            },
            filters: {
            
            },
            watch: {
            	viewType:function(value){
            		 	if (value == 'ADD') {
                            this.updateButtons[1].hidden = false;
                            this.updateButtons[2].hidden = true;
                            this.detaildialogVisible = false;
                        } else if (value == 'UPDATE') {
                            this.updateButtons[1].hidden = true;
                            this.updateButtons[2].hidden = false;
                            this.detaildialogVisible = false;

                        } else if (value == 'DETAIL') {
                         	this.detaildialogVisible = true;
                        }
            	}
		      
		    }
        });
    };
    

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }

});