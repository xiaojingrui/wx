//index.js
//获取应用实例
var api = require("../../utils/api");

function getNews(self, type, data = {}) {
    var param = {
        loadingBottom: false
    };
    var array = [];
    var string = type;

    api.getNews(type).bindParams(data).execute(function(res) {
        if (data.direc) {
            array = self.data[type].concat(res.data.result.data);
        } else {
            array = res.data.result.data;
        }
        param[string] = array;
        self.setData(param);
    });
};

const tabs = [{
    index: 0,
    en: "fifa",
    name: "国际",
}, {
    index: 1,
    en: "csl",
    name: "国内"
}]

Page({
    data: {
        tabIndex: 0,
        leagues: "fifa",
        tabs: tabs,
        csl: [],
        fifa: [],
        nid: 0,
        loadingBottom: false
    },
    onShareAppMessage: function(){
      return {
        title: `认真的虎扑足球`,
        desc : '认真的足球最有趣。',
        path: `/pages/index/index?tab=${this.data.tabIndex}`
      }
    },
    // 链接跳转
    linkTo: function(event) {
        wx.navigateTo({
            url: "../article/article?nid=" + event.currentTarget.dataset.nid + "&leagues=" + this.data.leagues
        });
    },

    // tab切换
    tabToggle: function(event) {
        var tabIndex = parseInt(event.target.dataset.tab);
        if (tabIndex != this.data.tabIndex) {
            var leagues = tabs[tabIndex].en;

            this.setData({
                tabIndex: tabIndex,
                leagues: leagues
            });

            getNews(this, leagues);
        }
    },
    onLoad: function(option) {
        var self = this;
        var tabIndex = parseInt(option.tab) || 0;
        var leagues = tabs[tabIndex].en;

        this.setData({
          tabIndex: tabIndex,
          leagues : leagues
        })

        getNews(this, leagues);
    },

    onPullDownRefresh: function() {
        var current = this.data[this.data.leagues];
        var lastnid = current[current.length - 1].nid;

        getNews(this, this.data.leagues, {
            "direc": "prev",
            "nid": lastnid
        });

        wx.stopPullDownRefresh();
    },

    onReachBottom: function() {
        if (this.data.loadingBottom) return;

        this.setData({
            loadingBottom: true
        });

        var current = this.data[this.data.leagues];
        var lastnid = current[current.length - 1].nid;

        getNews(this, this.data.leagues, {
            "direc": "next",
            "nid": lastnid
        });
    }
});
