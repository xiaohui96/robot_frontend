import React from 'react';
import ReactDom from 'react-dom';
import { Router, Route, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import history from 'utils/history';

//路由页面
import App from 'routes/App';
import Login from 'routes/auth/Login';
import Regist from 'routes/auth/Regist';
import ForgotPWD from 'routes/auth/ForgotPWD';
import ResetPWD from 'routes/auth/ResetPWD';

//整个系统的根

ReactDom.render(
    <LocaleProvider locale={zhCN}>
        <Router history={history}>
            <Switch>
                <Route path="/login" component={Login} />  {/*登录界面*/}
                <Route path="/regist" component={Regist} />  {/*注册界面*/}
                <Route path="/forgotpwd" component={ForgotPWD} />
                <Route path="/resetpwd" component={ResetPWD} />
                <Route component={App} /> {/*主界面*/}
            </Switch>
        </Router>
    </LocaleProvider>
    ,document.querySelector("#root"));
