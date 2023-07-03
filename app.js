// app.js

/**需要设置为全局变量，包含所有活动的信息
 * app中的globaldata无法setdata，不方便页面间传输全局变量，只能每个页面都维护一个allEvent？
 */
var allEventDetail = [
    /**品牌名，活动名，logo建议放在/static/images/logo/中，某天，每周几，每月几，具体时间 */
    ['KFC','疯狂星期四','/static/images/logo/Kfc_logo.png',0,4,0,'10:00'],
    ['McDonalds','麦当劳会员日','/static/images/logo/McDonalds-logo.png',0,[0,6],0,"10:30"]
]

App({
    globalData:{
        allEventDetail: allEventDetail,
    }
})
