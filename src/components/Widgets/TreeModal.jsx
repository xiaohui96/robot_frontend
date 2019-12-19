import React from 'react';
import { Modal, Tree, Input,Button } from 'antd';

const TreeNode = Tree.TreeNode;

class TreeModal extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            tree:[{
                title: "tree",
                key: '0'
            }]
        }


    }

    componentDidMount(){
        this.convertTree();
    }

    addSignalTree=(tree,para)=>{
        var divs=para.path.split('/');
        divs.shift();

        if(para.name!=divs[divs.length-1]){
            divs[divs.length]=para.name;
        }

        for(var i in divs){
            var div=divs[i];
            var isInsert=true;
            if(tree.children==undefined){
                tree.children=[];
            }
            for(var j in tree.children){
                item=tree.children[j];
                //console.log(item);
                var item=tree.children[j];
                if(item.title==div){
                    tree=item;
                    isInsert=false;
                    break;
                }
            }
            if(isInsert){
                var item;
                if(i==divs.length-1){
                    if(para.nCols==1&&para.nRows==1){
                        item={title:para.name,key:'1_'+para.position+'_0_0'};
                        para.key='1_'+para.position+'_0_0';
                    }
                    else{
                        item={title:para.name,key:"F_"+Math.random()};
                    }

                }
                else
                {
                    item={title:div,key:"F_"+Math.random()}
                }
                tree.children.push(item);
                tree=item;
            }
        }
    }

    addParaTree=(tree,para)=>{
        var divs=para.path.split('/');
        divs.shift();
        for(var i in divs){
            var div=divs[i];
            var isInsert=true;
            if(tree.children==undefined){
                tree.children=[];
            }
            for(var j in tree.children){
                item=tree.children[j];
                //console.log(item);
                var item=tree.children[j];
                if(item.title==div){
                    tree=item;
                    isInsert=false;
                    break;
                }
            }
            if(isInsert){
                var item;
                if(i==divs.length-1){
                    if(para.nCols==1&&para.nRows==1){
                        item={title:para.name,key:'2_'+para.position+'_0_0'};
                        para.key='2_'+para.position+'_0_0';
                    }
                    else{
                        item={title:para.name,key:"F_"+Math.random()};
                    }

                }
                else
                {
                    item={title:div,key:"F_"+Math.random()}
                }
                tree.children.push(item);
                tree=item;
            }
        }
    }

    convertTree=()=>{
        const {signalParaList,paraOnly}=this.props;
        //console.log(signalParaList);

        var signalTree={
            title: "Signal",
            key: '0'
        };

        if(paraOnly==false){
            for(var i in signalParaList.signals){
                this.addSignalTree(signalTree,signalParaList.signals[i]);
            }
        }

        var paraTree={
            title: "Parameter",
            key: '1'
        };

        for(var i in signalParaList.paras){
            this.addParaTree(paraTree,signalParaList.paras[i]);
        }

        var tree;
        if(paraOnly){
            tree=[paraTree];
        }
        else{
            tree=[signalTree,paraTree];
        }

        this.setState({tree});
    }

    renderTreeNodes = tree => tree.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    })

    onSelect = (selectedKeys, info) => {
        const {onSignalParaSelected,signalParaList}=this.props;
        //console.log('selected', selectedKeys, info);
        var key=selectedKeys[0];
        if(key[0]!='F'){
            var keyDiv=key.split('_');
            var type=parseInt(keyDiv[0]);
            var pos=parseInt(keyDiv[1]);
            onSignalParaSelected({
                pos:key,
                type:type,
                sig:type==1?signalParaList.signals[pos]:signalParaList.paras[pos]
            });
        }

    }


    render(){
        const { visible, modalFormData } = this.props;
        const {tree}=this.state;
        console.log(tree);
        return (
            <Modal
                visible={visible}
                onCancel={this.props.hideModal}
            >
                <Tree
                    showLine
                    defaultExpandedKeys={['0-0-0']}
                    onSelect={this.onSelect}
                >
                    {this.renderTreeNodes(tree)}

                </Tree>

            </Modal>
        );
    }
}

export default TreeModal;