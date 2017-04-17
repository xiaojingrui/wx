var api = require("../../utils/api.js");
var _ = require("../../utils/underscore.js");
var WxParse = require('../../wxParse/wxParse.js');
var reHtml = /<[^<]*>/g;

Page({
  data: {
      nid: "",
      leaguesEn: "",
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
      path: `/pages/article/article?nid=${this.data.nid}&leagues=${this.data.leaguesEn}`
    }
  },
  onLoad: function (option) {
    var self = this;
    this.setData({
      nid: option.nid,
      leaguesEn: option.leagues
    })

    api.getNewsArticle()
       .bindParams({nid: option.nid, leaguesEn: option.leagues})
       .execute(function(res){
           var result = res.data;
           var newsBase = {
             title: result.news.title,
             addtime: result.news.addtime,
           }

           if(result.news.origin){
             newsBase.origin = result.news.origin
           }
           if(result.news.img_m){
             newsBase.headerimg = result.news.img_m
           }

           self.setData(newsBase)

           var content = result.news.content
           WxParse.wxParse('content', 'html', content, self, 5);

           self.getLight()
           self.getReply()
       }, function(err){
         wx.showToast({
          title: '获取新闻接口报错',
          icon: 'warn',
          duration: 2000
         })
       });
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
    var nid = this.data.nid;

    api.getNewsLight()
       .bindParams({nid})
       .execute(({data}) => {
          if(data.light_comments && data.light_comments.length){
            self.setData({
              lights: self.filterContent(data.light_comments)
            })
          }
        }, function(){
          wx.showToast({
           title: '获取亮评论接口报错',
           icon: 'warn',
           duration: 2000
          })
        });
  },
  getReply: function(){
    var nid = this.data.nid;

    this.setData({
      replyLoading: true
    })
    api.getNewsReply()
       .bindParams({nid})
       .execute(({data}) => {
          if(data.data && data.data.length){
            var replys =  this.data.replys.concat(this.filterContent(data.data))

            this.setData({
              hasNext: !!data.hasNextPage,
              replys: replys,
              replyLoading: false,
              load_ncid: data.data[data.data.length - 1].ncid,
              create_time: data.data[data.data.length - 1].create_time
            })
          }
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
