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
         * date特定某天，类型为Date(year,month,day)或0，
         * weekly每周，类型为Array[0,1,2,3,4,5,6]，0为周日，
         * monthly每月，类型为Array[1~31]，注意边界问题
         * 时间为0时不在时间轴上显示具体时间 */
        if(eventDate!=0){this.date = Date(eventDate);}
        else{this.date = 0;}
        this.weekly = eventWeekly;
        this.monthly = eventMonthly;
        this.time = eventTime;
    }
}
/**直接在event中维护详细信息，之后在app.js中测试其他数据 */
var allEventDetail = [
    /**品牌名，活动名，logo建议放在/static/images/logo/中，某天，每周几，每月几，具体时间 */
    ['KFC','疯狂星期四','/static/images/logo/Kfc_logo.png',0,[4],0,'10:00'],
    ['McDonalds','麦当劳会员日','/static/images/logo/McDonalds-logo.png',0,[0,6],0,"10:30"]
]
/**将event详细信息转换为event对象 */
function allEventList(allEvent){
    for(var i = 0;i< allEventDetail.length;i++){
        allEvent[i] = new myEvent(allEventDetail[i][0],allEventDetail[i][1],allEventDetail[i][2],allEventDetail[i][3],allEventDetail[i][4],allEventDetail[i][5],allEventDetail[i][6],)
    }
    return allEvent;
}

/**对allEvent进行遍历筛选，符合条件的列入对应的每日daylist,再将daylist合并为periodlist，适用于周期较短的情况，
 * 设O(allEvent)=m,O(period)=n，即m个活动，时间周期为n，则复杂度为O=m*n,
 * 若将活动插入weeklist，则只需要遍历一次allEvent，复杂度O=m，还是需要遍历period，因为大多数活动都是周期性的
 * allEvent为myEvent对象，dayDetail为Date对象
 */
function setDayList(allEvent,dayDetail){
    var dayList = new Array();
    var flag = new Boolean(0);
    for(var i=0;i<allEvent.length;i++){
        /**对于每个活动，判断在当天是否有活动,有活动则flag=1。
         * 为提高性能，按weekly[]-monthly[]-date顺序判断 */
        flag = 0;
        for(var j=0;j<allEvent[i].weekly.length;j++){
            if(allEvent[i].weekly[j] == dayDetail.getDay()){flag = 1}
        }
        if(flag){dayList.push(allEvent[i]);}
        else{
            for(var j=0;j<allEvent[i].monthly.length;j++){
                if(allEvent[i].monthly[j] == dayDetail.getMonth()+1){flag = 1}
            }
            if(flag){dayList.push(allEvent[i]);}
            else{
                /**当event.date非空，且getDate()日期相同才加入数组 */
                if(allEvent[i].date!=0
                   &&allEvent[i].date.getDate()==dayDetail.getDate()){flag = 1}
                if(flag){dayList.push(allEvent[i]);}
                else continue;
            }
        }
    }
    /**对dayList按活动时间time进行排序
     * time="10:30",time.split(":")="10,30",Number(time.split(":")[0])=10
     */
    dayList.sort(function(a,b){
        return((Number(a.time.split(":")[0])*60 + Number(a.time.split(":")[1]))
                - (Number(b.time.split(":")[0])*60 + Number(b.time.split(":")[1])) )
    })
    return dayList;
}
function setPeriodList(allEvent,periodDetail){
    var periodList = new Array();
    /**对时期内每一天进行遍历 */
    for(var i=0;i<periodDetail.length;i++){
        periodList[i] = setDayList(allEvent,periodDetail[i]);
    }
    return periodList;
}

module .exports = {
    allEventList : allEventList,
    setEventList : setDayList,
    setPeriodList : setPeriodList,
}