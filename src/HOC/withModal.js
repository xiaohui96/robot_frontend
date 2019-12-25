import React from 'react';
import { Modal } from 'antd';

export default function withModal(FluxAction, ModalForm) {
  return function(WrappedComponent) {
    class WithModal extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          modalFormData: null,
          modalVisible: false
        };
      }

      onAdd = () => {
        this.setState({
          modalVisible: true,
          modalFormData: null
        })
      }

      onEdit = (record) => {
        this.setState({
          modalVisible: true,
          modalFormData: record
        })
      }

      onDel = (name, id) => {
        Modal.confirm({
          title: `确定要删除 ${name} 吗?`,
          okText: "确定",
          cancelText: "取消",
          onOk() {
            return new Promise((resolve,reject)=>{
              FluxAction.delete(id, () => resolve());
            })
          }
        });
      }

        onDelWithPara = (name, id) => {
            Modal.confirm({
                title: `确定要删除 ${name} 吗?`,
                okText: "确定",
                cancelText: "取消",
                onOk() {
                    return new Promise((resolve,reject)=>{
                        FluxAction.delete(id, () => resolve());
                    })
                }
            });
        }
        onDelTask = (name, id) => {
            Modal.confirm({
                title: `确定要删除 ${name} 吗?`,
                okText: "确定",
                cancelText: "取消",
                onOk() {
                    return new Promise((resolve,reject)=>{
                        FluxAction.taskdelete(id, () => resolve());
                    })
                }
            });
        }
        //解决删除教师界面下学生报告后回调的问题
        onAllDel = (name, id,para) => {
            Modal.confirm({
                title: `确定要删除 ${name} 吗?`,
                okText: "确定",
                cancelText: "取消",
                onOk() {
                    return new Promise((resolve,reject)=>{
                        FluxAction.alldelete(id, para,() => resolve());
                    })
                }
            });
        }

      hideModal = () => {
        this.setState({
          modalVisible: false
        })
      }
        render() {
            const {modalVisible, modalFormData} = this.state;
            return (
                <>
                <WrappedComponent
                    onAdd={this.onAdd}
                    onEdit={this.onEdit}
                    onDel={this.onDel}
                    onDelWithPara={this.onDelWithPara}
                    onAllDel={this.onAllDel}
                    onDelTask={this.onDelTask}
            {...this.props}
            />
            <ModalForm visible={modalVisible} hideModal={this.hideModal} modalFormData={modalFormData} {...this.props}/>
            </>
        )
        }
    }
    //这里是为了在 React Developer Tools 中更清楚的展示高阶组件的名称
    //https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging
    function getDisplayName(WrappedComponent) {
      return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }

    WithModal.displayName = `withModal(${getDisplayName(WrappedComponent)})`;
    return WithModal;
  }
}
