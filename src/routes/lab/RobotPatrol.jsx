//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Table, Card, Modal, Form, Select, Switch, Input, InputNumber,Radio, Button,Progress, Badge, Tooltip, Upload,message, Icon as OldIcon} from 'antd';
import './RobotPatrol.less';

//数据流
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';
//import algorithmsStore from 'stores/algorithmsStore';
import alarmStore from 'stores/alarmStore';


//组件类
import Icon from 'components/Icon';
import {formItemLayoutInModal} from 'components/layout';

//HOC
import withModal from 'HOC/withModal';

//语言
import intl from 'react-intl-universal';
import axios from "utils/axios";
import {camera} from "routes/userinfo/camera";

// import './Algorithm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Column = Table.Column;
const confirm = Modal.confirm;

class RobotPatrol extends Reflux.Component {
    constructor(props) {
        super(props);
        this.stores =[
            appStore,
            alarmStore
        ];
        this.storeKeys = ['alarmList'];
        this.state = {
           alarmList: [],
        }
        //console.log(this.props)
    }
    componentDidMount() {
        AppActions.Alarm.retrieve(()=>{
        });

    }

    hideModal = () => {
        this.setState({
            progressVisible: false
        })
    }


    render() {
        const {alarmList} = this.state;
        const User=Reflux.GlobalState.authStore.User;
        //console.log(lastErrorAlgorithmId);
        return (
            <div>
                {/*实验报告的表格*/}
                <Card title={intl.get('device alarm information')}>
                    <Button type="primary" className="add-new" onClick={()=>camera.getMedia()  }>
                        {intl.get('open map')}
                    </Button>
                    <Button type="primary" className="add-new" onClick={()=>camera.takePhoto()  }>
                        {intl.get('open video')}
                    </Button>
                    <video id="video" width="300px" height="300px" autoPlay="autoplay">
                    </video>
                    <canvas id="canvas" width="600px" height="400px">
                    </canvas>
                    <Table
                        showHeader={true}
                        dataSource={alarmList}
                        onRow={(record) => {
                            return {
                                //onDoubleClick: () => this.props.onEdit(record),
                            };
                        }}
                        rowKey="id"
                    >
                        <Column title={intl.get('id')} dataIndex="id"/>
                        <Column title={intl.get('stationId')} dataIndex="stationId" />
                        <Column title={intl.get('deviceId')} dataIndex="deviceId" />
                        <Column title={intl.get('alarmType')} dataIndex="alarmType" />
                        <Column title={intl.get('alarmLevel')} dataIndex="alarmLevel" />
                        <Column title={intl.get('alarmTime')} dataIndex="alarmTime" />
                        <Column title={intl.get('alarmDescription')} dataIndex="alarmDescription" />
                        <Column title={intl.get('verified')} dataIndex="verified" />
                    </Table>
                </Card>

            </div>
        )
    }
}
export default RobotPatrol;

