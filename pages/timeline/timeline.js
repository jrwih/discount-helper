// pages/timeline/timeline.js

var utilEvent = require('../../event/event.js');
/**Month记录月份数据，Week记录星期数据，Day记录日期数据，Daily记录Date数据*/
var Month = new Array();
var Week = new Array();
var Day = new Array();
var DateDetail = new Array();
var WeekString = new String("日一二三四五六");
var Week_CHS = new Array();

/**weekList为一周的总表，调用event.js中setWeekList设置，并由this.setData向Data中的List输入数据
 * allEvent为所有活动的内容，可以单独调用event.js中setDayList设置 */
var allEvent = new Array(0);
var weekList = new Array(6);
/**class用于处理自定义长度的日期数据 */
class myDateList{
    constructor(nowDate,period){
        this.nowDate = nowDate;
        this.period = period;
        /**Date记录一周的Date数据 */
        this.myDate = new Array(this.period);
        this.time = nowDate.getTime();
    }
    setDate(){
        for(var i=0;i<this.period;i++){
            this.myDate[i] = new Date(0);
            /**24*60*60*1000=86400000 为一天时间 */ 
            this.myDate[i].setTime(this.time + i*86400000);
        }
        return this.myDate;
    }
    setDay(){
        for(var i=0;i<this.period;i++){
            Day[i] = this.myDate[i].getDate();
        }
        return Day;
    }
    setWeek(){
        for(var i=0;i<this.period;i++){
            Week[i] = this.myDate[i].getDay();
        }
        return Week;
    }
    setWeek_CHS(){
        for(var i=0;i<this.period;i++){
            Week_CHS[i] = WeekString.charAt(this.myDate[i].getDay());
        }
        return Week_CHS;
    }
    setMonth(){
        for(var i=0;i<this.period;i++){
            Month[i] = this.myDate[i].getMonth()+1;
        }
        return Month;
    }
}

var slideButtons =[{
    text: "订阅",src:"/static/weui/outlined/like.svg",data:"0"
},{
    text: "编辑",src:"/static/weui/outlined/add.svg"
},{
    text: "删除",src:"/static/weui/outlined/delete.svg"
}]


Page({

    /**页面的初始数据
     * Month,Week,Day传输日期数据
     * current传输当前页面数据
     * List传输活动列表
     */
    data: {
        pageShow : 0,
        Month : [0],
        Week : [0],
        Day : [0],
        eventList : [],
        eventCurrent : 0,
        swiperCurrent : 0,

        inputInfoList: [
            '品牌名',
            '活动名',
            'logo',
            '时间',
            '某天',
            '每周',
            '每月',
        ],

        brandname: '',
        eventname: '',
        logo: '',
        eventtime: '00:00',
        eventdate: '2023-01-01',
        eventweekly: ['7'],
        weekitems: [{name: '0',value: '周日'},{name: '1',value: '周一'},{name: '2',value: '周二'},{name: '3',value: '周三'},{name: '4',value: '周四'},{name: '5',value: '周五'},{name: '6',value:'周六'},{name: '7',value:'无'}],
        eventmonthly: ['0'],
        monthitems:[{name: '0',value: '无'},],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      /**init */
      let init = new function(){
        /**初始化日期数据 */
        let initDateList = new function(){
            let myWeek = new myDateList(new Date(),7);
            DateDetail = myWeek.setDate();//Date保留词所以命名为DateDetail
            Day = myWeek.setDay();
            Week = myWeek.setWeek();
            Week_CHS = myWeek.setWeek_CHS();
            Month = myWeek.setMonth();
        }
        /**初始化活动数据 */
        let initEventList = new function(){
            /**从evnet.js导入数据，allEvent记录所有活动数据，*/
            allEvent = utilEvent.allEventList(allEvent);
            /**weekList为一周的总表，而dateList为单日的活动表
             * 需要一个函数来选择符合时间日期的活动加入dateList */
            weekList = utilEvent.setPeriodList(allEvent,DateDetail);
        }
      }
      /**设置Data中的数据 */
      this.setData({
          Month : Month,
          Week : Week,
          Week_CHS : Week_CHS,
          Day : Day,
          eventList : weekList,
      });
      /**test */

      /**test */
    },

    methods:{

    },
    
    /**更新数据 */
    refreshEvent(){
        weekList = utilEvent.setPeriodList(allEvent,DateDetail);
        this.setData({eventList: weekList});
    },

    /**按照活动id查找索引 */
    findIndex(id){
        var index = -1;
        for(index = 0;index<allEvent.length;index++){
            if(allEvent[index].id == id) return index;
        }
        return false;
    },

    showEventPage(e,index){
        this.setData({
            eventCurrent: (index==null?-1:index),
            pageShow: true,
        })
    },
    exitEventPage(){
        this.setData({pageShow: false})
        // wx.navigateBack()
    },

    slideTap(e){
        var eventIndex = this.findIndex(e.currentTarget.dataset.idEvent);
        switch(e.detail.index){
            /**订阅 */
            case 0:
                allEvent[eventIndex].slideButtons[0].src="/static/weui/filled/like.svg";
                this.refreshEvent();
                break;
            /**编辑 */
            case 1:
                this.showEventPage(e,eventIndex);
                break;
            /**删除 */
            case 2:
                allEvent.splice(eventIndex,1);
                this.refreshEvent();
                break;
        }
    },

    /**表单内容 */
    inputContent(e){
        switch(e.currentTarget.dataset.content){
            case 0:
                this.setData({brandname: e.detail.value});
                break;
            case 1:
                this.setData({eventname: e.detail.value});
                break;
            case 2:
                this.setData({logo: e.detail.value});
                break;
            case 3:
                this.setData({eventtime: e.detail.value});
                break;
            case 4:
                this.setData({eventdate: e.detail.value});
                break;
            case 5:
                this.setData({eventweekly: e.detail.value});
                break;
        }
        var str = this.data.brandname;
        console.log(str);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    /**wxs调用的callMethod函数，用于同步header与swiper状态 */
    syncSwiper: function(i){
        this.setData({swiperCurrent: i,});
        return false;
    },
})