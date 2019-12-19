//依赖类
import React from 'react';
import Reflux from 'reflux';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';

import { Table, Card, Modal, Form, Spin, Switch, Input, InputNumber,Radio, Button, Badge, Tooltip, Upload,message, Icon} from 'antd';
import intl from 'react-intl-universal';

const Column = Table.Column;

class FullControlCopy extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store=appStore;
    }
    render(){
        const {plantInfo,queueInfo}=this.props;
        const user=Reflux.GlobalState.authStore.User;
        const {userList}=queueInfo;

        //console.log(userList);

        var count=0;
        var userString="";
        for(var i in queueInfo.currentUsers){
            if(queueInfo.currentUsers[i]!=0){
                count++;
                userString+='id'+queueInfo.currentUsers[i]+' ';
            }
        }

        return (
            <Card title={intl.get('test rig state')}>
                <div>{intl.get('total copy number',{copyNum:plantInfo.num})}{intl.get('available copy number',{availNum:plantInfo.num-count})}</div>
                {queueInfo?.userList?.length==0?(
                    <div></div>
                    ):(
                    <Table showHeader={true}
                    dataSource={queueInfo.userList}
                    rowKey="userId"
                    >
                        <Column title={intl.get('current user detail')}dataIndex="userId"/>
                        <Column title={intl.get('account info')} dataIndex="account"/>
                        <Column title={intl.get('request control time')}
                            render={(record) => {
                                const time=record.sessionTime*1000;
                                const date=new Date(time);
                                //date.toLocaleString() date.toString()
                                return(
                                    <div>
                                        {date.toLocaleString()}
                                    </div>
                                )
                        }}/>
                        <Column title={intl.get('copy number')}
                            render={(record) => {
                            return(
                                <div>
                                    {record.copyNum+1}
                                </div>
                            )
                        }}/>
                        <Column title={intl.get('copy time left')}
                            render={(record) => {
                                return(
                                    <div>
                                        {intl.get('waiting time content',{timeNum:Math.floor(record.timeLeft/60)})}
                                    </div>
                                )
                        }}/>


                    </Table>

                    )
                }
            </Card>
        );
    }
}

export default FullControlCopy;