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
        if(eventDate!=0){this.date = new Date(eventDate);}
        else{this.date = 0;}
        this.weekly = eventWeekly;
        this.monthly = eventMonthly;
        this.time = eventTime;
        /**flag用于指示时间是否显示 */
        this.timeflag = 1;
    }
}
/**直接在event中维护详细信息，之后在app.js中测试其他数据 */
var allEventDetail = [
    /**品牌名，活动名，logo建议放在/static/images/logo/中，某天'2023,7,4'，每周几，每月几，具体时间 */
    ['StarBucks','测试用例','/static/images/logo/Starbucks-logo.png','2023,7,4',-1,[7],'00:00'],
    ['KFC','疯狂星期四','/static/images/logo/KFC-logo.png',0,[4],0,'10:00'],
    ['McDonalds','麦当劳会员日','/static/images/logo/McDonalds-logo.png',0,[0,1,6],0,'10:30'],
    ['蜜雪冰城','满12-2元','/static/images/logo/MiXue-logo.png',0,[3],0,'10:00'],
    ['华莱士','全场6元','/static/images/logo/Wallace.png',0,-1,[6,16,26],'10:00'],
    ['饿了么','抢18元红包','/static/images/logo/Eleme.png',0,[0,6],[18],'00:00'],
    ['美团','抢18元红包','/static/images/logo/Meituan.png',0,[0,6],[18],'00:00'],
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
            for(j=0;j<allEvent[i].monthly.length;j++){
                if(allEvent[i].monthly[j] == dayDetail.getDate()){flag = 1}
            }
            if(flag){dayList.push(allEvent[i]);}
            else{
                /**当event.date非空，且getDate()日期、getMonth()月份都相同才加入数组 */
                if(allEvent[i].date!=0){
                    if(allEvent[i].date.getDate()==dayDetail.getDate()
                       &&allEvent[i].date.getMonth()==dayDetail.getMonth()){
                        {flag = 1} 
                    }
                }
                if(flag){dayList.push(allEvent[i]);}
                else continue;
            }
        }
    }
    return sortDayList(dayList);
}
/**对dayList按活动时间time进行排序
 * time="10:30",time.split(":")="10,30",Number(time.split(":")[0])=10
 */
function sortDayList(dayList){
    dayList.sort(function(a,b){
        return((Number(a.time.split(":")[0])*60 + Number(a.time.split(":")[1]))
                - (Number(b.time.split(":")[0])*60 + Number(b.time.split(":")[1])) )
    })
    return setTimeFlag(dayList);
}
/**对排序后的dayList中的Event进行timeflag设置，时间为0时隐藏，与前一时间相同时隐藏 */
function setTimeFlag(dayList){
    /**JS中变量本身没有类型，只有值有类型，因此无法直接访问其中的内容,创建temp用于存储myEvent后的list */
    var temp = new Array();
    //if(dayList[0].time=='00:00'){dayList[0].timeflag = 0};
    for(var i=0;i<dayList.length;i++){
        /** 先初始化类型变量，再通过引用赋值，然后可以访问类成员变量。离开for循环后又会失效。
         *  Lesson5,绕远路才是我的捷径！真是饶了好大一圈啊，谢谢你，杰洛。*/
        temp[i] = new myEvent();
        temp[i] = dayList[i];
        /**为了防止边界问题，先处理0==i的情况*/
        if(0==i){
            if('00:00'==temp[i].time){temp[i].timeflag=0;}
        }
        else if(temp[i-1].time==temp[i].time){temp[i].timeflag=0;}
    }
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