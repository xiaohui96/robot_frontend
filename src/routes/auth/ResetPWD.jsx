//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Card, Form, Input, Button, Divider, Alert, Popover, Progress } from 'antd';
import { Link } from 'react-router-dom';

//数据流
import AuthActions from 'actions/AuthActions';
import InfoActions from 'actions/InfoActions';
import authStore from 'stores/authStore';
import InfoStore from 'stores/InfoStore';

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

var passwordStatusMap;
if (languageType === 'en-US'){
  passwordStatusMap= {
    ok: <div className="success">Password strength：Strong</div>,
    pass: <div className="warning">Password strength：Okay</div>,
    pool: <div className="error">Password strength：Weak</div>,
  };
}
else {
  passwordStatusMap= {
    ok: <div className="success">强度：强</div>,
    pass: <div className="warning">强度：中</div>,
    pool: <div className="error">强度：太短</div>,
  };
}

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  pool: 'exception',
};
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
class ResetPWD extends Reflux.Component {
  constructor(props) {
    super(props);
    this.stores = [authStore,InfoStore];
      this.storeKeys = ['userFormData'];
    this.state = {
      submitting: false,
      errorHint: '',
      confirmDirty: false,
      visible: false,
      help: '',
      renderRedirect: false,
      count: 0,
      userFormData: {},
    }
  }

    componentDidMount() {
        InfoActions.Info.retrieve();
        this.loadLocales();
        LangConsistent();
    }

  componentWillUnmount() {
    AuthActions.ClearState();

  }

  handleSubmit = (e) => {
    const userId=this.state?.userFormData.id;
    console.log(userId);
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

        AuthActions.ResetPassword(formData, this.props.location.search,userId, callback)
      }
    });
  }

  validatePassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: intl.get('regist password tip 2'),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(intl.get('regist confirm password tip 3'));
    } else {
      callback();
    }
  }

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    let passwordStatus = 'pool';
    if( value ){
      if ( value.length > 9) {
        passwordStatus = 'ok';
      } else if (value.length > 5){
        passwordStatus = 'pass';
      }
    }
    return (
      <div style={{ padding: '4px 0' }}>
        {passwordStatusMap[passwordStatus]}
        {
          value && value.length ?
            <div className={`progress-${passwordStatus}`}>
              <Progress
                status={passwordProgressMap[passwordStatus]}
                className={"progress"}
                strokeWidth={6}
                percent={value.length * 10 > 100 ? 100 : value.length * 10}
                showInfo={false}
              />
            </div> : null
        }
        <div style={{ marginTop: 10 }}>{intl.get('password status tip')}</div>
      </div>
    )
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
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
    const { submitting, errorHint, help, visible, renderRedirect, count} = this.state;

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
                    <div className='tips'>
                      {intl.get('reset count',{countNum:count})}}
                    </div>
                    <Button size="large" type="primary" className="auth-form-button">
                      <Link to={langCN ? hrefloginCN : hrefloginEN}>{intl.get('reset link')}</Link>
                    </Button>
                  </>
                  :
                  <>
                    <Form onSubmit={this.handleSubmit} className="ant-forgotpwd-form">
                      <FormItem help={help}>
                        <Popover
                            content={this.renderPasswordProgress()}
                            overlayStyle={{ width: 240 }}
                            placement="right"
                            visible={visible}
                        >
                          {getFieldDecorator('password', {
                            rules: [{
                              validator: this.validatePassword,
                            }],
                          })(
                              <Input type="password" placeholder={intl.get('regist password tip')} />
                          )}
                        </Popover>
                      </FormItem>

                      <FormItem>
                        {getFieldDecorator('confirm', {
                          rules: [{
                            required: true,
                            message: intl.get('regist confirm password tip 2'),
                          }, {
                            validator: this.checkConfirm,
                          }],
                        })(
                            <Input type="password" placeholder={intl.get('regist confirm password tip')} onBlur={this.handleConfirmBlur}/>
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
                          {intl.get('resetpwd')}
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

export default ResetPWD;
