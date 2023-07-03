/**event.js用于处理所有有关活动的事务
 * 包括添加活动，管理活动，活动日期的安排
 * 活动详情应到全局变量globaldata中,
 * 好把app中的globaldata无法setdata，不方便页面间传输全局变量，如果用户要添加活动只能每个页面都设置一遍？
 */

class myEvent{
    constructor(brandname,eventName,eventLogo,eventDate,eventWeekly,eventMonthly,eventTime){
        this.brandname = brandname
        this.eventname = eventName;
        this.logo = eventLogo;
        /**活动日期：
         * date特定某天，类型为Date或0，
         * weekly每周，类型为Array[0,1,2,3,4,5,6]，0为周日，
         * monthly每月，类型为Array[1~31]，注意边界问题
         * 时间为0时不在时间轴上显示具体时间 */
        this.date = eventDate;
        this.weekly = eventWeekly;
        this.monthly = eventMonthly;
        this.time = eventTime;
    }
}
/**直接在event中维护详细信息，之后在app.js中测试其他数据 */
var allEventDetail = [
    /**品牌名，活动名，logo建议放在/static/images/logo/中，某天，每周几，每月几，具体时间 */
    ['KFC','疯狂星期四','/static/images/logo/Kfc_logo.png',0,4,0,'10:00'],
    ['McDonalds','麦当劳会员日','/static/images/logo/McDonalds-logo.png',0,[0,6],0,"10:30"]
]
/**将event详细信息转换为event对象 */
function allEventList(allEvent){
    for(var i = 0;i< allEventDetail.length;i++){
        allEvent[i] = new myEvent(allEventDetail[i][0],allEventDetail[i][1],allEventDetail[i][2],allEventDetail[i][3],allEventDetail[i][4],allEventDetail[i][5],allEventDetail[i][6],)
    }
    return allEvent;
}



module .exports = {
    allEventList : allEventList,
}