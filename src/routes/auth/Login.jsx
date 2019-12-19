//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Card, Form, Input, Button, Divider, Alert } from 'antd';
import { Link } from 'react-router-dom';

//数据流
import AuthActions from 'actions/AuthActions';
import authStore from 'stores/authStore';

//组件类
import Icon from 'components/Icon';

//资源类
import logo from 'images/logo.png';

import  './Auth.less';

//语言国际化
import intl from 'react-intl-universal';
import http from "axios";
import _ from "lodash";
//import "../../index/less/language.css"
import qs from 'qs';
import LangConsistent from "routes/LangConsistent";

const languageType = qs.parse(window.location.search.slice(1)).lang;
const language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
const FormItem = Form.Item;



const SUPPOER_LOCALES = [
  {
    name: '简体中文',
    value: 'zh-CN'
  },
  {
    name: 'English',
    value: 'en-US'
  }
];

//
// if (languageType == undefined||languageType == 'lang=en-US') {
//   window.location.search = `?lang=en-US`;
// }

@Form.create()
class Login extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = authStore;
    this.onSelectLocale = this.onSelectLocale.bind(this);
    this.state = {
      loginFailed: false,
      submitting: false,
        initDone: false
    }
  }

  componentDidMount() {

     LangConsistent();

    this.loadLocales();
  }

  // componentWillMount() {
  //   //语言
  //   //  window.location.reload(true);
  //   //this.loadLocales();
  //
  // }
  componentWillUnmount() {
    AuthActions.ClearState();
    // LangConsistent();
  }

  loadLocales() {
    let currentLocale = intl.determineLocale({
      urlLocaleKey: "lang",
      cookieLocaleKey: "lang"
    });
    if (!_.find(SUPPOER_LOCALES, {value: currentLocale})) {
      currentLocale = "zh-CN";
    }

    http
        .get(`../locales/${currentLocale}.json`)//"../index/less/nav.css"
        .then(res => {
          //   console.log("App locale data", res.data);
          // init method will load CLDR locale data according to currentLocale
          return intl.init({
            currentLocale,
            locales: {
              [currentLocale]: res.data
            }
          });
        })
        .then(() => {
          // After loading CLDR locale data, start to render
          this.setState({initDone: true});
        });
  }

  renderLocaleSelector = () => {
    return (<div className="langSel">
                <select onChange={this.onSelectLocale}  className="language">
                    {SUPPOER_LOCALES.map(locale => {
                      //selected选中的永远为URL中的languageType，返回此option
                      if (locale.value === languageType) {
                        return <option key={locale.value} value={locale.value} selected="selected" >{locale.name}</option>
                      }
                      //返回其他option
                      return <option key={locale.value} value={locale.value}>{locale.name}</option>;
                    })}
                </select>
            </div>
    );
  }

  onSelectLocale(e){
    //var ind =document.getElementsByClassName("language").selectedIndex;
    let lang = e.target.value;
    window.location.search = `?lang=${lang}`;
    //window.location.reload(true);
  }

  handleSubmit = (e) => {
    this.setState({
      loginFailed: false,
    })
    e.preventDefault();
    this.props.form.validateFields((err, formData) => {
      if (!err) {
        this.setState({
          submitting: true
        })

        const callback = ()=> {
          this.setState({
            submitting: false
          });
        };

        AuthActions.Login(formData, callback)
      }
    });
  }


  validateAccount = (rule, value, callback) => {
    if (value && !/^\w{5,20}$/.test(value) ) {
      callback(intl.get('username requirement'));
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { submitting, loginFailed } = this.state;

    const languageType = qs.parse(window.location.search.slice(1)).lang;
    let langCN;
    if (languageType==='zh-CN'){
      langCN = true;
    }
    if (languageType==='en-US'){
      langCN = false;
    }
    const hrefpwdCN="/forgotpwd";//?lang=zh-CN
    const hrefpwdEN="/forgotpwd?lang=en-US";//?lang=zh-CN
    const hrefregCN="/regist";
    const hrefregEN="/regist?lang=en-US";

    // window.location.reload(true);
    return (
      <div className="language-setting">
        {this.renderLocaleSelector() }
      <div className="auth-content">

        <Card className="auth-panel" >
          <h1 className="auth-title">
            <span>Robot</span>
          </h1>

          <Form onSubmit={this.handleSubmit} className="auth-login-form">
            <FormItem>
              {getFieldDecorator('account', {
                rules: [{
                  required: true,
                  message: intl.get('username tip')
                },{
                  validator: this.validateAccount,
                }],
                validateTrigger: "onSubmit",
              })(
                <Input prefix={<Icon iconid="account"/>} placeholder="Username" />
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('password', {
                rules: [{
                  required: true,
                  message: intl.get('password tip')
                }],
                validateTrigger: "onSubmit",
              })(
                <Input prefix={<Icon iconid="password" />} type="password" placeholder="Password" />
              )}
            </FormItem>

            {
              loginFailed &&
              <Alert
                message={intl.get('wrong message')}
                type="error"
                showIcon
              />
            }

            <FormItem>

              <Link className="auth-href-forgot" to={langCN ? hrefpwdCN : hrefpwdEN}>{intl.get('forgot password')}</Link>
              <Link className="auth-href-regist" to={langCN ? hrefregCN : hrefregEN}>{intl.get('create account')}</Link>
              <Button size="large" loading={submitting} type="primary" htmlType="submit" className="auth-form-button">
                {intl.get('login')}
              </Button>
            </FormItem>
          </Form>
          <Divider />
          <div className="auth-footer">Copyright © Robot</div>
        </Card>
      </div>
      </div>
    );
  }
}

export default Login;
