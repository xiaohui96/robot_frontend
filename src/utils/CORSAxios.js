import { notification } from 'antd';
import React from 'react';
import axios from 'axios';
import history from 'utils/history';
//数据流
import AuthActions from 'actions/AuthActions';

import './axios.less';

var instance = axios.create({
    baseURL: '',
    timeout: 5000,
    withCredentials:true
});

instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
}, function (error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status == 401) {
            history.push('/login');
            AuthActions.Logout();
        }
        notification.open({
            className: 'warning',
            message: `响应异常：${error.response.status} (${error.response.statusText})`,
            description: (
                <div>
                    <div>{`api请求路由：${error.config.url}`}</div>
                    <div>{error.response.data.message}</div>
                </div>
            )
        });
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        notification.open({
            className: 'warning',
            message: `服务器未响应`,
            description: (
                <div>
                    <div>{`api请求路由：${error.config.url}`}</div>
                    <div>{`请求参数：`}</div>
                    <pre>{JSON.stringify(error.request,null, 2)}</pre>
                </div>
            )
        });
    } else {
        // Something happened in setting up the request that triggered an Error
        notification.open({
            className: 'error',
            message: `请求发送异常`,
            description: (
                <div>
                    <div>{`api请求路由：${error.config.url}`}</div>
                    <div>{`描述：${error.message}`}</div>
                    <div>{error.stack}</div>
                </div>
            )
        });
    }
    // Do something with response error
    return Promise.reject(error);
});

export default instance;