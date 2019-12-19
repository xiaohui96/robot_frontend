//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Card, Form, Input, Button, Divider, Alert } from 'antd';
import { Link } from 'react-router-dom';

//数据流
import AuthActions from 'actions/AuthActions';
import authStore from 'stores/authStore';

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


@Form.create()
class ForgotPWD extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = authStore;
    this.state = {
      submitting: false,
      errorHint: '',
      renderRedirect: false,
    }
  }

  componentDidMount() {
    //语言
    this.loadLocales();
    LangConsistent();
  }

  componentWillUnmount() {
    AuthActions.ClearState();

  }

  handleSubmit = (e) => {
    this.setState({
      errorHint: ''
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

        AuthActions.ForgotPassword(formData, callback)
      }
    });
  }

  onEmailChange = () =>{
    this.setState({
      errorHint: ''
    })
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


  render() {
    const { getFieldDecorator } = this.props.form;
    const { submitting, errorHint, renderRedirect } = this.state;

    let langCN;
    if (languageType==='zh-CN'){
      langCN = true;
    }
    if (languageType==='en-US'){
      langCN = false;
    }
    const hrefloginCN="/login";//?lang=zh-CN
    const hrefloginEN="/login?lang=en-US";

    return (
        <div className="language-setting">
          {this.renderLocaleSelector() }
          <div className="auth-content">
            <Card className="auth-panel" >
              <h1 className="auth-title">
                <img src={logo} />
                <span>NCSLab</span>
              </h1>

              {
                renderRedirect ?
                  <>
                    <div style={{marginBottom: 16}}>
                      {intl.get('reset password tip')}
                    </div>

                    <Button size="large" type="primary" className="auth-form-button">
                      <Link to={langCN ? hrefloginCN : hrefloginEN}>{intl.get('reset link')}</Link>
                    </Button>
                  </>
                  :
                  <>
                    <div className="tips">
                      {intl.get('email for reset')}
                    </div>

                    <Form onSubmit={this.handleSubmit} className="ant-forgotpwd-form">
                        <FormItem>
                          {getFieldDecorator('email', {
                            rules: [{
                              required: true, message: intl.get('email tip'),
                            }, {
                              type: 'email', message: intl.get('email format tip'),
                            }],
                            validateTrigger: "onSubmit",
                          })(
                            <Input onChange={this.onEmailChange} placeholder={intl.get('email address')} />
                          )}
                        </FormItem>

                        {
                          errorHint &&
                            <Alert
                              className="regist-alert"
                              message={errorHint}
                              type="error"
                              showIcon
                            />
                        }

                        <FormItem>
                          <Button size="large" loading={submitting} type="primary" htmlType="submit" className="auth-form-button">
                            {intl.get('reset password')}
                          </Button>
                        </FormItem>
                    </Form>
                  </>
              }

              <Divider />
              <div className="auth-footer">Copyright © NCSLab</div>
            </Card>
          </div>
        </div>
    );
  }
}

export default ForgotPWD;
