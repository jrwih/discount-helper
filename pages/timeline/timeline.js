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

/**weekList为一周的总表，而dateList为单日的活动表，并由this.setData向Data中的List输入数据 */
var weekList = new Array(6);
var dateList = new Array();

Page({

    /**页面的初始数据
     * Month,Week,Day传输日期数据
     * current传输当前页面数据
     * List传输活动列表
     */
    data: {
        Month : [0],
        Week : [0],
        Day : [0],
        swiperCurrent : 0,
        List:[],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      /**init */
      let init = new function(){
        /**初始化一周的日期数据 */
        let week = new myWeek(nowDate);
        week.setNextWeek();
        /**初始化一周的活动数据，测试中 */
        /**从evnet.js导入数据，allEvent记录所有活动数据，*/
        var utilEvent = require('../event/event.js');
        var allEvent = new Array(0);
        allEvent = utilEvent.allEventList(allEvent);
        /**weekList为一周的总表，而dateList为单日的活动表
         * 需要一个函数来选择符合时间日期的活动加入dateList */
        dateList[0] = allEvent[0];
        dateList[1] = allEvent[1];
        weekList[0] = dateList;
        //console.log(JSON.stringify(allEvent[0]))
      }
      /**设置Data中的数据 */
      this.setData({
          Month : Month,
          Week : Week,
          Day : Day,
          List : weekList,
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

    },

    /**wxs调用的callMethod函数，用于同步header与swiper状态 */
    syncSwiper: function(i){
        this.setData({swiperCurrent: i,});
        return false;
    },
})