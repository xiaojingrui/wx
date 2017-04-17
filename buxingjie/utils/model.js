const _ = require("./underscore.js")
const config = require( '../config.js' );

function obj2uri (obj) {
    return Object.keys(obj).map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
}

function Model(url, method = 'get'){
   this.url = this.addUrl(url)
   this.params = {
      offline: 'json',
      night: 0,
      nopic: 0,
      client: 'wechat'
   }
   this.header = {"Content-Type":"application/json"}
   this.method = method
}

Model.prototype = {
  addUrl: function( path ){
     if(!_.isString(path)) console.error("url is require.")
     return `${config.API_HOST}/1/7.0.18${path}`
  },
  bindParams: function( params = {}){
     if(!_.isObject(params)) return
     this.params = _.extend(this.params, params);

     return this
  },
  updateHeader: function( header = {}){
     if(!_.isObject(header)) return

     this.header = _.extend(this.header, header);

     return this
  },
  execute: function(success, fail){
     wx.request({
        url: this.url,
        method : this.method,
        data: this.params,
        header: this.header,
        success: function( res ) {
           if(res.statusCode == 200){
             success( res.data )
           } else{
             fail && fail( res.data )
           }
        }
    });
  }
}

module.exports = Model
