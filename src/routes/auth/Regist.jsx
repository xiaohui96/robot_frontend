//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Card, Form, Input, Button, Divider, Alert, Row, Col, Progress, Popover } from 'antd';
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
class Regist extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = authStore;
    this.state = {
      count: 0,
      submitting: false,
      confirmDirty: false,
      visible: false,
      help: '',
      errorHint: '',
    }
  }

  componentDidMount() {
    //语言
    this.loadLocales();
  }

  componentWillUnmount() {
    AuthActions.ClearState();
    LangConsistent();
  }

  handleSubmit = (e) => {
    this.setState({
      errorHint: ''
    })
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, formData) => {
      if (!err) {
        this.setState({
          submitting: true
        })

        const callback = ()=> {
          this.setState({
            submitting: false
          });
        };

        const {confirm, ...registFormData} = formData;
        AuthActions.Regist(registFormData, callback)
      }
    });
  }

  onGetCaptcha = () => {
    const { form } = this.props;
    form.validateFields(['email'], { force: true }, (errors, email)=>{
      if( !errors ){
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          if (this.state.count === 0) {
            clearInterval(this.interval);
          } else {
            this.setState((prevState) => ({
              count: prevState.count - 1
            }));
          }
        }, 1000);
        AuthActions.RegistCaptcha(email);
      }
    });
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

  validateAccount = (rule, value, callback) => {
    if ( value && ! /^\w{5,20}$/.test(value) ){
      callback(intl.get('regist account tip 2'));
    } else {
      callback();
    }
  }


    validateRealname = (rule, value, callback) => {
    //4-8个英文字符（含空格）或者2-4个汉字，^开头，$结尾
        if ( value && ! /^[ a-zA-Z]{3,20}$|^[\u4e00-\u9fa5]{2,4}$/.test(value) ){
            callback(intl.get('real name tip 2'));
        } else {
            callback();
        }
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

  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  onFormChange = ()=>{
      this.setState({
        errorHint: '',
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
    const { submitting, count, visible, help, errorHint } = this.state;

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
                <span>Robot</span>
              </h1>

              <Form onSubmit={this.handleSubmit} onChange={this.onFormChange} className="ant-regist-form">
                <FormItem>
                  {getFieldDecorator('account', {
                    rules: [{
                      required: true,
                      message: intl.get('regist account tip 3'),
                    }, {
                      validator: this.validateAccount
                        // 自定义校验（注意，callback 必须被调用）
                    }],
                    validateTrigger: "onBlur",
                  })(
                    <Input placeholder={intl.get('regist account tip')} />
                  )}
                </FormItem>

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

                {/*添加"真实姓名"*/}
                <FormItem>
                    {getFieldDecorator('realname', {
                        rules: [{
                            required: true,
                            message: intl.get('real name tip'),
                        }, {
                            validator: this.validateRealname
                        }],
                        validateTrigger: "onBlur",
                    })(
                        <Input placeholder={intl.get('real name')} />
                    )}
                </FormItem>




                <FormItem>
                  {getFieldDecorator('email', {
                    rules: [{
                      required: true, message: intl.get('regist email tip'),
                    }, {
                      type: 'email', message: intl.get('email format tip'),
                    }],
                    validateTrigger: "onBlur",
                  })(
                    <Input placeholder={intl.get('regist email')} />
                  )}
                </FormItem>

                <FormItem>
                  <Row gutter={8}>
                    <Col span={16}>
                      {getFieldDecorator('captcha', {
                        rules: [{
                          required: true, message: intl.get('verification code tip'),
                        }],
                      })(
                        <Input placeholder={intl.get('verification code')} />
                      )}
                    </Col>
                    <Col span={8}>
                      <Button
                        disabled={count}
                        className="getCaptcha"
                        onClick={this.onGetCaptcha}
                      >
                        {count ? `${count} s` : intl.get('get the verification code')}
                      </Button>
                    </Col>
                  </Row>
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
                    {intl.get('regist')}
                  </Button>
                </FormItem>
                <div className="auth-href-login">
                  <Link to={langCN ? hrefloginCN : hrefloginEN}>{intl.get('regist account exist tip')}</Link>
                </div>
              </Form>
              <Divider />
              <div className="auth-footer">Copyright © Robot</div>
            </Card>
          </div>
        </div>
    );
  }
}

export default Regist;
