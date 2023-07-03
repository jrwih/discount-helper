// app.js

/**需要设置为全局变量，包含所有活动的信息
 * app中的globaldata无法setdata，不方便页面间传输全局变量，只能每个页面都维护一个allEvent？
 */
var test = 1;

App({
    globalData:{
        test: test,
    }
})
