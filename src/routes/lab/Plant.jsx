//依赖类
import React from 'react';
import Reflux from 'reflux';

import { Card, Divider,Tabs,Spin} from 'antd';

import DocActions from 'actions/DocActions';
import docStore from 'stores/docStore';

//import { PDFReader } from 'react-read-pdf';
import FileViewer from 'react-file-viewer';

import FullControl from 'routes/lab/FullControl';
import FullControlCopy from 'routes/lab/FullControlCopy';

//语言选项
import qs from "qs";

const languageType = qs.parse(window.location.search.slice(1)).lang;
import intl from 'react-intl-universal';

const { TabPane } = Tabs;


class Plant extends Reflux.Component {
    constructor(props) {
        super(props);
        this.state={
            fileViewerEnabled:true,
            docList:undefined
        };
        this.store=docStore;
    }

    componentDidMount() {
        const {plantInfo}=this.props;

        DocActions.GetDocList(plantInfo);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.plantInfo.path!=nextProps.plantInfo.path){
            this.setState({
                fileViewerEnabled:false
            });
            setTimeout(()=>{
                DocActions.GetDocList(nextProps.plantInfo);
                this.setState({
                    fileViewerEnabled:true
                });
            },1000)
        }
    }

    render(){
        const {plantInfo,queueInfo,user}=this.props;
        const {fileViewerEnabled,docList}=this.state;
        //console.log(plantInfo);

        if (languageType == 'zh-CN'){
            //var filepath = '../../pdf.js/web/viewer.html?file=../../Doc/'+plantInfo.model+'.pdf';
            var filepath = 'https://www.powersim.whu.edu.cn/Doc/'+plantInfo.model+'.pdf';
            var type = 'pdf';
        }
        else {
            //var filepath = '../../pdf.js/web/viewer.html?file=../../Doc/'+plantInfo.model+'.pdf';
            var filepath = 'https://www.powersim.whu.edu.cn/Doc/'+plantInfo.model+'.pdf';
            var type = 'pdf';
        }


        if (!docList) {
            return (
                <Spin className="loading-plant-info" size="large"/>
            );
        }

        return (
            <div>
            {
            (()=>{
                if(plantInfo.type==1){
                    return <FullControlCopy plantInfo={plantInfo} queueInfo={queueInfo} user={user}/>;
                }
                else{
                    return (
                        <FullControl plantInfo={plantInfo} queueInfo={queueInfo} user={user}/>
                    );
                }
            })()
            }
                <Divider/>
                {
                    fileViewerEnabled?
                    <Tabs defaultActiveKey="1">
                        <TabPane tab={intl.get('introduction')} key="1">
                            <Card title={intl.get('introduction')}>
                                <div style={{textAlign:"center"}}>
                                    <iframe height="1172px" width="100%" src={filepath}></iframe>
                                </div>
                            </Card>
                        </TabPane>
                        {
                            docList.map((item)=>{
                                if (languageType == 'zh-CN'){
                                    //var filepath = '../../pdf.js/web/viewer.html?file=../../Doc/'+item.docCN+'.pdf';
                                    var filepath = 'https://www.powersim.whu.edu.cn/Doc/'+item.docCN+'.pdf';
                                    var type = 'pdf';
                                    var name=item.nameCN;
                                }
                                else{
                                    //var filepath = '../../pdf.js/web/viewer.html?file=../../Doc/'+item.docEN+'.pdf';
                                    var filepath = 'https://www.powersim.whu.edu.cn/Doc/'+item.docCN+'.pdf';
                                    var type = 'pdf';
                                    var name=item.nameEN;
                                }

                                return (
                                    <TabPane tab={name} key={item.id+10}>
                                        <Card title={name}>
                                            <div style={{textAlign: "center"}}>
                                                <iframe height="1172px" width="100%" src={filepath}></iframe>
                                            </div>
                                        </Card>
                                    </TabPane>
                                );
                            })
                        }
                    </Tabs>:null
                }

                <Divider/>

            </div>
        );

    }
}

export default Plant;
