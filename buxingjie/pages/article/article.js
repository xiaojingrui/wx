var api = require("../../utils/api.js");
var _ = require("../../utils/underscore.js");
var WxParse = require('../../wxParse/wxParse.js');
var reHtml = /<[^<]*>/g;
let {fid} = require("../../config");

Page({
  data: {
      tid: "",
      headerimg: "",
      title:"",
      addtime: "",
      origin:"",
      load_ncid:"",
      create_time:"",
      lights: [],
      replys: [],
      hasNext: false,
      replyLoading: false
  },
  onShareAppMessage: function(){
    return {
      title: `认真的虎扑足球`,
      desc : '认真的足球最有趣。',
      path: `/pages/article/article?tid=${this.data.tid}`
    }
  },
  onLoad: function (option) {
    var self = this;
    var tid = option.tid || '14763965'
    this.setData({tid})
    //主贴
    api.getBBSArticle()
       .bindParams({tid, fid})
       .execute(function(res){
           var result = res.data;
           
           var dataBase = {
             title: result.title,
             addtime: result.time,
           }
           self.setData(dataBase)
           var content = result.content
           WxParse.wxParse('content', 'html', content, self, 5);

           self.getLight()
           self.getReply()
       }, function(err){
         wx.showToast({
          title: '获取论坛接口报错',
          icon: 'warn',
          duration: 2000
         })
       })
  },
  filterHtml: function( content ){
    //过滤html标签
    return content.replace(reHtml, "")
  },
  filterContent: function(list){
    var ret = []
    if(_.isArray(list)){
      list.map(item => {
          //过滤不适合展示评论
          if( _.isUndefined(item.is_delete) && item.audit_status != 1 ){
            item.content = this.filterHtml(item.content)
            if(item.quote_data && item.quote_data.content){
               item.quote_data.content = this.filterHtml(item.quote_data.content)
            }
            ret.push(item)
          }
      })
    }
    return ret
  },
  getLight: function(){
    var self = this
    var tid = this.data.tid;

    api.getBBSLight()
       .bindParams({tid})
       .execute(({data}) => {
        console.log(data,"亮了")
        var list = data.list;
          var params = {};
          params["lights"] = data.list;
          self.setData(params);

          //WxParse.wxParseTemArray("light",'reply', replyArr.length, that)

          // if(data.list.quote && data.list.quote.length){
          //   self.setData({
          //     lights: self.filterContent(data.list.quote)
          //   })
          // }
        }, function(){
          wx.showToast({
           title: '获取亮评论接口报错',
           icon: 'warn',
           duration: 2000
          })
        });
  },
  getReply: function(){
    var self = this;
    var tid = this.data.tid;

    this.setData({
      replyLoading: true
    })
    api.getBBSReply()
       .bindParams({tid})
       .execute(({data}) => {
          var list = data.result.list;
          var params = {};
          params["replys"] = data.result.list;
          self.setData(params);

          // if(data.data && data.data.length){
          //   var replys =  this.data.replys.concat(this.filterContent(data.data))

          //   this.setData({
          //     hasNext: !!data.hasNextPage,
          //     replys: replys,
          //     replyLoading: false,
          //     load_ncid: data.data[data.data.length - 1].ncid,
          //     create_time: data.data[data.data.length - 1].create_time
          //   })
          // }
        }, function(res){
          wx.showToast({
           title: '获取最新评论接口报错',
           icon: 'warn',
           duration: 2000
          })
        })
  },
  onReachBottom: function(){
    if(this.data.hasNext && !this.data.replyLoading){
          var params = {
              nid: this.data.nid,
              ncid: this.data.load_ncid,
              create_time: this.data.create_time
          };
          this.setData({
             replyLoading: true
          });

          api.getNewsReply()
             .bindParams(params)
             .execute(({data}) => {

              this.setData({
                hasNext: !!data.hasNextPage,
                replys: this.data.replys.concat(this.filterContent(data.data) || []),
                replyLoading: false,
                load_ncid: data.data[data.data.length - 1].ncid,
                create_time: data.data[data.data.length - 1].create_time
              })

          }, function(){
              wx.showToast({
               title: '获取更多评论接口报错',
               icon: 'warn',
               duration: 2000
              })
          })
    }
  }
})
