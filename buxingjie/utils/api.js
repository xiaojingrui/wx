var Model = require("./model.js")

function createRequest(url, method){
  return new Model(url, method)
}

module.exports = {
    getList: function(){
        return createRequest(`/forums/getForumsInfoList`)
    },
    getBBSArticle: function(){
        return createRequest(`/threads/getsThreadInfo`)
    },
    getBBSLight: function(){
        return createRequest(`/threads/getsThreadLightReplyList`)
    },
    getBBSReply: function(){
        return createRequest(`/threads/getsThreadPostList`)
    }
}
