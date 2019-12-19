//依赖类
import React from 'react';
import Reflux from 'reflux';

import { Tag,Button} from 'antd';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';

//语言
import intl from 'react-intl-universal';

class FullControlTag extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store=appStore;
        this.state={
            queueInfo:undefined
        }
        this.lastTime=0;
    }

    componentDidMount(){
        //this.timer = setInterval(this.onTimer,10000);
        this.lastTime=new Date().getTime();
        const {plantInfo,user}=this.props;
        AppActions.GetFullControlStatus(plantInfo,user,this.onGetFullControlStatus);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.plantInfo.id!=this.props.plantInfo.id){
            this.timer && clearTimeout(this.timer);
            AppActions.GetFullControlStatus(nextProps.plantInfo,nextProps.user,this.onGetFullControlStatus,this.onGetFullControlStatusFailed);
        }
    }

    onGetFullControlStatus=()=>{
        const {queueInfo}=this.state;
        const {onFullControlStatusChange}=this.props;
        //console.log(queueInfo);
        this.timer = setTimeout(this.onTimer,10000);
        onFullControlStatusChange(queueInfo);
    }

    onGetFullControlStatusFailed=()=> {
        //console.log("onGetFullControlStatusFailed");
        const {queueInfo}=this.state;
        const {onFullControlStatusChange}=this.props;
        this.timer = setTimeout(this.onTimer,2000);
        queueInfo.plantInfo.currentUser=0;
        onFullControlStatusChange(queueInfo);
    }

    onTimer=()=>{
        //console.log("timer");
        const {plantInfo,user}=this.props;


        if(window.location.pathname.match(plantInfo.path)==null){
            return;
        }

        //console.log(window.location.pathname);

        const timeNow=new Date().getTime();
        plantInfo.timeSlice=timeNow-this.lastTime;
        this.lastTime=timeNow;

        AppActions.GetFullControlStatus(plantInfo,user,this.onGetFullControlStatus,this.onGetFullControlStatusFailed);
    }

    onGetFullControl=()=>{
        const {plantInfo}=this.props;
        this.timer && clearTimeout(this.timer);
        AppActions.GetFullControlStatus(plantInfo,Reflux.GlobalState.authStore.User,this.onGetFullControlStatus);
    }

    onLoseFullControl=()=>{
        const {plantInfo}=this.props;
        this.timer && clearTimeout(this.timer);
        AppActions.GetFullControlStatus(plantInfo,Reflux.GlobalState.authStore.User,this.onGetFullControlStatus);
    }

    onFullControlRequest=()=>{
        //console.log("Full Control");
        const {plantInfo}=this.props;
        AppActions.GetFullControl(plantInfo,Reflux.GlobalState.authStore.User,this.onGetFullControl);
    }

    onFullControlWithdraw=()=>{
        const {plantInfo}=this.props;
        AppActions.WithdrawFullControl(plantInfo,Reflux.GlobalState.authStore.User,this.onLoseFullControl);
    }

    onFullControlCancel=()=>{
        const {plantInfo,user}=this.props;
        AppActions.CancelFullControl(plantInfo,user,this.onCancelledFullControl);
    }

    onCancelledFullControl=()=>{
        const {plantInfo,user}=this.props;
        this.timer && clearTimeout(this.timer);
        AppActions.GetFullControlStatus(plantInfo,user,this.onGetFullControlStatus);
    }

    renderNormal=()=>{
        const {plantInfo,user}=this.props;
        const {queueInfo}=this.state;
        if(queueInfo==undefined){
            return null;
        }

        if(queueInfo.userWaitingTime<0){
            queueInfo.userWaitingTime=0;
        }

        return (
            <span>
                {(()=>{
                    if(queueInfo.plantInfo.currentUser==0){
                        return (
                            <span>
                                <Tag color="green">{intl.get('test rig status')}</Tag>
                                {/*(queueInfo.userWaitingTime<=0&&queueInfo.queue.length>0)?
                                    <span>
                                    <Tag color="red">{intl.get('other occupied')}</Tag>
                                    <Tag color="red">{intl.get('apply for waiting in queue',{ timeNum: Math.floor(queueInfo.userWaitingTime/60)})}</Tag>
                                    </span>
                                    :null*/
                                    (()=>{
                                      if(queueInfo.userWaitingTime<=0){
                                          var isFound=false;
                                          for(var i in queueInfo.queue){
                                              if(queueInfo.queue[i].userId==user.id){
                                                  isFound=true;
                                                  break;
                                              }
                                          }

                                          if(isFound){
                                              return (
                                                  <span>
                                                    <Tag color="red">{intl.get('other occupied')}</Tag>
                                                    <Tag color="red">{intl.get('apply for waiting in queue',{ timeNum: Math.floor(queueInfo.userWaitingTime/60)})}</Tag>
                                                  </span>
                                              );
                                          }
                                      }
                                      return null;
                                    })()
                                }
                                <Tag color="#108ee9" onClick={this.onFullControlRequest}>{intl.get('apply for control')}</Tag>
                            </span>
                        );
                    }
                    if(queueInfo.plantInfo.currentUser==user.id){
                        return (
                            <span>
                                <Tag>{intl.get('time remain',{ timeNum: Math.floor(queueInfo.timeLeft/60)})}</Tag>
                                <Tag color="#108ee9" onClick={this.onFullControlWithdraw}>{intl.get('give up control')}</Tag>
                            </span>
                        );
                    }
                    if(queueInfo.plantInfo.currentUser!=user.id){
                        if(queueInfo.userWaitingTime==0){
                            return (
                                <span>
                                <Tag color="red">{intl.get('test rig occupied')}</Tag>
                                <Tag color="red">{intl.get('current user', { name: queueInfo.plantInfo.currentAccount})}</Tag>
                                <Tag color="green">{intl.get('if waiting',{ timeNum: Math.floor(queueInfo.totalWaitingTime/60)})}</Tag>
                                <Tag color="#108ee9" onClick={this.onFullControlRequest}>{intl.get('waiting in queue')}</Tag>
                            </span>
                            );
                        }
                        else{
                            return (
                                <span>
                                <Tag color="red">{intl.get('test rig occupied')}</Tag>
                                <Tag color="red">{intl.get('current user', { name: queueInfo.plantInfo.currentAccount})}</Tag>
                                <Tag color="blue">{intl.get('apply for waiting in queue',{ timeNum: Math.floor(queueInfo.userWaitingTime/60)})}</Tag>
                                <Tag color="#108ee9" onClick={this.onFullControlCancel}>{intl.get('quit queue')}</Tag>
                            </span>
                            );
                        }

                    }
                })()}
            </span>
        );
    }

    renderMulti=()=>{
        const {plantInfo,user}=this.props;
        const {queueInfo}=this.state;
        //console.log(queueInfo);
        if(queueInfo==undefined){
            return null;
        }
        //console.log(queueInfo);

        const {currentUsers}=queueInfo;
        //console.log(currentUsers);
        var count=0;
        for(var i in currentUsers){
            if(currentUsers[i]!=0){
                count++;
            }
        }

        return (
            <span>
                {(()=>{
                    //如果现在占有其中的一个副本
                    for(var i in currentUsers){
                        if(currentUsers[i]==user.id){
                            return(
                                <span>
                                        <Tag color="green">{intl.get('copy num', { plantNum: plantInfo.num })}{intl.get('occupied copy', { copyNum: parseInt(i)+1 })}</Tag>
                                        <Tag color="green">{intl.get('time remain',{ timeNum: Math.floor(queueInfo.timeLeft/60)})}</Tag>
                                        <Tag color="#108ee9" onClick={this.onFullControlWithdraw}>{intl.get('give up control')}</Tag>
                                    </span>
                            );
                        }
                    }

                    //如果有空闲设备
                    if(count<plantInfo.num){
                        return(
                            <span>
                                <Tag color="green">{intl.get('test rig status')}</Tag>
                                <Tag color="green">{intl.get('copy num', { plantNum: plantInfo.num })}{intl.get('copy status',{ availNum: plantInfo.num-count})}</Tag>
                                <Tag color="#108ee9" onClick={this.onFullControlRequest}>{intl.get('apply for control')}</Tag>
                            </span>
                        );
                    }
                })()
                }
            </span>);
    }

    render(){
        const {plantInfo}=this.props;
        if(plantInfo.type==1){
            return(this.renderMulti());
        }
        else{
            return(this.renderNormal());
        }

    }
}

export default FullControlTag;