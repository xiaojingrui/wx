//index.js
//获取应用实例
var api = require("../../utils/api");
let {fid , salt_key} = require("../../config");

function getList(scope, tabIndex, data = {}) {
    var params = {
        loadingBottom: false
    };
    var key = `tab${tabIndex}`
    var result = [];
    data.page = 1;
    data.entrance = -1;
    data.type = tabIndex;
    data.fid = fid;
    data.salt_key = salt_key;
    api.getList()
       .bindParams(data)
       .execute(function(res) {
          if (data.direc) {
              result = scope.data[key].concat(res.result.data);
          } else {
              result = res.result.data;
          }
          params[key] = result;
          scope.setData(params);
    }, function(res){
        wx.showToast({
         title: '获取论坛列表接口报错',
         icon: 'warn',
         duration: 2000
        })
    });
};

var tabs = [{
  name:'最新回复',
  index: 1
},{
  name:'最新发布',
  index: 2
},{
  name:'精华',
  index: 3
}];

Page({
    data: {
        tabIndex: 1,
        tab1: [],
        tab2: [],
        tab3: [],
        tabs: tabs,
        loadingBottom: false
    },
    onShareAppMessage: function(){
      return {
        title: `虎扑步行街`,
        desc : '认真的足球最有趣。',
        path: `/pages/index/index?tab=${this.data.tabIndex}`
      }
    },
    // 链接跳转
    linkTo: function(event) {
        let { tid } = event.currentTarget.dataset
        wx.navigateTo({
            url: "../article/article?tid=" + tid
        });
    },

    // tab切换
    tabToggle: function(event) {
        var tabIndex = parseInt(event.target.dataset.tab);
        if (tabIndex != this.data.tabIndex) {
            this.setData({
                tabIndex: tabIndex
            });

            getList(this, tabIndex);
        }
    },
    onLoad: function(option) {
        var tabIndex = parseInt(option.tab) || 1;

        this.setData({
           tabIndex: tabIndex
        })

        getList(this, this.data.tabIndex);
    },

    onPullDownRefresh: function() {
        var current = this.data["tab" + this.data.tabIndex];
        var lasttid = current[current.length - 1].tid;

        getList(this, this.data.tabIndex, {
            "direc": "prev",
            "tid": lasttid
        });

        wx.stopPullDownRefresh();
    },

    onReachBottom: function() {
        if (this.data.loadingBottom) return;

        this.setData({
            loadingBottom: true
        });

        var current = this.data[this.data.leagues];
        var lasttid = current[current.length - 1].tid;

        getList(this, this.data.tabIndex, {
            "direc": "next",
            "tid": lasttid
        });
    }
});
