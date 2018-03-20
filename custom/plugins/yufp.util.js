/**
 * 业务工具类
 * created by helin3 2017-12-05
 */
(function(yufp, window, factory) {
	var exports = factory(yufp, window, window.document);
	if (typeof define === 'function') {
		define(exports);
	}
	window.yufp.util = exports;
}(yufp, window, function(yufp, window, document) {

	/**
	 * 业务工具类
	 * @constructor
	 */
	function Utils() {}

	/**
	 *
	 * @param time
	 * @param format
	 * @returns {*}
	 */
	Utils.prototype.dateFormat = function(time, format) {
		if (arguments.length === 0) {
			return null;
		}
		format = format || '{y}-{m}-{d} {h}:{i}:{s}'
		var date;
		if (typeof time === 'object') {
			date = time;
		} else {
			if (('' + time).length === 10) time = parseInt(time) * 1000;
			date = new Date(time);
		}
		var formatObj = {
			y: date.getFullYear(),
			m: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			i: date.getMinutes(),
			s: date.getSeconds(),
			a: date.getDay()
		};
		var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function(result, key) {
			var value = formatObj[key];
			if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
			if (result.length > 0 && value < 10) {
				value = '0' + value;
			}
			return value || 0;
		});
		return time_str;
	}

	/**
	 *
	 * 判断当前浏览器类型
	 * @author
	 * @returns {*}
	 */
	Utils.prototype.getExplorer = function() {
		var explorer = window.navigator.userAgent;
		//ie
		if (explorer.indexOf("MSIE") >= 0) {
			return 'ie';
		}
		//firefox
		else if (explorer.indexOf("Firefox") >= 0) {
			return 'Firefox';
		}
		//Chrome
		else if (explorer.indexOf("Chrome") >= 0) {
			return 'Chrome';
		}
		//Opera
		else if (explorer.indexOf("Opera") >= 0) {
			return 'Opera';
		}
		//Safari
		else if (explorer.indexOf("Safari") >= 0) {
			return 'Safari';
		}
	}

	/**
	 *
	 * 判断当前浏览器类型
	 * @param options  导出参数
	 * options:{type:"table",ref:table_ref_obj}
	 * type 导出类型为table  ref table对应的vue对象ref
	 * options:{type:"json",data:{head:[],body:[]}}
	 * type 导出类型为json自定义数据  data head为表头,body为数据
	 * @author
	 * @returns {*}
	 */
	Utils.prototype.exportExcelByTable = function(options) {
		var table_ref = options.ref;
		var colums = table_ref.tableColumns;
		var colums_ = new Array();
		var tableColumns = colums.concat([]);
		var collectionHtml = table_ref.$el.getElementsByClassName("el-table__header-wrapper")[0].getElementsByTagName("tr")
		var rowspanIndex = 1;
		var maxrowspan = function(list, parList) {
			if (list && list instanceof Array == true) {
				for (var i = 0; i < list.length; i++) {
					var obj = list[i];
					if (obj.children && obj.children instanceof Array == true) {
						obj.colspan = obj.children.length - 1;
						if (rowspanIndex < obj.children.length) {
							parList.map(function(obj_, index_) {
								if (obj.label != obj_.label) {
									obj_.rowspan = (obj_.rowspan == undefined ? 0 : obj_.rowspan) + 1;
								}
							});
							rowspanIndex += 1;
						}
						maxrowspan(obj.children, obj.children, i);
					}
				}
			}
		}
		maxrowspan(tableColumns, tableColumns);
		var getMerge = function(obj, index, rownum, cellNum) {
			var merges_ = {
				s: { //s为开始
					c: 0, //开始列
					r: 0 //开始取值范围
				},
				e: { //e结束
					c: 0, //结束列
					r: 0 //结束范围
				}
			}
			if (obj.colspan == 0 && !cellNum) {
				merges_.s.c = index;
				merges_.e.c = index;
			} else if (obj.colspan == 0 && cellNum) {
				merges_.s.c = cellNum;
				merges_.e.c = cellNum;
			} else if (obj.colspan != 0 && !cellNum) {
				merges_.s.c = index;
				merges_.e.c = parseInt(index + obj.colspan);
			} else if (obj.colspan != 0 && cellNum) {
				merges_.s.c = cellNum;
				merges_.e.c = parseInt(cellNum + obj.colspan);
			}
			if (obj.rowspan == 0) {
				merges_.s.r = rownum;
				merges_.e.r = parseInt(rownum + obj.rowspan);
			} else {
				merges_.s.r = rownum;
				merges_.e.r = parseInt(rownum + obj.rowspan);
			}
			return merges_;
		}


		var head = [];
		var merges = [];
		var headSheel = [];
		var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var rownum = 0;
		var rowspanIndex_ = 1;
		var addIndex = 0;
		var exportRule = function(list, parList, cellNum) {
			if (list && list instanceof Array == true) {
				for (var i = 0; i < list.length; i++) {
					var obj = list[i];
					head.push(obj.label);
					obj.rowspan = obj.rowspan == undefined ? 0 : obj.rowspan;
					obj.colspan = obj.colspan == undefined ? 0 : obj.colspan;
					if (obj.children && obj.children instanceof Array == true) {
						headSheel.push(letter.charAt(parseInt(i + rownum)) + "1");
						var mg = getMerge(obj, i, rownum);
						merges.push(mg);
						rowspanIndex_ += 1;
						rownum = rownum + 1;
						addIndex = 0;
						exportRule(obj.children, obj.children, i);
						rownum = rownum - 1;
						addIndex = parseInt(obj.children.length - 1);
					} else {
						var mg = getMerge(obj, i + addIndex, rownum, cellNum + i);
						merges.push(mg);
						if (cellNum) {
							headSheel.push(letter.charAt(cellNum + i) + rowspanIndex_);
						} else {
							headSheel.push(letter.charAt(parseInt(i + rowspanIndex_ - 1)) + "1");
						}
					}
				}
			}
		}
		exportRule(tableColumns, tableColumns);
		//获取列的字段名称
		var getColumnsName = function(name, tableColumns) {
			var key;
			for (var i = 0; i < tableColumns.length; i++) {
				if (tableColumns[i].children && tableColumns[i].children instanceof Array == true) {
					key = getColumnsName(name, tableColumns[i].children)
				} else {
					if (name == tableColumns[i].label && tableColumns[i].prop) {
						key = tableColumns[i].prop;
						break;
					}
				}
			}
			return key;
		}
		var headList_ = [];
		for (var i = 0; i < head.length; i++) {
			var key = getColumnsName(head[i], tableColumns);
			if (key) {
				headList_[headList_.length] = key;
			}
		}

		var getColumnsDataCode = function(column, tableColumns) {
			var code;
			for (var i = 0; i < tableColumns.length; i++) {
				if (tableColumns[i].children && tableColumns[i].children instanceof Array == true) {
					key = getColumnsName(column, tableColumns[i].children)
				} else {
					if (column == tableColumns[i].prop && tableColumns[i].prop) {
						code = tableColumns[i].dataCode;
						break;
					}
				}
			}
			return code;
		}
		var data = [];
		var tableData = [];
		if (options.importType == "page") {
			tableData = table_ref.data;
		} else if (options.importType == "selected") {
			tableData = table_ref.selections;
		} else if (options.importType == "service") {
			yufp.service.request({
				url: options.url,
				async: false,
				data: options.param,
				method: 'get',
				callback: function(code, message, response) {
					tableData = response.data;
				}
			});
		}
		for (var i = 0; i < tableData.length; i++) {
			var o = {};
			var rowData = tableData[i];
			for (var j = 0; j < headList_.length; j++) {
				var k = headList_[j];
				var code = getColumnsDataCode(k, tableColumns);
				if (code) {
					var val = yufp.lookup.convertKey(code, rowData[k]);
					o["" + k + ""] = val;
				} else {
					o["" + k + ""] = rowData[k];
				}

			}
			data.push(o);
		}

		for (var i = 1; i < collectionHtml.length; i++) {
			data.unshift({});
		}
		var wopts = {
			bookType: 'xlsx',
			bookSST: true,
			type: 'binary'
		}; //这里的数据是用来定义导出的格式类型
		var saveAs = function(obj, fileName) { //当然可以自定义简单的下载文件实现方式
			var tmpa = document.createElement("a");
			tmpa.download = fileName || "下载";
			tmpa.href = URL.createObjectURL(obj); //绑定a标签
			tmpa.click(); //模拟点击实现下载
			setTimeout(function() { //延时释放
				URL.revokeObjectURL(obj); //用URL.revokeObjectURL()来释放这个object URL
			}, 100);
		}
		var s2ab = function(s) {
			if (typeof ArrayBuffer !== 'undefined') {
				var buf = new ArrayBuffer(s.length);
				var view = new Uint8Array(buf);
				for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			} else {
				var buf = new Array(s.length);
				for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
				return buf;
			}
		}
		var wb = {
			SheetNames: ['Sheet1'],
			Sheets: {},
			Props: {}
		};
		data = XLSX.utils.json_to_sheet(data);
		for (var i = 0; i < headSheel.length; i++) {
			data[headSheel[i]] = {
				t: "s",
				v: head[i]
			};
		}
		data["!merges"] = merges;
		wb.Sheets['Sheet1'] = data;
		saveAs(new Blob([s2ab(XLSX.write(wb, wopts))], {
			type: "application/octet-stream"
		}), options.fileName + '.' + (wopts.bookType == "biff2" ? "xls" : wopts.bookType));
	}

	Utils.prototype.array2tree = function(data, options) {
		var _options = {
			id: 'id',
			pid: 'parentId',
			root: '0'
		};
		yufp.extend(_options, options || {});
		var idField = _options.id,
			pidField = _options.pid;
		var root, children = [];
		if (typeof _options.root === 'object') {
			root = _options.root;
		} else {
			var tempObj = {};
			tempObj[idField] = _options.root;
			root = tempObj;
		}
		var rId = '' + root[idField];
		for (var i = 0, len = data.length; i < len; i++) {
			var d = data[i];
			if (rId === '' + d[idField]) {
				root = d;
			} else if (rId === '' + d[pidField]) {
				children.push(d);
			}
		}
		root.id = root[idField];
		children = root.children ? root.children.concat(children) : children;
		root.children = children;
		for (var i = 0, len = root.children.length; i < len; i++) {
			_options.root = root.children[i];
			root.children[i] = this.array2tree(data, _options);
		}
		return root;
	}

	/**根据数组和对应属性返回满足el-tree的树形数据,
	 *id: 对应id,
	 *pid: 对应pid,
	 *label: 对应展示字段,
	 *root: 如果值为空或不存在则计算
	 */
	Utils.prototype.genTree = function(data, attr) {
		var root = {};
		if(data==null||data.length==0){
			return [];
		}
		if (attr.root == null || attr.root == undefined || attr.root == "") {
			var getRootData = function(data, attributes) {
				var _root = {};
				_root = data[0];
				for(var k=1;k<data.length;k++) {
                    var i=1;
                    for (; i < data.length; i++) {
                        if (data[i][attributes.id] == _root[attributes.pid]) {
                            _root = data[i];
                            break;
                        }
                    }
                    if(i==data.length-1){
                        break;
                    }
                }
				return _root;
			};

			root.id = getRootData(data, attr)[attr.pid];
		} else if (typeof(attr.root) == "object") {
			var root = attr.root;
			root.id = root[attr.id] === undefined ? root.id : root[attr.id];
			root.pid = root[attr.pid] === undefined ? root.pid : root[attr.pid];
			root.label = root[attr.label] === undefined ? root.label : root[attr.label];
		} else {
			for (var i in data) {
				if (data[i][attr.id] == attr.root) {
					root.id = data[i][attr.pid];
					break;
				}
			}
			root.id = root.id == undefined ? attr.root : root.id;
		}

		var genTreeData = function(data, attr) {
			var ckey = {},
				pkey = {};

			for (var i = 0; i < data.length; i++) {
				var row = data[i];
				row.id = row[attr.id];
				row.pid = row[attr.pid];
				row.label = row[attr.label];
				row.children = [];

				ckey[row.id] = row;
				if (pkey[row.pid]) {
					pkey[row.pid].push(row);
				} else {
					pkey[row.pid] = [row];
				}

				var c = pkey[row.id];
				if (c) {
					row.children = c.concat();
				}

				var p = ckey[row.pid];
				if (p) {
					p.children.push(row);
				}
			}
			return pkey;
		};

		if (root.label) {
			root.children = genTreeData(data, attr)[root.id];
			return [root];
		}
		return genTreeData(data, attr)[root.id];
	};

	// 实现对象的深度克隆
	Utils.prototype.clone = function(obj) {
		var result = {};
		if (typeof(obj) == "object") {
			var me = this;
			var objClone = function(o) {
				var t = {};
				for (var k in o) {
					var copy = o[k];
					if (typeof(copy) == "object") {
						t[k] = me.objClone(copy);
					} else {
						t[k] = o[k];
					}
				}
				return t;
			};
			result = objClone(obj);
		} else {
			alert("clone方法目前只支持对象!");
		}
		return result;
	};

    /**
	 * 为url添加token信息
     * @param url
     * @returns {string}
     */
	Utils.prototype.addTokenInfo=function(url){
		var token="access_token=";
		var _url="";
		if(url==null||url==""){
			return _url;
		}

		if(!url.indexOf(token)>-1){
			_url=url+((url.indexOf("?")>-1)?"&":"?")+token+yufp.service.getToken();
		}
		return _url;
	};

    Utils.prototype.download = function (url) {
        if (url) {
            if (url.indexOf("http") <= -1) {
                // 当不包含http时拼接gateway地址
                url = yufp.service.getUrl({
                    url: url
                });
            }
        } else {
            this.$message("必须设置请求url!", "警告");
        }
        //url添加token
        url=this.addTokenInfo(url);
        // 模拟a标签进行下载
        var a=document.createElement("a");
        a.href=url;
        a.click();
    };

    /**
	 * 下载方法升级版本-支持ajax请求下载数据(可后期扩展为断点续传，可配置进度条)
     * @param options
     */
    Utils.prototype.downloadx=function(options){

	}

	
	    /**
     * @created by zhangkun6
     * @updated by 2018/01/14
     * @description 数字金额格式化(千分位)
     */
    Utils.prototype.moneyFormatter = function(money, num) {
      /*
        * 参数说明：
        * money：要格式化的数字
        * num：保留几位小数
        * */
      num = num > 0 && num <= 20 ? num : 2;
      money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(num) + "";
      var l = money.split(".")[0].split("").reverse(),
      r = money.split(".")[1];
      t = "";
      for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? "," : "");
      }
      return t.split("").reverse().join("") + "." + r;
    };

     /**
     * @created by zhangkun6
     * @updated by 2018/01/14
     * @description 数字金额转汉字金额
     */
    Utils.prototype.moneyToUpper = function(money) {
      /*
          * 参数说明：
          * money：要转化的数字
          * */
      //汉字的数字
      var cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      //基本单位
      var cnIntRadice = ["", "拾", "佰", "仟"];
      //对应整数部分扩展单位
      var cnIntUnits = ["", "万", "亿", "兆"];
      //对应小数部分单位
      var cnDecUnits = ["角", "分", "毫", "厘"];
      //整数金额时后面跟的字符
      var cnInteger = "整";
      //整型完以后的单位
      var cnIntLast = "元";
      //最大处理的数字
      var maxNum = 999999999999999.9999;
      //金额整数部分
      var integerNum;
      //金额小数部分
      var decimalNum;
      //输出的中文金额字符串
      var chineseStr = "";
      //分离金额后用的数组，预定义
      var parts;
      if (money == "") {
        return "";
      }
      money = parseFloat(money);
      if (money >= maxNum) {
        //超出最大处理数字
        return "";
      }
      if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      //转换为字符串
      money = money.toString();
      if (money.indexOf(".") == -1) {
        integerNum = money;
        decimalNum = "";
      } else {
        parts = money.split(".");
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
      }
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n == "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            //归零
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != "") {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
          var n = decimalNum.substr(i, 1);
          if (n != "0") {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr == "") {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == "") {
        chineseStr += cnInteger;
      }
      return chineseStr;
    };
 	/**
     * @created by hujun3
     * @updated by 2018/01/19
     * @description 密码密钥
     */
    Utils.prototype.getRSAPublicKey = function() {
       return "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCrDUHc85ADQVxXRP4M90nqttWoZctV6JJVVdPjIle5vd9G2/4kgIhNc78Jd+ENxg+n4Gj9UMwNhJmb2jnMaW3zyGB+qi/ZrMO5dEUhW8salirzRgGg/4Arz4ObPmCWlZsws3Ij/3IEsFD3vMdIZD2j8b33DAbj47PjcCcMbtHYuQIDAQAB"
    };
     /**
     * @created by zhangkun6
     * @updated by 2018/01/19
     * @description 汉字金额转数字金额
     */
    Utils.prototype.upperToMoney = function(upper) {
        /*
            * 参数说明：
            * upper：要转化的汉字
         */
        //金额数值
      var num = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        //汉字的数字
      var cnNums = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      //对应单位的乘积
      var upperMap = [10, 100, 1000];
      //基本单位
      var cnIntRadice = ["拾", "佰", "仟"];
       //对应整数部分扩展单位
       var cnIntUnits = ["万", "亿", "兆"];
       //对应小数部分单位乘积
       var cnDecMap = [0.1, 0.01];
        //对应小数部分单位
       var cnDecUnits = ["角", "分"];
      //金额整数部分
      var integerNum;
      //金额小数部分
      var decimalNum;
      //输出的数字金额字符串
      var moneyNum;
      //金额单位亿之前的数值数组
      var maxArray = [];
      //金额单位亿和万之间的数值数组
      var middleArray = [];
      //金额单位万和元之间的数值数组
      var minArray = [];

      var part = upper.split('元');
      integerNum = part[0];
      decimalNum = part[1].split('');
      if(integerNum.indexOf('亿') !== -1){
        maxArray = integerNum.split('亿')[0].split('');
        if(integerNum.indexOf('万') !== -1) {
            middleArray = integerNum.split('亿')[1].split('万')[0].split('');
            minArray = integerNum.split('亿')[1].split('万')[1].split('');
        } else {
            minArray = integerNum.split('亿')[1].split('');
        }
      }else if(integerNum.indexOf('万') !== -1){
        middleArray = integerNum.split('万')[0].split('');
        minArray = integerNum.split('万')[1].split('');
      } else {
        minArray = integerNum.split('');
      }
      var getNum = function(upArray, cnNums, cnRadice, numArray, map){
        var length = upArray.length;
        var num = 0;
        var sum = 0;
        for(var i = 0; i < length; i++) {
            var index = cnNums.indexOf( upArray[i]);
            var _index = cnRadice.indexOf( upArray[i]);
            if(index !== -1){
                num += numArray[index];
              if( i == (length -1)){
                sum += num;
              }
            } 
            if(_index !== -1 ){
              num *= map[_index];
              sum += num;
              num = 0;
            }
        }
        return sum;
      }
      var maxSum = getNum(maxArray, cnNums, cnIntRadice, num, upperMap);
      var middleSun = getNum(middleArray, cnNums, cnIntRadice, num, upperMap);
      var minSun = getNum(minArray, cnNums, cnIntRadice, num, upperMap);
      var cesSum = getNum(decimalNum, cnNums, cnDecUnits, num, cnDecMap);
      moneyNum = maxSum*100000000 + middleSun*10000 + minSun + cesSum;
      return moneyNum
    }
	
	    //菜单访问日志工具
    Utils.prototype.logInfo = function( log, url ) {
        yufp.service.request({
            url: url,
            method: 'post',
            data: log,
            callback: function (code, msg, response) {
                if (code !== 0 || !response){
					yufp.logger.warn("日志上传失败");
                }
            }
        });
    }
	
	var utils = new Utils();

	/**
	 * 日期默认格式
	 * @returns {*}
	 */
	Date.prototype.toJSON = function() {
		return utils.dateFormat(this, '{y}-{m}-{d}');
	};

	return utils;
}));
