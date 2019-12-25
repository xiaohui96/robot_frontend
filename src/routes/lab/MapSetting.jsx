import { Tree } from 'antd';
import React from 'react';
import appStore from "stores/appStore";
import robotStore from "stores/RobotStore";
import AppActions from "actions/AppActions";
import Reflux from "reflux";
const { TreeNode } = Tree;
const treeData = [
    {
        title: '变电站',
        key: '0',
        children: [
        {
            title: '500KV设备区',
            key: '0-0',
            children: [
                {
                    title: '西二设备',
                    key: '0-0-0',
                    children: [
                        {title: '第一排西二SF6压力表', key: '0-0-0-0'},
                        {title: '第一排西二SF6避雷器', key: '0-0-0-1'},
                        {title: '第一排西二SF6压力表', key: '0-0-0-2'},
                    ],
                },
                {
                    title: '西三设备',
                    key: '0-0-1',
                    children: [
                        {title: '第二排西三SF6压力表', key: '0-0-1-0'},
                        {title: '第三排西三SF6避雷器', key: '0-0-1-1'},
                        {title: '第一排西三SF6压力表', key: '0-0-1-2'},
                    ],
                },
                {
                    title: '东一设备',
                    key: '0-0-2',
                },
            ],
        },
        {
            title: '200KV设备区',
            key: '0-1',
            children: [
                {title: '西三设备', key: '0-1-0'},
                {title: '西二设备', key: '0-1-1'},
                {title: '东三设备', key: '0-1-2'},
            ],
        },
        {
            title: '100KV设备区',
            key: '0-2',
        },
            ]
    }
];

class MapSetting extends React.Component {
    constructor(props) {
        super(props);
        this.stores = [
            appStore,
            robotStore
        ];
        this.storeKeys = ['mapList'];
        this.state = {
            expandedKeys: ['0-0-0', '0-0-1'],
            autoExpandParent: true,
            checkedKeys: ['0-0-0'],
            selectedKeys: [],
            mapList: [],
        };
    }
    componentDidMount() {
        AppActions.Robot.retrieve(()=>{
        });

    }
    onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    };

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} />;
        });

    render() {
        const {mapList} = this.state;

        return (
            <Tree
                checkable
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
                componentDidMount={this.componentDidMount()}
            >
                {this.renderTreeNodes(treeData)
                }
            </Tree>
        );
    }
}


export default MapSetting;