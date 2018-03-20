/**
 * Created by chenlin2 on 2017/11/17.
 */
define([
    './libs/daterangepicker/moment.min.js',
    './libs/daterangepicker/daterangepicker.js'  
], function (require, exports) {
    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        //统计
        yufp.service.request({
            method: 'GET',
            url: backend.adminService + "/api/xxljobindex/dashboardInfo",
            callback: function (code, message, response) {
                $('#jobInfoCount')[0].innerHTML = response.jobInfoCount;
                $('#jobLogCount')[0].innerHTML = response.jobLogCount;
                $('#executorCount')[0].innerHTML = response.executorCount;
            }
        });
        //创建virtual model
        var _startDate = moment().subtract(1, 'months');    // 默认，最近一月
        var _endDate = moment();
        var vm = yufp.custom.vue({
            el: "#report_forms",
            data: function () {
                return {
                    value:[],
                    timepvisible:false,
                    height: yufp.frame.size().height,
                    width: yufp.frame.size().width * 0.6 - 50,
                    width2: yufp.frame.size().width * 0.4 - 50
                }
            },
            methods: {
            	//转换中国标准时间
                format:function(time,format)
                {
                    var t = new Date(time);
                    var tf = function(i){return (i < 10 ? '0' : '') + i};
                    return format.replace(/yyyy|MM|dd|HH|mm|ss/g,function(a){
                        switch(a){
                            case 'yyyy':
                                return tf(t.getFullYear());
                                break;
                            case 'MM':
                                return tf(t.getMonth() + 1);
                                break;
                            case 'mm':
                                return tf(t.getMinutes());
                                break;
                            case 'dd':
                                return tf(t.getDate());
                                break;
                            case 'HH':
                                return tf(t.getHours());
                                break;
                            case 'ss':
                                return tf(t.getSeconds());
                                break;
                        }
                    })
                },
                //自定义区间时间刷新图表方法
                selectDateFn:function () {
                    if(this.value.length==2){
                    	if(this.value[0]!=null){
                    		this.freshChartDate(this.value[0],this.value[1]);
                    	}else{
                    		this.timepvisible = false;
                    	}
                    }
                },
                //刷新报表
                freshChartDate: function (startDate, endDate) {
                	this.timepvisible = false;
                    var vue = this;
                    if(startDate.format==undefined){
                        var param = {
                            condition: JSON.stringify({
                                from: this.format(startDate,'yyyy-MM-dd HH:mm:ss'),
                                to: this.format(endDate,'yyyy-MM-dd HH:mm:ss')
                            })
                        };
                    }else{
                        var param = {
                            condition: JSON.stringify({
                                from: startDate.format('YYYY-MM-DD HH:mm:ss'),
                                to: endDate.format('YYYY-MM-DD HH:mm:ss')
                            })
                        };
                    }
                    yufp.service.request({
                        method: 'GET',
                        url: backend.adminService + '/api/xxljobindex/triggerchartdate',
                        data: param,
                        callback: function (code, message, response) {
                            var data = response;
                            if (response.code == 200) {
                                //折线图
                                var option = {
                                    title: {
                                        text: '日期分布图'
                                    },
                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer: {
                                            type: 'cross',
                                            label: {
                                                backgroundColor: '#6a7985'
                                            }
                                        }
                                    },
                                    legend: {
                                        data: ['成功调度次数', '失败调度次数']
                                    },
                                    toolbox: {
                                        feature: {
                                            /*saveAsImage: {}*/
                                        }
                                    },
                                    grid: {
                                        left: '3%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true
                                    },
                                    xAxis: [
                                        {
                                            type: 'category',
                                            boundaryGap: false,
                                            data: data.content.triggerDayList
                                        }
                                    ],
                                    yAxis: [
                                        {
                                            type: 'value'
                                        }
                                    ],
                                    series: [
                                        {
                                            name: '成功调度次数',
                                            type: 'line',
                                            label: {
                                                normal: {
                                                    show: true,
                                                    position: 'top'
                                                }
                                            },
                                            areaStyle: {normal: {}},
                                            data: data.content.triggerDayCountSucList
                                        },
                                        {
                                            name: '失败调度次数',
                                            type: 'line',
                                            label: {
                                                normal: {
                                                    show: true,
                                                    position: 'top'
                                                }
                                            },
                                            areaStyle: {normal: {}},
                                            data: data.content.triggerDayCountFailList
                                        }
                                    ],
                                    color: ['#00A65A', '#F39C12']
                                };
                                var lineChart = echarts.init(document.getElementById('yu-rwzxchartBox1'));
                                lineChart.setOption(option);
                                //饼图
                                var option = {
                                    title: {
                                        text: '成功比例图',
                                        /*subtext: 'subtext',*/
                                        x: 'center'
                                    },
                                    tooltip: {
                                        trigger: 'item',
                                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                                    },
                                    legend: {
                                        orient: 'vertical',
                                        left: 'left',
                                        data: ['成功调度次数', '失败调度次数']
                                    },
                                    series: [
                                        {
                                            name: '分布比例',
                                            type: 'pie',
                                            radius: '55%',
                                            center: ['50%', '60%'],
                                            data: [
                                                {
                                                    value: data.content.triggerCountSucTotal,
                                                    name: '成功调度次数'
                                                },
                                                {
                                                    value: data.content.triggerCountFailTotal,
                                                    name: '失败调度次数'
                                                }
                                            ],
                                            itemStyle: {
                                                emphasis: {
                                                    shadowBlur: 10,
                                                    shadowOffsetX: 0,
                                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                                }
                                            }
                                        }
                                    ],
                                    color: ['#00A65A', '#F39C12']
                                };
                                var pieChart = echarts.init(document.getElementById('yu-rwzxchartBox2'));
                                pieChart.setOption(option);
                            } else {
                                vue.$message({message: response.msg + '调度报表数据加载异常', type: 'warning'});
                            }
                        }
                    });
                }
            },
            mounted: function () {
            	var vue = this;
                $('#timepopover li').click(function(){
                    $("li").removeClass("yu-rwzxLiactive");
                    $(this)[0].className='yu-rwzxLiactive';
                    if ($(this).text()=="今日") {
	                    _startDate = moment().startOf('day');
	                    _endDate   = moment().endOf('day');	
                    } else if ($(this).text()=="昨日") {
                    	_startDate = moment().subtract(1, 'days').startOf('day');
	                    _endDate   = moment().subtract(1, 'days').endOf('day');
                    } else if ($(this).text()=="本月") {
                    	_startDate = moment().startOf('month');
	                    _endDate   = moment().endOf('month');	
                    } else if ($(this).text()=="上个月") {
                    	_startDate = moment().subtract(1, 'months').startOf('month');
	                    _endDate   = moment().subtract(1, 'months').endOf('month');	
                    } else if ($(this).text()=="最近一周") {
                    	_startDate = moment().subtract(1, 'weeks');
	                    _endDate   =  moment();	
                    } else if ($(this).text()=="最近一月") {
                    	_startDate = moment().subtract(1, 'months');
	                    _endDate   = moment();	
                    }
                    vue.freshChartDate(_startDate, _endDate);
                });
                //初始化图表
                this.freshChartDate(_startDate, _endDate);
            }
        });
    };
});