var Model = require("./model.js")

function createRequest(url, method){
  return new Model(url, method)
}

module.exports = {
    getNews: function(leagues = 'csl'){
        return createRequest(`/${leagues}/getNews`)
    },
    // 获取内容页数据
    getFifaNews: function() {
        return createRequest(this.getNews('fifa'))
    },
    getCslNews: function() {
        return createRequest(this.getNews('csl'))
    },
    getNewsArticle: function(){
        return createRequest(`/news/createNewsDetailH5`)
    },
    getNewsLight: function(){
        return createRequest(`/news/getLightComment`)
    },
    getNewsReply: function(){
        return createRequest(`/news/getCommentH5`)
    }
}
