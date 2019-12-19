//依赖类
import React from 'react';
import Reflux from 'reflux';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';

import { Table, Card, Modal, Form, Spin, Switch, Input, InputNumber,Radio, Button, Badge, Tooltip, Upload,message, Icon} from 'antd';

//语言
import intl from 'react-intl-universal';

const Column = Table.Column;

class FullControl extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store=appStore;
    }

    showQueue=()=>{
        const {queueInfo}=this.state;
        const user=Reflux.GlobalState.authStore.User;
        //console.log(queueInfo.queue);
        return (
            <Card title={intl.get('queue info')}>
                {queueInfo?.queue?.length==0?(
                    <p>{intl.get('no user in queue')}</p>
                ):(
                    <Table showHeader={true}
                           dataSource={queueInfo.queue}
                           rowKey="id"
                    >

                        <Column title={intl.get('account')} dataIndex="account"/>
                        <Column
                            title={intl.get('request control time')}
                            render={(record) => {
                                const time=record.requestTime*1000;
                                const date=new Date(time);
                                return(
                                    <div>
                                        {date.toLocaleString()}
                                    </div>
                                )
                            }}
                        />
                        <Column
                            title={intl.get('waiting time')}
                            render={(record) => {
                                return(
                                    <div>
                                        {intl.get('waiting time content',{timeNum:Math.floor(record.waitingTime/60)})}
                                    </div>
                                )
                            }}
                        />
                        <Column
                            title={intl.get('operation')}
                            render={(record)=>{
                                if(record.userId==user.id){
                                    return(
                                        <Tooltip title={intl.get('quit queue')}><Icon  type="logout" onClick={()=>{this.onFullControlCancel(user.id)}} /></Tooltip>
                                    );
                                }
                                else{
                                    return null;
                                }

                            }}
                        />


                    </Table>

                )
                }
            </Card>
        );
    }

    showStatus=()=>{
        const {queueInfo}=this.state;
        const {plantInfo}=this.props;
        const user=Reflux.GlobalState.authStore.User;
        if(user.id==queueInfo.plantInfo.currentUser){
            return (
                <div>
                    <p>{intl.get('time left',{timeNum:Math.floor(queueInfo.timeLeft/60)})}</p>
                </div>
            );
        }
        return (
            <div>
                <p>{intl.get('current state')}{queueInfo.plantInfo.currentUser==0 ? intl.get('current state info 1') : intl.get('current state info 2')}</p>

            </div>
        );
    }

    onGetFullControl=()=>{
        const {plantInfo}=this.props;
        this.timer && clearTimeout(this.timer);
        AppActions.GetFullControlStatus(plantInfo,Reflux.GlobalState.authStore.User);
    }

    onLoseFullControl=()=>{
        const {plantInfo}=this.props;
        this.timer && clearTimeout(this.timer);
        AppActions.GetFullControlStatus(plantInfo,Reflux.GlobalState.authStore.User);
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

    onFullControlCancel=(id)=>{
        const {plantInfo}=this.props;
        AppActions.CancelFullControl(plantInfo,{id:id},this.onCancelledFullControl);
    }

    onCancelledFullControl=()=>{
        const {plantInfo,user}=this.props;
        this.timer && clearTimeout(this.timer);
        AppActions.GetFullControlStatus(plantInfo,user);
    }

    render(){
        const {queueInfo}=this.state;
        const {plantInfo}=this.props;
        const user=Reflux.GlobalState.authStore.User;

        //console.log(queueInfo);
        if(!queueInfo){
            return (
                <Spin></Spin>
            )
        }
        return (
            <Card title={intl.get('test rig state')}>
                {this.showStatus()}
                {this.showQueue()}
                {(()=>{
                    if(queueInfo.plantInfo.currentUser==user.id){
                        return (<Button onClick={this.onFullControlWithdraw}>{intl.get('give up control')}</Button>);
                    }
                    else{
                        return (<Button onClick={this.onFullControlRequest}>{intl.get('apply for control')}</Button>);
                    }

                })()}
            </Card>
        );
    }
}

export default FullControl;