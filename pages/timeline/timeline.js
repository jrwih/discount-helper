// pages/timeline/timeline.js

/**Month记录月份数据，Week记录星期数据，Day记录日期数据，Daily记录Date数据*/
var Month = new Array();
var Week = new Array();
var Day = new Array();
var DateDetail = new Array();
var WeekString = new String("日一二三四五六");
var Week_CHS = new Array();

/**weekList为一周的总表，调用event.js中setWeekList设置，并由this.setData向Data中的List输入数据
 * 而dayList为单日的活动表，可以单独调用event.js中setDayList设置 */
var weekList = new Array(6);
var dayList = new Array();
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
            var utilEvent = require('../../event/event.js');
            var allEvent = new Array(0);
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