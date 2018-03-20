/**
 * @Description: 业务功能管理
 * @Date 2017/12/5 9：30
 * @Authoer: weimei
 */
define(function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        yufp.lookup.reg('YESNO');
        var vm = yufp.custom.vue({
            el: "#functionManage",
            data: function () {
                var me = this;
                //业务功能url格式校验
                var urlValidate = function (rule, value, callback) {
                    var reg = /^pages\/([a-zA-Z0-9_]+\/)+[a-zA-Z0-9_]+$/;
                    if (!reg.test(value)) {
                        callback(new Error("请输入合法格式URL链接"));
                        return;
                    }
                    callback();
                };
                //业务功能顺序校验
                var orderValidate = function(rule,value,callback){
                    var reg = /^\d{0,4}$/
                    if (!reg.test(value)) {
                        callback(new Error("顺序格式不正确"));
                        return;
                    }
                    callback();
                };
                return {
                    viewType: 'DETAIL',
                    viewTitle: yufp.lookup.find('CRUD_TYPE', false),
                    iconDialogVisible: false,
                    modCurrentRow: '',
                    height: yufp.frame.size().height - 103 - 56,
                    modFormDisabled: false,
                    funcFormDisabled: false,
                    modDialogVisible: false,
                    funcDialogVisible: false,
                    modAddCheck: !yufp.session.checkCtrl('add_mod'), //新增模块按钮控制
                    modModifyCheck: !yufp.session.checkCtrl('modify_mod'), //模块修改按钮控制
                    modDeleteCheck: !yufp.session.checkCtrl('delete_mod'), //模块删除按钮控制
                    funcAddCheck: !yufp.session.checkCtrl('add_func'), //业务功能新增按钮控制
                    funcModifyCheck: !yufp.session.checkCtrl('modify_func'), //业务功能修改按钮控制
                    funcDeleteCheck: !yufp.session.checkCtrl('delete_func'), //业务功能删除按钮控制
                    modDataUrl: backend.adminService + "/api/adminsmfuncmod/querymod",
                    funcDataUrl: backend.adminService + "/api/adminsmbusifunc/queryfunc",
                    icons: ["el-icon-yx-chart-1", "el-icon-yx-chart-2", "el-icon-yx-chart-3", "el-icon-yx-flow-1", "el-icon-yx-flow-2", "el-icon-yx-flow-3", "el-icon-yx-menu-1", "el-icon-yx-menu-2", "el-icon-yx-menu-3", "el-icon-yx-menu-4", "el-icon-yx-msg-1", "el-icon-yx-msg-2", "el-icon-yx-msg-3", "el-icon-yx-msg-4", "el-icon-yx-switch-1", "el-icon-yx-switch-2", "el-icon-yx-switch-3", "el-icon-yx-themes-1", "el-icon-yx-themes-2", "el-icon-yx-themes-3", "el-icon-yx-themes-4", "el-icon-yx-home", "el-icon-yx-home2", "el-icon-yx-home3", "el-icon-yx-office", "el-icon-yx-newspaper", "el-icon-yx-pencil", "el-icon-yx-pencil2", "el-icon-yx-quill", "el-icon-yx-pen", "el-icon-yx-blog", "el-icon-yx-eyedropper", "el-icon-yx-droplet", "el-icon-yx-paint-format", "el-icon-yx-image", "el-icon-yx-images", "el-icon-yx-camera", "el-icon-yx-headphones", "el-icon-yx-music", "el-icon-yx-play", "el-icon-yx-film", "el-icon-yx-video-camera", "el-icon-yx-dice", "el-icon-yx-pacman", "el-icon-yx-spades", "el-icon-yx-clubs", "el-icon-yx-diamonds", "el-icon-yx-bullhorn", "el-icon-yx-connection", "el-icon-yx-podcast", "el-icon-yx-feed", "el-icon-yx-mic", "el-icon-yx-book", "el-icon-yx-books", "el-icon-yx-library", "el-icon-yx-file-text", "el-icon-yx-profile", "el-icon-yx-file-empty", "el-icon-yx-files-empty", "el-icon-yx-file-text2", "el-icon-yx-file-picture", "el-icon-yx-file-music", "el-icon-yx-file-play", "el-icon-yx-file-video", "el-icon-yx-file-zip", "el-icon-yx-copy", "el-icon-yx-paste", "el-icon-yx-stack", "el-icon-yx-folder", "el-icon-yx-folder-open", "el-icon-yx-folder-plus", "el-icon-yx-folder-minus", "el-icon-yx-folder-download", "el-icon-yx-folder-upload", "el-icon-yx-price-tag", "el-icon-yx-price-tags", "el-icon-yx-barcode", "el-icon-yx-qrcode", "el-icon-yx-ticket", "el-icon-yx-cart?", "el-icon-yx-coin-dollar", "el-icon-yx-coin-euro", "el-icon-yx-coin-pound", "el-icon-yx-coin-yen", "el-icon-yx-credit-card", "el-icon-yx-calculator", "el-icon-yx-lifebuoy", "el-icon-yx-phone", "el-icon-yx-phone-hang-up", "el-icon-yx-address-book", "el-icon-yx-envelop", "el-icon-yx-pushpin", "el-icon-yx-location", "el-icon-yx-location2", "el-icon-yx-compass", "el-icon-yx-compass2", "el-icon-yx-map", "el-icon-yx-map2", "el-icon-yx-history", "el-icon-yx-clock", "el-icon-yx-clock2", "el-icon-yx-alarm", "el-icon-yx-bell", "el-icon-yx-stopwatch", "el-icon-yx-calendar", "el-icon-yx-printer", "el-icon-yx-keyboard", "el-icon-yx-display", "el-icon-yx-laptop", "el-icon-yx-mobile", "el-icon-yx-mobile2", "el-icon-yx-tablet", "el-icon-yx-tv", "el-icon-yx-drawer", "el-icon-yx-drawer2", "el-icon-yx-box-add", "el-icon-yx-box-remove", "el-icon-yx-download", "el-icon-yx-upload", "el-icon-yx-floppy-disk", "el-icon-yx-drive", "el-icon-yx-database", "el-icon-yx-undo", "el-icon-yx-redo", "el-icon-yx-undo2", "el-icon-yx-redo2", "el-icon-yx-forward", "el-icon-yx-reply", "el-icon-yx-bubble", "el-icon-yx-bubbles", "el-icon-yx-bubbles2", "el-icon-yx-bubble2", "el-icon-yx-bubbles3", "el-icon-yx-bubbles4", "el-icon-yx-user", "el-icon-yx-users", "el-icon-yx-user-plus", "el-icon-yx-user-minus", "el-icon-yx-user-check", "el-icon-yx-user-tie", "el-icon-yx-quotes-left", "el-icon-yx-quotes-right", "el-icon-yx-hour-glass", "el-icon-yx-spinner", "el-icon-yx-spinner2", "el-icon-yx-spinner3", "el-icon-yx-spinner4", "el-icon-yx-spinner5", "el-icon-yx-spinner6", "el-icon-yx-spinner7", "el-icon-yx-spinner8", "el-icon-yx-spinner9", "el-icon-yx-spinner10", "el-icon-yx-spinner11", "el-icon-yx-binoculars", "el-icon-yx-search", "el-icon-yx-zoom-in", "el-icon-yx-zoom-out", "el-icon-yx-enlarge", "el-icon-yx-shrink", "el-icon-yx-enlarge2", "el-icon-yx-shrink2", "el-icon-yx-key", "el-icon-yx-key2", "el-icon-yx-lock", "el-icon-yx-unlocked", "el-icon-yx-wrench", "el-icon-yx-equalizer", "el-icon-yx-equalizer2", "el-icon-yx-cog", "el-icon-yx-cogs", "el-icon-yx-hammer", "el-icon-yx-magic-wand", "el-icon-yx-aid-kit", "el-icon-yx-bug", "el-icon-yx-pie-chart", "el-icon-yx-stats-dots", "el-icon-yx-stats-bars", "el-icon-yx-stats-bars2", "el-icon-yx-trophy", "el-icon-yx-gift", "el-icon-yx-glass", "el-icon-yx-glass2", "el-icon-yx-mug", "el-icon-yx-spoon-knife", "el-icon-yx-leaf", "el-icon-yx-rocket", "el-icon-yx-meter", "el-icon-yx-meter2", "el-icon-yx-hammer2", "el-icon-yx-fire", "el-icon-yx-lab", "el-icon-yx-magnet", "el-icon-yx-bin", "el-icon-yx-bin2", "el-icon-yx-briefcase", "el-icon-yx-airplane", "el-icon-yx-truck", "el-icon-yx-road", "el-icon-yx-accessibility", "el-icon-yx-target", "el-icon-yx-shield", "el-icon-yx-power", "el-icon-yx-switch", "el-icon-yx-power-cord", "el-icon-yx-clipboard", "el-icon-yx-list-numbered", "el-icon-yx-list", "el-icon-yx-list2", "el-icon-yx-tree", "el-icon-yx-menu", "el-icon-yx-menu2", "el-icon-yx-menu3", "el-icon-yx-menu4", "el-icon-yx-cloud", "el-icon-yx-cloud-download", "el-icon-yx-cloud-upload", "el-icon-yx-cloud-check", "el-icon-yx-download2", "el-icon-yx-upload2", "el-icon-yx-download3", "el-icon-yx-upload3", "el-icon-yx-sphere", "el-icon-yx-earth", "el-icon-yx-link", "el-icon-yx-flag", "el-icon-yx-attachment", "el-icon-yx-eye", "el-icon-yx-eye-plus", "el-icon-yx-eye-minus", "el-icon-yx-eye-blocked", "el-icon-yx-bookmark", "el-icon-yx-bookmarks", "el-icon-yx-sun", "el-icon-yx-contrast", "el-icon-yx-brightness-contrast", "el-icon-yx-star-empty", "el-icon-yx-star-half", "el-icon-yx-star-full", "el-icon-yx-heart", "el-icon-yx-heart-broken", "el-icon-yx-man", "el-icon-yx-woman", "el-icon-yx-man-woman", "el-icon-yx-happy", "el-icon-yx-happy2", "el-icon-yx-smile", "el-icon-yx-smile2", "el-icon-yx-tongue", "el-icon-yx-tongue2", "el-icon-yx-sad", "el-icon-yx-sad2", "el-icon-yx-wink", "el-icon-yx-wink2", "el-icon-yx-grin", "el-icon-yx-grin2", "el-icon-yx-cool", "el-icon-yx-cool2", "el-icon-yx-angry", "el-icon-yx-angry2", "el-icon-yx-evil", "el-icon-yx-evil2", "el-icon-yx-shocked", "el-icon-yx-shocked2", "el-icon-yx-baffled", "el-icon-yx-baffled2", "el-icon-yx-confused", "el-icon-yx-confused2", "el-icon-yx-neutral", "el-icon-yx-neutral2", "el-icon-yx-hipster", "el-icon-yx-hipster2", "el-icon-yx-wondering", "el-icon-yx-wondering2", "el-icon-yx-sleepy", "el-icon-yx-sleepy2", "el-icon-yx-frustrated", "el-icon-yx-frustrated2", "el-icon-yx-crying", "el-icon-yx-crying2", "el-icon-yx-point-up", "el-icon-yx-point-right", "el-icon-yx-point-down", "el-icon-yx-point-left", "el-icon-yx-warning", "el-icon-yx-notification", "el-icon-yx-question", "el-icon-yx-plus", "el-icon-yx-minus", "el-icon-yx-info", "el-icon-yx-cancel-circle", "el-icon-yx-blocked", "el-icon-yx-cross", "el-icon-yx-checkmark", "el-icon-yx-checkmark2", "el-icon-yx-spell-check", "el-icon-yx-enter", "el-icon-yx-exit", "el-icon-yx-play2", "el-icon-yx-pause", "el-icon-yx-stop", "el-icon-yx-previous", "el-icon-yx-next", "el-icon-yx-backward", "el-icon-yx-forward2", "el-icon-yx-play3", "el-icon-yx-pause2", "el-icon-yx-stop2", "el-icon-yx-backward2", "el-icon-yx-forward3", "el-icon-yx-first", "el-icon-yx-last", "el-icon-yx-previous2", "el-icon-yx-next2", "el-icon-yx-eject", "el-icon-yx-volume-high", "el-icon-yx-volume-medium", "el-icon-yx-volume-low", "el-icon-yx-volume-mute", "el-icon-yx-volume-mute2", "el-icon-yx-volume-increase", "el-icon-yx-volume-decrease", "el-icon-yx-loop", "el-icon-yx-loop2", "el-icon-yx-infinite", "el-icon-yx-shuffle", "el-icon-yx-arrow-up-left", "el-icon-yx-arrow-up", "el-icon-yx-arrow-up-right", "el-icon-yx-arrow-right", "el-icon-yx-arrow-down-right", "el-icon-yx-arrow-down", "el-icon-yx-arrow-down-left", "el-icon-yx-arrow-left", "el-icon-yx-arrow-up-left2", "el-icon-yx-arrow-up2", "el-icon-yx-arrow-up-right2", "el-icon-yx-arrow-right2", "el-icon-yx-arrow-down-right2", "el-icon-yx-arrow-down2", "el-icon-yx-arrow-down-left2", "el-icon-yx-arrow-left2", "el-icon-yx-circle-up", "el-icon-yx-circle-right", "el-icon-yx-circle-down", "el-icon-yx-circle-left", "el-icon-yx-tab", "el-icon-yx-move-up", "el-icon-yx-move-down", "el-icon-yx-sort-alpha-asc", "el-icon-yx-sort-alpha-desc", "el-icon-yx-sort-numeric-asc", "el-icon-yx-sort-numberic-desc", "el-icon-yx-sort-amount-asc", "el-icon-yx-sort-amount-desc", "el-icon-yx-command", "el-icon-yx-shift", "el-icon-yx-ctrl", "el-icon-yx-opt", "el-icon-yx-checkbox-checked", "el-icon-yx-checkbox-unchecked", "el-icon-yx-radio-checked", "el-icon-yx-radio-checked2", "el-icon-yx-radio-unchecked", "el-icon-yx-crop", "el-icon-yx-make-group", "el-icon-yx-ungroup", "el-icon-yx-scissors", "el-icon-yx-filter", "el-icon-yx-font", "el-icon-yx-ligature", "el-icon-yx-ligature2", "el-icon-yx-text-height", "el-icon-yx-text-width", "el-icon-yx-font-size", "el-icon-yx-bold", "el-icon-yx-underline", "el-icon-yx-italic", "el-icon-yx-strikethrough", "el-icon-yx-omega", "el-icon-yx-sigma", "el-icon-yx-page-break", "el-icon-yx-superscript", "el-icon-yx-subscript", "el-icon-yx-superscript2", "el-icon-yx-subscript2", "el-icon-yx-text-color", "el-icon-yx-pagebreak", "el-icon-yx-clear-formatting", "el-icon-yx-table", "el-icon-yx-table2", "el-icon-yx-insert-template", "el-icon-yx-pilcrow", "el-icon-yx-ltr", "el-icon-yx-rtl", "el-icon-yx-section", "el-icon-yx-paragraph-left", "el-icon-yx-paragraph-center", "el-icon-yx-paragraph-right", "el-icon-yx-paragraph-justify", "el-icon-yx-indent-increase", "el-icon-yx-indent-decrease", "el-icon-yx-share", "el-icon-yx-new-tab", "el-icon-yx-embed", "el-icon-yx-embed2", "el-icon-yx-terminal", "el-icon-yx-share2", "el-icon-yx-mail", "el-icon-yx-mail2", "el-icon-yx-mail3", "el-icon-yx-mail4", "el-icon-yx-amazon", "el-icon-yx-google", "el-icon-yx-google2", "el-icon-yx-google3", "el-icon-yx-google-plus", "el-icon-yx-google-plus2", "el-icon-yx-google-plus3", "el-icon-yx-hangouts", "el-icon-yx-google-drive", "el-icon-yx-facebook", "el-icon-yx-facebook2", "el-icon-yx-instagram", "el-icon-yx-whatsapp", "el-icon-yx-spotify", "el-icon-yx-telegram", "el-icon-yx-twitter", "el-icon-yx-vine", "el-icon-yx-vk", "el-icon-yx-renren", "el-icon-yx-sina-weibo", "el-icon-yx-rss", "el-icon-yx-rss2", "el-icon-yx-youtube", "el-icon-yx-youtube2", "el-icon-yx-twitch", "el-icon-yx-vimeo", "el-icon-yx-vimeo2", "el-icon-yx-lanyrd", "el-icon-yx-flickr", "el-icon-yx-flickr2", "el-icon-yx-flickr3", "el-icon-yx-flickr4", "el-icon-yx-dribbble", "el-icon-yx-behance", "el-icon-yx-behance2", "el-icon-yx-deviantart", "el-icon-yx-500px", "el-icon-yx-steam", "el-icon-yx-steam2", "el-icon-yx-dropbox", "el-icon-yx-onedrive", "el-icon-yx-github", "el-icon-yx-npm", "el-icon-yx-basecamp", "el-icon-yx-trello", "el-icon-yx-wordpress", "el-icon-yx-joomla", "el-icon-yx-ello", "el-icon-yx-blogger", "el-icon-yx-blogger2", "el-icon-yx-tumblr", "el-icon-yx-tumblr2", "el-icon-yx-yahoo", "el-icon-yx-yahoo2", "el-icon-yx-tux", "el-icon-yx-appleinc", "el-icon-yx-finder", "el-icon-yx-android", "el-icon-yx-windows", "el-icon-yx-windows8", "el-icon-yx-soundcloud", "el-icon-yx-soundcloud2", "el-icon-yx-skype", "el-icon-yx-reddit", "el-icon-yx-hackernews", "el-icon-yx-wikipedia", "el-icon-yx-linkedin", "el-icon-yx-linkedin2", "el-icon-yx-lastfm", "el-icon-yx-lastfm2", "el-icon-yx-delicious", "el-icon-yx-stumbleupon", "el-icon-yx-stumbleupon2", "el-icon-yx-stackoverflow", "el-icon-yx-pinterest", "el-icon-yx-pinterest2", "el-icon-yx-xing", "el-icon-yx-xing2", "el-icon-yx-flattr", "el-icon-yx-foursquare", "el-icon-yx-yelp", "el-icon-yx-paypal", "el-icon-yx-chrome", "el-icon-yx-firefox", "el-icon-yx-IE", "el-icon-yx-edge", "el-icon-yx-safari", "el-icon-yx-opera", "el-icon-yx-file-pdf", "el-icon-yx-file-openoffice", "el-icon-yx-file-word"],
                    modQueryFields: [
                        {placeholder: '模块名称', field: 'modName', type: 'input'}
                    ],
                    funcQueryFields: [
                        {placeholder: '功能点名称', field: 'funcName', type: 'input'},
                        {placeholder: 'URL链接', field: 'funcUrl', type: 'input'}
                    ],
                    modQueryButtons: [
                        {
                            label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if (valid) {
                                var param = {condition: JSON.stringify(model)};
                                me.$refs.modTable.remoteData(param);
                            }
                        }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                    ],
                    funcQueryButtons: [
                        {
                            label: '查询', op: 'submit', type: 'primary', icon: "search", click: function (model, valid) {
                            if (valid) {
                                var param = {
                                    condition: JSON.stringify({
                                        modId: me.modCurrentRow.modId ? me.modCurrentRow.modId : null,
                                        funcName: model.funcName ? model.funcName : null,
                                        funcUrl: model.funcUrl ? model.funcUrl : null
                                    })
                                };
                                me.$refs.funcTable.remoteData(param);
                            }
                        }
                        },
                        {label: '重置', op: 'reset', type: 'primary', icon: 'yx-loop2'}
                    ],
                    modTableColumns: [
                        {
                            label: '模块名称', prop: 'modName', sortable: true, resizable: true, template: function () {
                            return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-row-click\', scope)">{{ scope.row.modName }}</a>\
                            </template>';
                        }
                        }
                    ],
                    funcTableColumns: [
                        {
                            label: '业务功能名称',
                            prop: 'funcName',
                            width: 250,
                            sortable: true,
                            resizable: true,
                            template: function () {
                                return '<template scope="scope">\
                                <a href="javascipt:void(0);" style="text-decoration:underline;" @click="_$event(\'custom-row-click\', scope)">{{ scope.row.funcName }}</a>\
                            </template>';
                            }
                        },
                        {
                            label: 'URL链接',
                            prop: 'funcUrl',
                            width: 275,
                            sortable: true,
                            resizable: true,
                            showOverflowTooltip: true
                        },
                        {label: '顺序', prop: 'funcOrder', sortable: true, resizable: true}
                    ],
                    modFields: [{
                        columnCount: 1,
                        fields: [
                            {
                                field: 'modName', label: '模块名称', rules: [
                                {required: true, message: '必填项', trigger: 'blur'},
                                {max: 20, message: '输入值过长', trigger: 'blur'}
                            ]
                            }
                        ]
                    }, {
                        columnCount: 2,
                        fields: [
                            {
                                field: 'isApp', label: '是否APP功能', type: 'select', dataCode: 'YESNO',
                                rules: [{required: true, message: '必填项', trigger: 'blur'}]
                            },
                            {
                                field: 'isOuter', label: '是否外部系统', type: 'select', dataCode: 'YESNO',
                                rules: [{required: true, message: '必填项', trigger: 'blur'}], change: function (isOuter) {
                                var fields = me.modFields[1].fields;
                                if (isOuter == '01') {
                                    fields[2].hidden = false;
                                    fields[3].hidden = false;
                                    fields[4].hidden = false;
                                    fields[5].hidden = false;
                                } else {
                                    fields[2].hidden = true;
                                    fields[3].hidden = true;
                                    fields[4].hidden = true;
                                    fields[5].hidden = true;
                                }
                            }
                            },
                            {
                                field: 'userName',
                                label: '外部系统登录名',
                                hidden: true,
                                rules: [{max: 50, message: '输入值过长', trigger: 'blur'}]
                            },
                            {
                                field: 'userKey',
                                label: '外部系统用户名',
                                hidden: true,
                                rules: [{max: 50, message: '输入值过长', trigger: 'blur'}]
                            },
                            {
                                field: 'password',
                                label: '外部系统密码',
                                hidden: true,
                                rules: [{max: 50, message: '输入值过长', trigger: 'blur'}]
                            },
                            {
                                field: 'pwdKey',
                                label: '外部系统密码名',
                                hidden: true,
                                rules: [{max: 50, message: '输入值过长', trigger: 'blur'}]
                            },
                            {field: 'lastChgName', label: '最近更新人', hidden: true},
                            {field: 'lastChgDt', label: '最近更新时间', hidden: true}
                        ]
                    }, {
                        columnCount: 1,
                        fields: [
                            {
                                field: 'modDesc',
                                label: '模块描述',
                                type: 'textarea',
                                rows: 3,
                                rules: [{max: 100, message: '输入值过长', trigger: 'blur'}]
                            }
                        ]
                    }],
                    funcFields: [
                        {
                            columnCount: 1,
                            fields: [
                                {
                                    field: 'funcName', label: '功能点名称', rules: [
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    {max: 50, message: '输入值过长', trigger: 'blur'}
                                ]
                                },
                                {
                                    field: 'funcUrl', label: 'URL链接', rules: [
                                    {required: true, message: '必填项', trigger: 'blur'},
                                    {max: 200, message: '输入值过长', trigger: 'blur'},
                                    {validator: urlValidate, trigger: 'blur'}
                                ]
                                }
                            ]
                        },
                        {
                            columnCount: 2,
                            fields: [
                                {
                                    field: 'funcIcon', label: '图标', icon: 'search', click: function () {
                                    me.iconDialogVisible = true;
                                }, rules: [{required: true, message: '必填项', trigger: 'blur'}]
                                },
                                {
                                    field: 'funcOrder', label: '顺序', rules: [
                                    {required: true, message: '正整数(不超过9999)', validator:orderValidate}
                                ]
                                },
                                {field: 'lastChgName', label: '最近更新人', hidden: true},
                                {field: 'lastChgDt', label: '最近更新时间', hidden: true}
                            ]
                        }, {
                            columnCount: 1,
                            fields: [{
                                field: 'funcDesc',
                                label: '功能点描述',
                                type: 'textarea',
                                rows: 3,
                                rules: [{max: 100, message: '输入值过长', trigger: 'blur'}]
                            }]
                        }],
                    modFormButtons: [
                        {
                            label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.modDialogVisible = false;
                        }
                        },
                        {
                            label: '保存',
                            type: 'primary',
                            icon: "check",
                            hidden: false,
                            op: 'submit',
                            click: function (model) {
                                if (me.$refs.modForm.formModel.isOuter == '02') {
                                    me.isOuterFn();
                                }
                                me.saveCreateMod();
                            }
                        },
                        {
                            label: '保存',
                            type: 'primary',
                            icon: "check",
                            hidden: false,
                            op: 'submit',
                            click: function (model) {
                                if (me.$refs.modForm.formModel.isOuter == '02') {
                                    me.isOuterFn();
                                }
                                me.saveEditMod();
                            }
                        }],
                    funcFormButtons: [
                        {
                            label: '取消', type: 'primary', icon: "yx-undo2", hidden: false, click: function (model) {
                            me.funcDialogVisible = false;
                        }
                        },
                        {
                            label: '保存',
                            type: 'primary',
                            icon: "check",
                            hidden: false,
                            op: 'submit',
                            click: function (model) {
                                me.saveCreateFunc();
                            }
                        },
                        {
                            label: '保存',
                            type: 'primary',
                            icon: "check",
                            hidden: false,
                            op: 'submit',
                            click: function (model) {
                                me.saveEditFunc();
                            }
                        }
                    ]
                }
            },
            methods: {
                //模块管理操作状态选择
                modSwitchStatus: function (viewType, editable) {
                    this.viewType = viewType;
                    this.modDialogVisible = true;
                    this.modFormDisabled = !editable;
                    this.modFormButtons[0].hidden = !editable;
                    if (viewType == 'ADD') {
                        this.modFormButtons[1].hidden = !editable;
                        this.modFormButtons[2].hidden = editable;
                    } else if (viewType == 'EDIT') {
                        this.modFormButtons[1].hidden = editable;
                        this.modFormButtons[2].hidden = !editable;
                    } else if (viewType == 'DETAIL') {
                        this.modFormButtons[1].hidden = !editable;
                        this.modFormButtons[2].hidden = !editable;
                    }
                },
                //模块管理不同状态最近更新人与时间字段显示控制
                modSwitchHidden: function (viewType, isHidden) {
                    this.viewType = viewType;
                    var fields = this.modFields[1].fields;
                    fields[6].hidden = !isHidden;
                    fields[7].hidden = !isHidden;
                },
                //是否外部系统
                isOuterFn: function () {
                    this.$refs.modForm.formModel.userName = '';
                    this.$refs.modForm.formModel.userKey = '';
                    this.$refs.modForm.formModel.password = '';
                    this.$refs.modForm.formModel.pwdKey = '';
                },
                //业务功能管理操作状态选择
                funcSwitchStatus: function (viewType, editable) {
                    this.viewType = viewType;
                    this.funcDialogVisible = true;
                    this.funcFormDisabled = !editable;
                    this.funcFormButtons[0].hidden = !editable;
                    if (viewType == 'ADD') {
                        this.funcFormButtons[1].hidden = !editable;
                        this.funcFormButtons[2].hidden = editable;
                    } else if (viewType == 'EDIT') {
                        this.funcFormButtons[1].hidden = editable;
                        this.funcFormButtons[2].hidden = !editable;
                    } else if (viewType == 'DETAIL') {
                        this.funcFormButtons[1].hidden = !editable;
                        this.funcFormButtons[2].hidden = !editable;
                    }
                },
                //业务功能管理不同状态最近更新人与时间字段显示控制
                funcSwitchHidden: function (viewType, isHidden) {
                    this.viewType = viewType;
                    var fields = this.funcFields[1].fields;
                    fields[2].hidden = !isHidden;
                    fields[3].hidden = !isHidden;
                },
                //模块新增
                modAddFn: function () {
                    this.modSwitchStatus('ADD', true);
                    this.$refs.modTable.clearSelection();
                    this.modSwitchHidden('ADD', false);
                    this.$nextTick(function () {
                        this.$refs.modForm.resetFields();
                        this.$refs.modForm.formModel.isApp = '02';
                        this.$refs.modForm.formModel.isOuter = '02';
                    });
                },
                saveCreateMod: function () {
                    var _this = this;
                    delete _this.$refs.modForm.formModel.modId;
                    _this.$refs.modForm.validate(function (valid) {
                        if (valid) {
                            _this.$refs.modForm.formModel.lastChgUsr = yufp.session.userId;
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/adminsmfuncmod/createmod",
                                data: _this.$refs.modForm.formModel,
                                callback: function (code, message, response) {
                                    _this.modDialogVisible = false;
                                    _this.$message({message: '数据保存成功！'});
                                    _this.$refs.modTable.remoteData({});
                                }
                            });
                        } else {
                            _this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    });
                },
                //模块修改
                modModifyFn: function () {
                    if (this.$refs.modTable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
                    this.modSwitchStatus("EDIT", true);
                    this.modSwitchHidden('EDIT', false);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.modForm.formModel, this.$refs.modTable.selections[0]);
                    });
                },
                saveEditMod: function () {
                    var _this = this;
                    _this.$refs.modForm.validate(function (valid) {
                        if (valid) {
                            _this.$refs.modForm.formModel.lastChgUsr = yufp.session.userId;
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/adminsmfuncmod/editmod",
                                data: _this.$refs.modForm.formModel,
                                callback: function (code, message, response) {
                                    _this.modDialogVisible = false;
                                    _this.$message({message: '数据保存成功！'});
                                    _this.$refs.modTable.remoteData({});
                                }
                            });
                        } else {
                            _this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    });
                },
                //业务功能新增
                funcAddFn: function () {
                    if (this.modCurrentRow.modId == '') {
                        this.$message({message: '请先选择模块', type: 'warning'})
                        return;
                    }
                    this.funcSwitchStatus('ADD', true);
                    this.funcSwitchHidden('ADD', false);
                    this.$refs.funcTable.clearSelection();
                    this.$nextTick(function () {
                        this.$refs.funcForm.resetFields();
                    });
                },
                saveCreateFunc: function () {
                    var _this = this;
                    delete _this.$refs.funcForm.formModel.funcId;
                    _this.$refs.funcForm.validate(function (valid) {
                        _this.$refs.funcForm.formModel.modId = _this.modCurrentRow.modId;
                        _this.$refs.funcForm.formModel.lastChgUsr = yufp.session.userId;
                        if (valid) {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/adminsmbusifunc/createfunc",
                                data: _this.$refs.funcForm.formModel,
                                callback: function (code, message, response) {
                                    _this.funcDialogVisible = false;
                                    _this.$message({message: '数据保存成功！'});
                                    var param = {
                                        condition: JSON.stringify({
                                            modId: _this.modCurrentRow.modId ? _this.modCurrentRow.modId : null
                                        })
                                    };
                                    _this.$refs.funcTable.remoteData(param);
                                }
                            });
                        } else {
                            _this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    });
                },
                //业务功能修改
                funcModifyFn: function () {
                    if (this.$refs.funcTable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
                    if (this.$refs.funcTable.selections.length > 1) {
                        this.$message({message: '请选择一条记录', type: 'warning'})
                        return;
                    }
                    this.funcSwitchStatus("EDIT", true);
                    this.funcSwitchHidden('EDIT', false);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.funcForm.formModel, this.$refs.funcTable.selections[0]);
                    });
                },
                saveEditFunc: function () {
                    var _this = this;
                    _this.$refs.funcForm.validate(function (valid) {
                        _this.$refs.funcForm.formModel.lastChgUsr = yufp.session.userId;
                        if (valid) {
                            yufp.service.request({
                                method: 'POST',
                                url: backend.adminService + "/api/adminsmbusifunc/editfunc",
                                data: _this.$refs.funcForm.formModel,
                                callback: function (code, message, response) {
                                    _this.funcDialogVisible = false;
                                    _this.$message({message: '数据保存成功！'});
                                    var param = {
                                        condition: JSON.stringify({
                                            modId: _this.modCurrentRow.modId ? _this.modCurrentRow.modId : null
                                        })
                                    };
                                    _this.$refs.funcTable.remoteData(param);
                                }
                            });
                        } else {
                            _this.$message({message: '请检查输入项是否合法', type: 'warning'});
                            return false;
                        }
                    });
                },
                //点击模块名称列,查看模块管理详情
                modRowClick: function (scope) {
                    this.modSwitchStatus("DETAIL", false);
                    this.modSwitchHidden('DETAIL', true);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.modForm.formModel, scope.row);
                    });
                },
                //点击业务功能名称列,查看业务功能管理详情
                funcRowClick: function (scope) {
                    this.funcSwitchStatus("DETAIL", false);
                    this.funcSwitchHidden('DETAIL', true);
                    this.$nextTick(function () {
                        yufp.extend(this.$refs.funcForm.formModel, scope.row);
                    });
                },
                //模块删除,删除前先判断是否有关联业务功能信息,如有不能进行删除
                modDeleteFn: function () {
                    if (this.$refs.modTable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
                    var _this = this;
                    yufp.service.request({
                        method: 'GET',
                        url: backend.adminService + "/api/adminsmfuncmod/getfuncbymodid",
                        data: {
                            'modId': _this.$refs.modTable.selections[0].modId
                        },
                        callback: function (code, message, response) {
                            if (response.data.length > 0) {
                                _this.$message({
                                    message: '该模块关联业务功能,不能进行删除',
                                    type: 'warning'
                                });
                                return;
                            } else {
                                _this.$confirm('确定删除?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(function () {
                                    yufp.service.request({
                                        method: 'POST',
                                        url: backend.adminService + "/api/adminsmfuncmod/delete/" + _this.$refs.modTable.selections[0].modId,
                                        callback: function (code, message, response) {
                                            _this.$message({message: '数据删除成功！'});
                                            _this.modCurrentRow.modId = '';
                                            _this.$refs.modTable.remoteData({});
                                        }
                                    });
                                })
                            }
                        }
                    });
                },
                //业务功能删除,删除前先判断是否有关联控制点信息,如有不能进行删除
                funcDeleteFn: function () {
                    if (this.$refs.funcTable.selections.length < 1) {
                        this.$message({message: '请先选择一条记录', type: 'warning'})
                        return;
                    }
                    var _this = this;
                    if (_this.$refs.funcTable.selections) {
                        var ids = '';
                        for (var i = 0; i < _this.$refs.funcTable.selections.length; i++) {
                            ids = ids + ',' + _this.$refs.funcTable.selections[i].funcId;
                        }
                        yufp.service.request({
                            method: 'GET',
                            url: backend.adminService + "/api/adminsmbusifunc/getRelationByFuncId",
                            data: {
                                funcId: ids
                            },
                            callback: function (code, message, response) {
                                if (response.data.length > 0) {
                                    _this.$message({
                                        message: '该业务功能关联菜单与控制点,不能进行删除',
                                        type: 'warning'
                                    });
                                    return;
                                } else {
                                    _this.$confirm('确定删除?', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(function () {
                                        yufp.service.request({
                                            method: 'POST',
                                            url: backend.adminService + "/api/adminsmbusifunc/batchdelete/" + ids,
                                            callback: function (code, message, response) {
                                                _this.$message({message: '数据删除成功！'});
                                                var param = {
                                                    condition: JSON.stringify({
                                                        modId: _this.modCurrentRow.modId ? _this.modCurrentRow.modId : null
                                                    })
                                                };
                                                _this.$refs.funcTable.remoteData(param);
                                            }
                                        });
                                    })
                                }
                            }
                        });
                    }
                },
                //模块点击事件,查询模块关联业务功能
                modSelect: function (row, event) {
                    this.modCurrentRow = row;
                    var param = {
                        condition: JSON.stringify({
                            modId: this.modCurrentRow.modId ? this.modCurrentRow.modId : null
                        })
                    };
                    this.$refs.funcTable.remoteData(param);
                },
                //业务功能图标选择
                iconSelect: function (event) {
                    this.$refs.funcForm.formModel.funcIcon = event.target.className;
                    this.iconDialogVisible = false;
                }
            }
        });
    };
});