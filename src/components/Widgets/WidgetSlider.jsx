//依赖类
import React from 'react';
import Reflux from 'reflux';
import { Spin, Card, Slider, InputNumber, Form, Select, Modal, Input,Button } from 'antd';

//组件类
import {formItemLayoutInModal} from 'components/layout';
import TreeModal from './TreeModal';

import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';
import intl from 'react-intl-universal';


const FormItem = Form.Item;
const Option = Select.Option;

const DEFAULT_MIN=0;
const DEFAULT_MAX=100;

class WidgetSlider extends Reflux.Component {
  constructor(props){
    super(props);
    this.store = appStore;
    this.state = {
      modalVisible: false,
        selected: undefined
    };
      this.value=undefined;
      this.init=true;
  }

  onChange = (e)=>{
    if(this.props.monitor){
      //Actions
        this.value=e;
    }
    // console.log(e);
  }

  onEdit = (e)=>{
    if(this.props.monitor == false){
      this.setState({
        modalVisible: true
      })
    }
  }

  hideModal = () => {
    this.setState({
      modalVisible: false
    })
  }

    onSelected=(signalPara)=>{
        const {onParamsConfig,keyValue}=this.props;
        onParamsConfig({
            params:signalPara,
            key:keyValue
        });
        this.setState({
            selected:signalPara
        });
    }

    getCurrentValue=()=>{
        const { params, keyValue, monitor, signalParaList,dataPool } = this.props;
        //console.log(params.pos);
        if(params){
            return dataPool.getCurrentValueByPos(params.pos);
        }
        else{
            return '';
        }
    }

    onSubmit=(e)=>{
        const {params,plantInfo}=this.props;
        if(this.value!=undefined){
            console.log(this.value,params.pos);
            AppActions.SetParam(plantInfo,this.value,params.pos);
        }
    }

  render(){
    const { modalVisible} = this.state;
    const { params, keyValue, monitor, signalParaList,dataPool,isFullControl} = this.props;
    // const title = monitor ? params?.title : "滑动输入";
    // const marks = params && {[params.min]: params.min, [params.max]: params.max};

      const title=monitor?(params&&params.sig?params.sig.name:intl.get('slider'))+':'+this.getCurrentValue():(params&&params.sig?params.sig.name:intl.get('slider'));
      const defaultValue=monitor?this.getCurrentValue():'';
      if(this.init&&defaultValue!=''){
          this.init=false;
          this.value=defaultValue;
      }
    return (
      <Card title={title || " "} onDoubleClick={this.onEdit}>
        <Slider
          // marks={marks}
          min={params?.min}
          max={params?.max}
          step={0.1}
          onChange={this.onChange}
          style={{width:"90%"}}
          value={this.value}
        />
        <Button type="primary" shape="circle" icon="download" onClick={this.onSubmit} disabled={!isFullControl&&monitor} />
        <WidgetModal signalParaList={signalParaList} visible={modalVisible} hideModal={this.hideModal} keyValue={keyValue} params={params} onParamsConfig={this.props.onParamsConfig}/>
      </Card>
    )
  }
}

@Form.create()
class WidgetModal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        treeVisible:false,
        selected:props.params
    }
  }

  handleSubmit = (e) => {
      const {selected}=this.state;
    e.preventDefault();

    this.props.form.validateFields((err, formData) => {
      if (!err) {
          selected.min=formData.min;
          selected.max=formData.max;
        this.props.onParamsConfig({
          key: this.props.keyValue,
          params:this.state.selected
        });
        this.props.hideModal();
      }
    });
  }
    onSignalParaSelected=(signalPara)=>{
        //const {onSelected}=this.props;
        // console.log(signalPara);
        //onSelected(signalPara);
        signalPara.max=DEFAULT_MAX;
        signalPara.min=DEFAULT_MIN
        this.setState({
            treeVisible:false,
            selected:signalPara
        });
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, params,signalParaList } = this.props;
    const {treeVisible,selected}=this.state;

    //console.log(selected);

    return (
      <div onMouseDown={ e => e.stopPropagation() }>
        <Modal
          visible={visible}
          title={intl.get('parameter config')}
          onOk={this.handleSubmit}
          onCancel={this.props.hideModal}
          afterClose={this.props.form.resetFields}
          okText={intl.get('ok')}
          cancelText={intl.get('cancel')}
        >
          <Form layout="horizontal" hideRequiredMark>
            <FormItem label={intl.get('name')} {...formItemLayoutInModal}>

              <Input value={selected?.sig?.name}  readOnly />
            </FormItem>

            <FormItem label={intl.get('path')} {...formItemLayoutInModal}>
              <Input value={selected?.sig?.path} readOnly />
            </FormItem>

              <FormItem label={intl.get('upper limit')} {...formItemLayoutInModal}>
                  {getFieldDecorator('max', {
                      initialValue: params?.max || DEFAULT_MAX
                  })(
                      <InputNumber />
                      )}
              </FormItem>

              <FormItem label={intl.get('lower limit')} {...formItemLayoutInModal}>
                  {getFieldDecorator('min', {
                      initialValue: params?.min || DEFAULT_MIN
                  })(
                      <InputNumber />
                      )}
              </FormItem>

          </Form>
          <Button onClick={()=>{this.setState({treeVisible:true})}}>{intl.get('select params')}</Button>
          <TreeModal
              visible={treeVisible}
              hideModal={()=>{this.setState({treeVisible:false})}}
              signalParaList={signalParaList}
              paraOnly={true}
              onSignalParaSelected={this.onSignalParaSelected}
          />
        </Modal>
      </div>
    )
  }
}

export default WidgetSlider;
