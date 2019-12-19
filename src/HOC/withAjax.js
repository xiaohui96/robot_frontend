import ajax from 'utils/ajax';
import React from 'react';
import { Button, notification } from 'antd';

export default function withAjax( target ) {
  target.prototype.ajaxCall = ajax;

  target.prototype.apiCall = (url, param)=>{
    return new Promise( (resolve, reject)=> {
      ajax(url, param)
        .then( ( response ) => {
          try {
            const result = JSON.parse(response);
            if( result.retcode == 10000 ) {

              //HTTP通信正常，服务器处理正常
              resolve(result.data);
            } else {

              //HTTP通信正常，服务器处理正常，返回状态码异常，返回数据为json格式
              if(process.env.NODE_ENV == "development") {
                notification.warning({
                  message: `返回状态码异常：${result.retcode}`,
                  description: (
                    <div>
                      {`api请求：${url}`}<br />
                      {`状态描述：${result.describe}`}
                    </div>
                  )
                });
              }
              reject(result);
            }
          } catch {

            //HTTP通信正常，服务器处理异常，返回数据为DomString
            if(process.env.NODE_ENV == "development") {
              notification.error({
                message: `服务器处理异常`,
                description: `api请求：${url}`
              });
            }
            reject(response);
          }}, ([status, response]) =>{

            //HTTP通信异常，返回响应状态码及数据
            if(process.env.NODE_ENV == "development") {
              if( status != undefined ){
                const parser = new DOMParser();
                const doc = parser.parseFromString(response, "text/html");
                console.log(doc);
                notification.error({
                  message: `HTTP通信异常：${status}`,
                  description: `api请求：${url}`
                });
              } else {
                notification.error({
                  message: `HTTP通信超时`,
                  description: `api请求：${url}`
                });
              }
            }
            reject();
          }
        )
    });
  }
}
