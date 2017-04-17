
// 加载配置文件
const config = require( '../config.js' );

function formatTime( date ) {

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

// 格式化时间戳
function getTime( timestamp ) {
    var time = arguments[ 0 ] || 0;
    var t, y, m, d, h, i, s;
    t = time ? new Date( time * 1000 ) : new Date();
    y = t.getFullYear();    // 年
    m = t.getMonth() + 1;   // 月
    d = t.getDate();        // 日

    h = t.getHours();       // 时
    i = t.getMinutes();     // 分
    s = t.getSeconds();     // 秒

    return [ y, m, d ].map( formatNumber ).join('-') + ' ' + [ h, i, s ].map( formatNumber ).join(':');

}

module.exports = {

    formatTime: formatTime,
    getTime : getTime,

    AJAX : function( url , fn, errfn, method = "get", header = {}){
        wx.request({
            url: config.API_HOST + url,
            method : method ? method : 'get',
            data: {},
            header: header ? header : {"Content-Type":"application/json"},
            success: function( res ) {
               if(res.data.status == 0){
                 fn( res.data )
               } else{
                 errfn( res.data )
               }
            }
        });
    },

    /**
     * 获取格式化日期
     * 20161002
     */
    getFormatDate : function( str ) {

        // 拆分日期为年 月 日
        var YEAR = str.substring( 0, 4 ),
            MONTH = str.substring( 4, 6 ),
            DATE = str.slice( -2 );

        // 拼接为 2016/10/02 可用于请求日期格式
        var dateDay = YEAR + "/" + MONTH + "/" + DATE;

        // 获取星期几
        var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            day = new Date( dateDay ).getDay();

        return {
            "dateDay" : MONTH + "月" + DATE + "日 " + week[ day ]
        }

    },

}
