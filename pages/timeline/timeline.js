// pages/timeline/timeline.js

/**Month记录月份数据，Week记录星期数据，Day记录日期数据*/
var Month = new Array();
var Week = new Array();
var WeekString = new String("日一二三四五六");
var Day = new Array();
var nowDate = new Date();
/**用于处理一周的日期数据 */
class myWeek{
    constructor(nowDate){
        this.nowDate = nowDate;
        /**Date记录一周的Date数据 */
        this.myDate = new Array(6);
        this.time = nowDate.getTime();
    }
    setNextWeek(){
        for(var i=0;i<7;i++){
            this.myDate[i] = new Date(0);
            /**24*60*60*1000=86400000 为一天时间 */
            this.myDate[i].setTime(this.time + i*86400000);
            Month[i] = this.myDate[i].getMonth()+1;
            Week[i] = WeekString.charAt(this.myDate[i].getDay());
            Day[i] = this.myDate[i].getDate();
        }
    }
}

/**用于记录活动 */
class myEvent{
    constructor(eventName,eventDate,eventDaily,eventWeekly,eventMonthly,eventTime){
        this.name = eventName;
        /**活动日期：
         * date特定某天，类型为Date或0，
         * daily每日，类型为Boolen，
         * weekly每周，类型为Array[0,1,2,3,4,5,6]，0为周日，
         * monthly每月，类型为Array[1~31]，注意边界问题
         * 时间为0时不在时间轴上显示具体时间 */
        this.date = eventDate;
        this.daily = eventDaily;
        this.weekly = eventWeekly;
        this.monthly = eventMonthly;
        this.time = eventTime;
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        Month : [0],
        Week : [0],
        Day : [0],
        swiperCurrent : 0,
        eventList:[
            'KFC',
            'McDonald',
            'StarBucks'
        ]
    },

    /**wxs调用的callMethod函数，用于同步header与swiper状态 */
    syncSwiper: function(i){
        this.setData({swiperCurrent: i,});
        return false;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      /**init */
      let init = new function(){
        let week = new myWeek(nowDate);
        week.setNextWeek();
      }
      this.setData({
          Month : Month,
          Week : Week,
          Day : Day,
      });
      /**test */

      /**test */
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

    }
})