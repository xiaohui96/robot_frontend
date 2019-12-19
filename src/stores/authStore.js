import Reflux from 'reflux';
import {hex_md5} from 'utils/md5';
import { message } from 'antd';
import axios from 'utils/axios';
import history from 'utils/history';

//Actions
import AuthActions from 'actions/AuthActions';

import intl from 'react-intl-universal';
import React from "react";
import qs from "qs";

const languageType = qs.parse(window.location.search.slice(1)).lang;
let langCN;
if (languageType==='zh-CN'){
    langCN = true;
}
if (languageType==='en-US'){
    langCN = false;
}


class AuthStore extends Reflux.Store {
  constructor() {
    super();
    this.listenables = AuthActions;
    this.state = {
      loginFailed: false,
      User: undefined,
    }
  }

  onLogin( formData, callback ) {
      console.log("登陆");
      console.log(formData);
    formData.password = hex_md5(formData.password);

    axios.post("/login", formData)
      .then( (response) => {
        if( response.code == 100 ) {
          this.setState({
            User: response.data
          })
          history.push('/lab');
        } else {
          this.setState({
            loginFailed: true
          })
          callback?.();
        }
      })
      .catch( (error) => {
        callback?.();
      });


  }

    onLoginMobile( formData, callback,callbackFailed ) {
        formData.password = hex_md5(formData.password);
        axios.post("/login", formData)
            .then( (response) => {
                if( response.code == 100 ) {
                    this.setState({
                        User: response.data
                    });
                    callback?.(response.data);
                    //history.push('/m/lab');
                } else {
                    this.setState({
                        loginFailed: true
                    })
                    callbackFailed?.();
                }
            })
            .catch( (error) => {
                callbackFailed?.();
            })
    }

  onRegist( formData, callback ) {
    formData.password = hex_md5(formData.password);
    axios.post("/regist", formData)
      .then( (response) => {
        if( response.code == 100 ) {
          message.success(intl.get('regist success'));
          this.setState({
            User: response.data,
            errorHint: ''
          })
          history.push('/lab');
        } else {
          this.setState({
              //if(languageType === 'en-US'){
                  errorHint:langCN ? response.messageCN : response.messageEN

          })
          callback?.();
        }
      })
      .catch( (error) => {
        if( error.response.data.code == 300){
          this.setState({
            errorHint: intl.get('regist fail')
          })
        }
        callback?.();
      })
  }

  onRegistCaptcha(email) {
    axios.post("/registcaptcha", email)
      .then( (response) => {
        if( response.code == 100 ) {
          message.success(intl.get('email success'));
        }
      })
      .catch( (error) => {
        this.setState({ count : 0 });
        message.warning(intl.get('email fail'));
      })
  }

  onVerifyLogin(callback) {
    axios.get("/verifyLogin")
      .then( (response) => {
        this.setState({
          User: response.data
        });
        callback?.();
      })
      .catch( (error) => {
        //如果没有正常登录，就要退出到登录界面
        if( error.response.status == 401){
          history.push('/login');
        }
      })
  }

    onVerifyLoginMobile(callback) {
        axios.get("/verifyLogin")
            .then( (response) => {
                this.setState({
                    User: response.data
                });
                callback?.();
            })
            .catch( (error) => {

            })
    }

  onLogout(){
    axios.get("/logout")
      .then( (response) => {
        this.setState({
          User: undefined
        })
        history.push('/login');
      })
  }

    onLogoutMobile(){
        axios.get("/logout")
            .then( (response) => {
                this.setState({
                    User: undefined
                })
            })
    }

  onForgotPassword(email, callback){
    axios.post("/forgotpwd", email)
      .then( (response) => {
        if( response.code == 100 ) {
          this.setState({
            renderRedirect: true,
          });
        } else if ( response.code == 200 ) {
          this.setState({
            errorHint :  intl.get('wrong email')
          });
        }
      })
      .catch( (error)=>{
        if( error.response.data?.code == 300){
          this.setState({
            errorHint : intl.get('email fail')
          });
        }
      })
      .finally(()=>{
        callback?.();
      })
  }

  onResetPassword(formData, search,id ,callback){
    const password = hex_md5(formData.password);
    axios.post(`/resetpwd${search}`,
        {password:password,
            id:id,
        })
      .then( (response) => {
        if( response.code == 100 ) {
          this.setState({
            renderRedirect: true,
            count: 5,
          });
          this.interval = setInterval(() => {
            if (this.state.count === 0) {
              clearInterval(this.interval);
              history.push('/login')
            } else {
              this.setState({
                count: this.state.count - 1
              });
            }
          }, 1000);
        } else if ( response.code == 200 ) {
          this.setState({
            errorHint : intl.get('invalid reset link')
          });
        } else if ( response.code == 201 ) {
          this.setState({
            errorHint : intl.get('reset link fail')
          });
        }
      })
      .finally(()=>{
        callback?.();
      })
  }

  onClearState(){
    this.setState({
      errorHint: '',
      count: 0,
      renderRedirect: false,
    })
  }

}

AuthStore.id = "authStore";

export default AuthStore;
