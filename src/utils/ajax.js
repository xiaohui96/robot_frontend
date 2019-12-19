export default function(url,{method="GET", async=true, requestData=null} = {}) {
  let promise = new Promise(function(resolve, reject){
    let xhr;
    if( window.XMLHttpRequest ){
      xhr = new XMLHttpRequest();
    }
    else if ( window.ActiveXObject ){
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhr.timeout = 5000;
    xhr.open(method,url,async);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.onreadystatechange = handler;
    xhr.send(JSON.stringify(requestData));
    function handler() {
      if( this.readyState === 4 ){
        if( this.status === 200 || this.status == 304 ) {
          resolve(this.response);
        } else {
          reject([this.status, this.response]);
        }
      }
    }
    xhr.ontimeout = function (e) {
      reject();
      console.error("ajax请求响应超时！");
    };
  })
  return promise;
}
