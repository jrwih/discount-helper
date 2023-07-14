/**event.js用于处理所有有关活动的事务
 * 包括添加活动，管理活动，活动日期的安排
 * 活动详情应到全局变量globaldata中,
 * 好把app中的globaldata无法setdata，不方便页面间传输全局变量，如果用户要添加活动只能每个页面都设置一遍？
 */

class myEvent{
    constructor(id,brandname,eventName,eventLogo,eventDate,eventWeekly,eventMonthly,eventTime){
        /**以下为基础信息活动日期：
         * date特定某天，类型为Date(year,month,day)或0，
         * weekly每周，类型为Array[0,1,2,3,4,5,6]，0为周日，
         * monthly每月，类型为Array[1~31]，注意边界问题
         * 时间为0时不在时间轴上显示具体时间 */
        this.id = id;
        this.brandname = brandname;
        this.eventname = eventName;
        this.logo = eventLogo;
        if(eventDate!=0){this.date = new Date(eventDate);}
        else{this.date = 0;}
        this.weekly = eventWeekly;
        this.monthly = eventMonthly;
        this.time = eventTime;
        /**以下为逻辑信息，
         * flag用于指示时间是否显示 */
        this.timeflag = 1;
        this.slideButtons = [{
            text: "订阅",src:"/static/weui/outlined/like.svg"
        },{
            text: "编辑",src:"/static/weui/outlined/add.svg"
        },{
            text: "删除",src:"/static/weui/outlined/delete.svg"
        }];
    }
}

/**小程序初始化时，调用该函数初始化allEvent数组，将event详细信息转换为event对象 */
function allEventList(allEvent){
    /**从缓存中读取文件 */
    try{
        var allEventDetail = wx.getStorageSync('0');
    } catch(e){
        console.log("读取失败");
    }
    /**缓存为空时，写入原始数据 */
    if(allEventDetail==[]){
        console.log("数据为空");
        allEventDetail = [
            /**id,品牌名，活动名，logo建议放在/static/images/logo/中，某天'2023,7,4'，每周几，每月几，具体时间*/
            [0,'StarBucks','测试用例','/static/images/logo/Starbucks-logo.png','2023,7,4',-1,[11,12],'00:00'],
            [1,'KFC','疯狂星期四','/static/images/logo/KFC-logo.png',0,[4],0,'10:00'],
            [2,'McDonalds','麦当劳会员日','/static/images/logo/McDonalds-logo.png',0,[0,1,6],0,'10:30'],
            [3,'蜜雪冰城','满12-2元','/static/images/logo/MiXue-logo.png',0,[3],0,'10:00'],
            [4,'华莱士','全场6元','/static/images/logo/Wallace.png',0,-1,[6,16,26],'10:00'],
            [5,'饿了么','抢18元红包','/static/images/logo/Eleme.png',0,[0,6],[18],'00:00'],
            [6,'美团','抢18元红包','/static/images/logo/Meituan.png',0,[0,6],[18],'00:00'],
        ]
        wx.setStorage({
            key: '0',
            data: allEventDetail,
            success(){
                console.log("写入成功");
            },
            fail(){
                console.log("写入失败");
            }
        })
    }
    return transData(allEventDetail, allEvent);
}
/**将传入的数据转换为myEvent对象 */
function transData(eventDetail) {
    var _allEvent = new Array();
    for (var i = 0; i < eventDetail.length; i++) {
        _allEvent[i] = new myEvent(eventDetail[i][0], eventDetail[i][1], eventDetail[i][2], eventDetail[i][3], eventDetail[i][4], eventDetail[i][5], eventDetail[i][6], eventDetail[i][7]);
    }
    transEvent(_allEvent);
    return _allEvent;
}

function transEvent(allEvent){
    var _eventDetail = new Array();
    for(var i =0;i<allEvent.length;i++){
        _eventDetail[i] = [allEvent[i].id,allEvent[i].brandname,allEvent[i].eventname,allEvent[i].logo,(allEvent[i].date==0?0:String(allEvent[i].date.getFullYear()+','+(allEvent[i].date.getMonth()+1)+','+allEvent[i].date.getDate())),allEvent[i].weekly,allEvent[i].monthly,allEvent[i].time];
    }
    return _eventDetail;
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
    transData : transData,
    transEvent : transEvent,
}