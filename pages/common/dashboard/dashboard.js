/**
 * Created by wangyin on 2017/11/16.
 */
define(["echarts"], function (require, exports) {

    //page加载完成后调用ready方法
    exports.ready = function (hashCode, data, cite) {
        var newRoute={
            route_20180107211030: {
                html: "pages/example/package/demoAddMenuTab.html",
                js: "pages/example/package/demoAddMenuTab.js"
            }
        };
        yufp.router.addRouteTable(newRoute);
        window.dashboardClickFn = function () {
            var customKey = 'custom_20180107211030'; //请以custom_前缀开头，并且全局唯一
            var routeId = 'route_20180107211030';   //模板示例->普通查询的路由ID
            yufp.frame.addTab({
                id: routeId,              //菜单功能ID（路由ID）
                key: customKey,           //自定义唯一页签key,请统一使用custom_前缀开头
                title: '报告详情',         //页签名称
                data: { custId: '1001001' }   //传递的业务数据，可选配置
            });
        };

        setCharts = function (){
            //资金充足率
            var myChart1 = echarts.init(document.getElementById('chartBox1'));
            var option1 = {
                title: {
                    text: '资金充足率',
                    left: 'center',
                    top:'bottom',
                    padding:[0,0,20,0],
                    textStyle:{
                        color:'#666',
                        fontWeight:'normal',
                        fontSize:14
                    }
                },
                tooltip : {
                    formatter: "{a}<br/>资金充足率: {c}%"
                },
                grid: {
                    top:'10',
                    left: '10',
                    right: '10',
                    bottom: '10',
                    containLabel: true
                },
                series: [
                    {
                        name: '2016年9月',
                        type: 'gauge',
                        radius:'85%',
                        detail: {
                            formatter:'{value}%',
                            offsetCenter: [0, '55%'],
                            textStyle:{
                                fontSize: 22
                            }
                        },
                        data: [{value: 48}],
                        axisLine:{
                            lineStyle:{
                                width:12,
                                color:[[0.2, '#17d5af'], [0.8, '#2293de'], [1, '#c3191d']]
                            }
                        },
                        pointer: {
                            length: '80%',
                            width: 6
                        },
                    }
                ]
            };
            myChart1.setOption(option1);

            //拨备覆盖率
            var myChart2 = echarts.init(document.getElementById('chartBox2'));
            var option2 = {
                title: {
                    text: '拨备覆盖率',
                    left: 'center',
                    top:'bottom',
                    padding:[0,0,20,0],
                    textStyle:{
                        color:'#666',
                        fontWeight:'normal',
                        fontSize:14
                    }
                },
                tooltip : {
                    formatter: "{a}<br/>拨备覆盖率: {c}%"
                },
                grid: {
                    top:'10',
                    left: '10',
                    right: '10',
                    bottom: '10',
                    containLabel: true
                },
                series: [
                    {
                        name: '2016年9月',
                        type: 'gauge',
                        radius:'85%',
                        detail: {
                            formatter:'{value}%',
                            offsetCenter: [0, '55%'],
                            textStyle:{
                                fontSize: 22
                            }
                        },
                        data: [{value: 69}],
                        axisLine:{
                            lineStyle:{
                                width:12,
                                color:[[0.2, '#17d5af'], [0.8, '#2293de'], [1, '#c3191d']]
                            }
                        },
                        pointer: {
                            length: '80%',
                            width: 6
                        }
                    }
                ]
            };
            myChart2.setOption(option2);

            //存款趋势
            var myChart3 = echarts.init(document.getElementById('chartBox3'));
            var option3 = {
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type:'shadow'
                    }
                },
                legend: {
                    data:['2015年','2016年'],
                    padding:[15,0,0,10],
                    textStyle:{
                        color:'#666'
                    }
                },
                grid: {
                    top:'40',
                    left: '0',
                    right: '30',
                    bottom: '15',
                    containLabel: true
                },
                textStyle: {
                    color: '#888'
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: ['3月','4月','5月','6月',' 7月','8月'],
                    axisLine:{
                        lineStyle:{
                            color:'#ddd'
                        }
                    }
                },
                yAxis: {
                    show:false,
                    type: 'value',
                    axisLine:{
                        lineStyle:{
                            color:'#ddd'
                        }
                    }
                },
                series: [
                    {
                        name:'2016年',
                        type:'bar',
                        barWidth:'10',
                        data:  [2688, 3771, 4129,5233,4341,4122],
                        itemStyle:{
                            normal:{
                                color:'#0065d2'
                            }
                        }
                    },
                    {
                        name:'2015年',
                        type:'bar',
                        barWidth:'10',
                        data: [4188, 2671, 2800, 3200, 3800, 2695],
                        itemStyle:{
                            normal:{
                                color:'#fab130'
                            }
                        }
                    }
                ]
            };
            myChart3.setOption(option3);

            //贷款趋势
            var myChart4 = echarts.init(document.getElementById('chartBox4'));
            var option4 = {
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type:'shadow'
                    }
                },
                legend: {
                    data:['2015年','2016年'],
                    padding:[15,0,0,10],
                    textStyle:{
                        color:'#666'
                    }
                },
                grid: {
                    top:'40',
                    left: '0',
                    right: '30',
                    bottom: '15',
                    containLabel: true
                },
                textStyle: {
                    color: '#888'
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: ['3月','4月','5月','6月',' 7月','8月'],
                    axisLine:{
                        lineStyle:{
                            color:'#ddd'
                        }
                    }
                },
                yAxis: {
                    show:false,
                    type: 'value',
                    min:'dataMin',
                    axisLine:{
                        lineStyle:{
                            color:'#ddd'
                        }
                    }
                },
                series: [
                    {
                        name:'2016年',
                        type:'line',
                        barWidth:'10',
                        data:  [2688, 3771, 4129,5233,2341,4122],
                        itemStyle:{
                            normal:{
                                color:'#0065d2'
                            }
                        }
                    },
                    {
                        name:'2015年',
                        type:'line',
                        barWidth:'10',
                        data: [4188, 2671, 2800, 3200, 3800, 2695],
                        itemStyle:{
                            normal:{
                                color:'#fab130'
                            }
                        }
                    }
                ]
            };
            myChart4.setOption(option4);


            //中间业务收入
            var myChart5 = echarts.init(document.getElementById('chartBox5'));
            var option5 = {
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type:'shadow'
                    }
                },
                legend: {
                    show:false
                },
                grid: {
                    top:'10',
                    left: '-20',
                    right: '20',
                    bottom: '10',
                    containLabel: true
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    data: ['3月','4月','5月','6月',' 7月','8月'],
                    axisLine:{
                        lineStyle:{
                            color:'#ddd'
                        }
                    }
                },
                textStyle: {
                    color: '#888'
                },
                yAxis: {
                    show:false,
                    type: 'value',
                    min:'dataMin'
                },
                series: [
                    {
                        name:'余额',
                        type:'line',
                        data:[1880, 1337, 1190, 1900, 2130, 1680.82],
                        itemStyle:{
                            normal:{
                                color:'#0065D2'
                            }
                        }
                    }
                ]
            };

            myChart5.setOption(option5);

            //中间业务收入
            var myChart6 = echarts.init(document.getElementById('chartBox6'));
            var option6 = {
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type:'shadow'
                    }
                },
                legend: {
                    show:false
                },
                grid: {
                    top:'10',
                    left: '-20',
                    right: '20',
                    bottom: '10',
                    containLabel: true
                },
                xAxis:  {
                    type: 'category',
                    data: ['3月','4月','5月','6月','7月','8月'],
                    axisLine:{
                        lineStyle:{
                            color:'#ddd'
                        }
                    }
                },
                textStyle: {
                    color: '#888'
                },
                yAxis: {
                    show:false,
                    type: 'value'
                },
                series: [
                    {
                        name:'收入',
                        type:'bar',
                        barWidth:'10',
                        data:[188.08, 243.71, 129, 290.01, 213.01, 380.28],
                        itemStyle:{
                            normal:{
                                color:'#fab130'
                            }
                        }
                    }
                ]
            };

            myChart6.setOption(option6);

            //中间业务收入
            var myChart7 = echarts.init(document.getElementById('chartBox7'));
            var option7 = {
                title: {
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type:'shadow'
                    }
                },
                legend: {
                    show:false
                },
                grid: {
                    top:'10',
                    left: '-20',
                    right: '20',
                    bottom: '10',
                    containLabel: true
                },
                xAxis:  {
                    type: 'category',
                    data: ['3月','4月','5月','6月','7月','8月'],
                    axisLine:{
                        lineStyle:{
                            color:'#ddd'
                        }
                    }
                },
                textStyle: {
                    color: '#888'
                },
                yAxis: {
                    show:false,
                    type: 'value',
                    min:'dataMin'
                },
                series: [
                    {
                        name:'余额',
                        type:'line',
                        barWidth:'10',
                        smooth: true,
                        data:[128.08, 83.71, 129, 190.01, 113.01, 169.15],
                        itemStyle:{
                            normal:{
                                color:'#c3191d'
                            }
                        }
                    }
                ]
            };

            myChart7.setOption(option7);
        };

        setTabs = function (){
            $('.yu-tabs').each(function(){
                var _eN=$(this).attr('data-eventName')?$(this).attr('data-eventName'):'click';
                $(this).find('a').on(_eN,function(){
                    $(this).addClass('selected').siblings().removeClass('selected');
                    $(this).parent().parent().siblings('.yu-tabBox').eq($(this).index()).show().siblings('.yu-tabBox').hide();
                });
            });
        };

        //Demo相关js逻辑，仅示例，请开发自行实现完善
        setCharts();
        setTabs();
    };

    //消息处理
    exports.onmessage = function (type, message) {

    };

    //page销毁时触发destroy方法
    exports.destroy = function (id, cite) {

    }

});