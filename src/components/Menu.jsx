import {Menu} from 'antd';
import React from 'react';
import Icon from 'components/Icon';

import './Menu.less'

//语言选项
import qs from "qs";

const languageType = qs.parse(window.location.search.slice(1)).lang;

var rootName = undefined;
const {SubMenu} = Menu;

class _Menu extends React.Component {
    constructor(props) {
        super(props);
        //从props.menuList中解析出path和name然后分别赋值给新的const对象rootPath和rootName
        const {path: rootPath} = props.menuList;
        if (languageType == 'en-US') rootName = props.menuList.nameEN;
        else rootName = props.menuList.nameCN;
        //console.log("rootName= " + rootName)


        const [openKeys, current, currentName] = this.findRoutes(props);

        this.state = {
            openKeys: openKeys,
            current: current,
        }

        //面包屑底层信息
        this.rootPathSnippet = {
            path: rootPath,
            name: rootName
        }

        //通知父组件改变面包屑信息，应对页面刷新后状态丢失
        this.props.onRouteChanges([
            this.rootPathSnippet,
            {
                path: current,
                name: currentName
            }
        ])
    }

    componentWillReceiveProps(nextProps) {
        //const { path: rootPath, nameEN: rootName } = nextProps.menuList;
        const {path: rootPath} = nextProps.menuList;
        if (languageType == 'en-US') rootName = nextProps.menuList.nameEN;
        else rootName = nextProps.menuList.nameCN;

        const [openKeys, current, currentName] = this.findRoutes(nextProps);
        this.setState({
            current
        });

        if (this.props.location.pathname != nextProps.location.pathname) {
            //通知父组件改变面包屑信息
            this.props.onRouteChanges([
                {
                    path: rootPath,
                    name: rootName
                }, {
                    path: current,
                    name: currentName
                }
            ]);
        }
    }

    findRoutes = (props) => {
        const route = props.location.pathname.split("/").filter(i => i);
        const menuItems = props.menuList.children;
        //console.log(props.menuList);
        //console.log(menuItems);
        //add children of menuItems 20190418
//    const subMenuItems = menuItems[0].children;
        //   console.log(subMenuItems);

        let openKeys, current, currentName;
        if (route.length == 1) {
            //进入页面初始菜单展开项及选中值
            openKeys = menuItems[0].children ? [menuItems[0].path] : [];
            current = menuItems[0].children ? menuItems[0].children[0].path : menuItems[0].path;
            if (languageType == 'en-US') {
                currentName = menuItems[0].children ? menuItems[0].children[0].nameEN : menuItems[0].nameEN;
            } else {
                currentName = menuItems[0].children ? menuItems[0].children[0].nameCN : menuItems[0].nameCN;
            }

            props.history.push('/' +props.menuList.path + '/' + current);
        } else {
            //应对页面刷新时菜单展开项及选中值重置的情况
            let submenuKey;
            //根据路由找展开菜单key值
            for (let i = 0; i < menuItems.length; i++) {
                if (menuItems[i].path == route[1]) {
                    if (languageType == 'en-US') currentName = menuItems[i].nameEN;
                    else currentName = menuItems[i].nameCN;
                    break;
                }
                if (menuItems[i].children) {
                    const matchRoute = menuItems[i].children.find(child => child.path == route[1]);
                    if (matchRoute) {
                        submenuKey = menuItems[i].path;
                        if (languageType == 'en-US') currentName = matchRoute.nameEN;
                        else currentName = matchRoute.nameCN;
                        break;
                    }
                }
            }
            openKeys = submenuKey ? [submenuKey] : [];
            current = route[1];
        }
        return [openKeys, current, currentName];
    }

    genMenuList = () => {
        return this.props.menuList.children.map(menuItem => {
            let menuChildren = null;
            //如果有子级菜单
            if (menuItem.children) {
                menuChildren = menuItem.children.map(item => {
                    if (languageType == 'en-US') {
                        return (
                            item.status_code==0?
                            <Menu.Item key={item.path}><span>{item.nameEN}</span></Menu.Item>:
                                <Menu.Item key={item.path}><p style={{color:'gray'}}><span>{item.nameEN}</span></p></Menu.Item>
                        );
                    } else return (
                        item.status_code==0?
                        <Menu.Item key={item.path}><span>{item.nameCN}</span></Menu.Item>:
                            <Menu.Item key={item.path}><p style={{color:'gray'}}><span>{item.nameCN}</span></p></Menu.Item>
                    );

                });
                if (languageType == 'en-US') {
                    return (
                        <SubMenu key={menuItem.path} title={<span><Icon iconid={menuItem.icon}/><span
                            className="min-hidden">{menuItem.nameEN}</span></span>}>
                            {menuChildren}
                        </SubMenu>
                    )
                } else {
                    return (
                        <SubMenu key={menuItem.path} title={<span><Icon iconid={menuItem.icon}/><span
                            className="min-hidden">{menuItem.nameCN}</span></span>}>
                            {menuChildren}
                        </SubMenu>
                    )
                }
            }
            //没有子级菜单
            if (languageType == 'en-US') {
                return (
                    <Menu.Item key={menuItem.path}>
                        <Icon iconid={menuItem.icon}/>
                        <span className="min-hidden">{menuItem.nameEN}</span>
                    </Menu.Item>
                )
            } else {
                return (
                    <Menu.Item key={menuItem.path}>
                        <Icon iconid={menuItem.icon}/>
                        <span className="min-hidden">{menuItem.nameCN}</span>
                    </Menu.Item>
                )
            }
        })
    }

    /*
     getSubMenuList = ()=> {

       return this.props.menuItems.children.map( menuItem => {
         let menuChildren = null;
         //如果有子级菜单
         if(menuItem.children) {
           menuChildren = menuItem.children.map( item => (
               <Menu.Item key={item.path}><span>{item.name}</span></Menu.Item>
           ))
           return (
               <SubMenu key={menuItem.path} title={<span><Icon iconid={menuItem.icon} /><span className="min-hidden">{menuItem.name}</span></span>}>
                 {menuChildren}
               </SubMenu>
           )
         }
         //没有子级菜单
         return (
             <Menu.Item key={menuItem.path}>
               <Icon iconid={menuItem.icon} />
               <span className="min-hidden">{menuItem.name}</span>
             </Menu.Item>
         )
       })
     }
   */
    onOpenChange = (openKeys) => {
        // const onlyOpenKey = openKeys.length ? openKeys.slice(-1) : [];
        this.setState({openKeys});
    }

    handleClick = e => {
        const {key, keyPath} = e;
        this.props.history.push(`/${this.props.menuList.path}/${key}`);
        this.setState({
            current: key,
            // openKeys: keyPath.length == 2 ? keyPath.slice(-1) : []
        });

        let currentName;
        const menuItems = this.props.menuList.children;
        for (let i = 0; i < menuItems.length; i++) {
            if (menuItems[i].path == key) {
                if (languageType == 'en-US')
                    currentName = menuItems[i].nameEN;
                else
                    currentName = menuItems[i].nameCN;
                break;
            }
            if (menuItems[i].children) {
                const matchRoute = menuItems[i].children.find(child => child.path == key);
                if (matchRoute) {
                    if (languageType == 'en-US') currentName = matchRoute.nameEN;
                    else currentName = matchRoute.nameCN;
                    break;
                }
            }
        }

        //通知父组件改变面包屑信息
        this.props.onRouteChanges([
            this.rootPathSnippet,
            {
                path: key,
                name: currentName
            }
        ])
    }

    render() {
        // Don't show popup menu when it is been collapsed
        const menuProps = this.props.collapsed ? {} : {
            openKeys: this.state.openKeys,
        };
        return (
            <Menu
                mode="inline"

                inlineCollapsed={this.props.collapsed}
                theme="dark"

                //同步url与菜单选中状态
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}

                //用户实现只展开当前父级菜单
                {...menuProps}
                onOpenChange={this.onOpenChange}
            >
                {this.genMenuList()}
            </Menu>
        )
    }

}

export default _Menu;
