//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [
      'http://www.zm1717.com/images/index/bd_nei_1.jpg',
      'http://www.zm1717.com/images/index/bd_nei_2.jpg',
      'http://www.zm1717.com/images/index/bd_nei_3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    navItems:[
      {
        name:'吃饭视频直播',
        url:'take',
        isSplot:true
      },
      {
        name:'点餐',
        url:'dishes',
         isSplot:true
      }
    ]
  },
  onLoad: function () {
    console.log('onLoad');
  }
    
})
