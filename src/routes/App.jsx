//依赖类
import React from 'react';
import ReactDom from 'react-dom';
import Reflux from 'reflux';
import {Route, Link, Switch} from 'react-router-dom';
import {Layout, BackTop, Menu, Icon} from 'antd';
import Cookies from 'js-cookie';

//数据流
import AuthActions from 'actions/AuthActions';
import authStore from 'stores/authStore';
import AppActions from 'actions/AppActions';
import appStore from 'stores/appStore';

//路由页面
import UsersConfig from 'routes/admin/UsersConfig';

import RobotPatrol from 'routes/lab/RobotPatrol';
import OverallPatrol from 'routes/lab/OverallPatrol';
import RoutinePatrol from 'routes/lab/RoutinePatrol';
import SpecialPatrol from 'routes/lab/SpecialPatrol';
import CustomTask from 'routes/lab/CustomTask';
import TaskDisplay from 'routes/lab/TaskDisplay';
import MapSetting from 'routes/lab/MapSetting';
import PatrolResult from 'routes/lab/PatrolResult';
import RobotSetting from 'routes/lab/RobotSetting';
import RobotInfo from 'routes/lab/RobotInfo';
import AlarmSetting from 'routes/lab/AlarmSetting';

//菜单项
import adminMenu from 'routes/admin/menu';

//组件类
import _Menu from 'components/Menu';
import _Icon from 'components/Icon';
import Breadcrumb from 'components/Breadcrumb';
import ErrorBoundary from 'components/ErrorBoundary';

import UserDetail from 'routes/userinfo/UserDetail';
import userinfoMenu from 'routes/userinfo/menu';

//工具类
import toggleFullScreen from 'utils/toggleFullScreen';

//资源类
import logo from 'images/logo.png';

import './App.less';

//语言国际化
import intl from 'react-intl-universal';
import http from "axios";
import _ from "lodash";
import qs from 'qs';
import LangConsistent from 'routes/LangConsistent';


const {SubMenu} = Menu;
const {Header, Content, Sider, Footer} = Layout;

const languageType = qs.parse(window.location.search.slice(1)).lang;
const language = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);


const SUPPOER_LOCALES = [
    {
        name: '简体中文',
        value: 'zh-CN'
    },
    {
        name: 'English',
        value: 'en-US'
    }
];


class App extends Reflux.Component {
    constructor(props) {
        super(props);
        this.stores = [authStore, appStore];
        this.onSelectLocale = this.onSelectLocale.bind(this);
        this.state = {
            collapsed: false,
            fullScreen: false,
            breadCrumb: [],
            initDone: false
        }
    }

    componentDidMount() {

        LangConsistent();
        this.loadLocales();
        // LangConsistent();

    }


    loadLocales() {
        let currentLocale = intl.determineLocale({
            urlLocaleKey: "lang",
            cookieLocaleKey: "lang"
        });
        if (!_.find(SUPPOER_LOCALES, {value: currentLocale})) {
            currentLocale = "zh-CN";
        }

        http
            .get(`../locales/${currentLocale}.json`)//"../index/less/nav.css"
            .then(res => {
                //   console.log("App locale data", res.data);
                // init method will load CLDR locale data according to currentLocale
                return intl.init({
                    currentLocale,
                    locales: {
                        [currentLocale]: res.data
                    }
                });
            })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({initDone: true});
            });
    }

    renderLocaleSelector = () => {
        return (<span className="langSel">
                <select onChange={this.onSelectLocale} className="language">
                    {SUPPOER_LOCALES.map(locale => {
                        //selected选中的永远为URL中的languageType，返回此option
                        if (locale.value === languageType) {
                            return <option key={locale.value} value={locale.value}
                                           selected="selected">{locale.name}</option>
                        }
                        //返回其他option
                        return <option key={locale.value} value={locale.value}>{locale.name}</option>;
                    })}
                </select>
            </span>
        );
    }

    onSelectLocale(e) {
        //var ind =document.getElementsByClassName("language").selectedIndex;
        let lang = e.target.value;
        window.location.search = `?lang=${lang}`;
        //window.location.reload(true);
    }


    /*主界面创建的时候的一些工作*/
    componentWillMount() {
        super.componentWillMount();
        //确认用户是否合法登录
        this.verifyLogin();
        //获取用户的labMenu，放入state中
        AppActions.GetLabMenu();
    }

    componentWillReceiveProps(nextProps) {
        this.verifyLogin();
    }

    verifyLogin = () => {
        if (Reflux.GlobalState.authStore?.User == undefined) {
            AuthActions.VerifyLogin();
        }
    }

    onCollapse = () => {
        this.setState(prevState => ({
            collapsed: !prevState.collapsed
        }))
    }

    onFullScreen = () => {
        toggleFullScreen();
        this.setState(prevState => ({
            fullScreen: !prevState.fullScreen
        }))
    }

    getBreadCrumb = (breadCrumb) => {
        this.setState({breadCrumb})
    }

    genMenu = (menuList, props) => {
        return (
            <_Menu
                collapsed={this.state.collapsed}
                onRouteChanges={this.getBreadCrumb}
                menuList={menuList}
                {...props}
            />
        )
    }

    handleResponsiveCollapse = (collapsed, type) => {
        if (type == "responsive") {
            this.setState({
                collapsed
            });
        }
    }

    //当用户点击退出登录的时候，系统退出登录
    onClickUserinfo = ({item, key, keyPath}) => {
        if (key == 'logout') {
            AuthActions.Logout();
        }
    }


    render() {
        const {collapsed, fullScreen, labMenu} = this.state;
        // console.log("labMenu= "+labMenu)

        if (Reflux.GlobalState.authStore?.User == undefined) {
            return null;
        }

        let langCN;
        if (languageType==='zh-CN'){
            langCN = true;
        }
        if (languageType==='en-US'){
            langCN = false;
        }
        const hrefresetpwdCN="/resetpwd";//?lang=zh-CN
        const hrefresetpwdEN="/resetpwd?lang=en-US";

        const user = Reflux.GlobalState.authStore?.User;
        //console.log(user);

        if (labMenu == undefined) {
            return null;
        }
        return (
            <Layout className="layout-with-sider">
                {/*左侧页面，用Sider*/}
                <Sider
                    breakpoint="lg"
                    trigger={null}
                    collapsible
                    onCollapse={this.handleResponsiveCollapse}
                    collapsed={collapsed}
                    width={240}
                    collapsedWidth={64}
                >
                    {/*Logo和标志*/}
                    <div id="logo-container">
                        <Link to='/lab'>
                            <img src={logo}/>
                            <span>Robot</span>
                        </Link>
                    </div>
                    {/*不同路径用不同的左侧菜单*/}
                    <Switch>
                        {/*使用者的菜单*/}
                        <Route path="/lab"
                               render={(props) => this.genMenu(labMenu, props)}/> {/*需要把参数如laMenu穿进去，所以没有使用component，采用这种格式*/}
                        {/*管理员的菜单*/}
                        <Route path="/admin" render={(props) => this.genMenu(adminMenu, props)}/>
                        {/*个人信息修改的菜单*/}
                        <Route path="/userinfo" render={(props) => this.genMenu(userinfoMenu, props)}/>

                    </Switch>
                </Sider>
                {/*右边的页面，使用Layout*/}

                <Layout className={`layout-for-content ${collapsed ? "sider-collapsed" : ""}`}>
                    <BackTop/>
                    <Header style={{background: '#fff', padding: 0}}>
                        {/*收缩按钮和全屏按钮*/}
                        <_Icon
                            iconid={collapsed ? 'menuUnfold' : 'menuFold'}
                            onClick={this.onCollapse}
                        />

                        <_Icon
                            iconid={fullScreen ? 'fullScreenExit' : 'fullScreen'}
                            onClick={this.onFullScreen}
                        />


                        <Menu
                            mode="horizontal"
                            id="userinfo"
                            onClick={this.onClickUserinfo}
                        >

                            <SubMenu
                                className="user"
                                key="user"
                                title={
                                    <span>
                                     <img src="https://cn.bing.com/th?id=OIP.LTyzkbnUGUWY1k91-NpAEQAAAA&pid=Api&rs=1"/>
                                        {
                                            (() => {
                                                switch (user.role) {
                                                    case 1:
                                                        return (<span>{intl.get('admin')}</span>);
                                                    case 2:
                                                        return (<span>{intl.get('non_administrator')}</span>);
                                                }

                                            })()
                                        }

                                    </span>
                                }
                            >
                                {/*管理菜单，后期需要加入权限控制*/}
                                {user.role == 1 ? <Menu.Item key="admin"><Link
                                    to="/admin">{intl.get('management center')}</Link></Menu.Item> : null}

                                <Menu.Item key="userinfo"><Link
                                    to="/userinfo">{intl.get('user information')}</Link></Menu.Item>
                                <Menu.Item key="resetpwd"><Link
                                    to={langCN ? hrefresetpwdCN : hrefresetpwdEN}>{intl.get('change password')}</Link></Menu.Item>
                                <Menu.Item key="logout">{intl.get('logout')}</Menu.Item>

                            </SubMenu>

                        </Menu>
                        {this.renderLocaleSelector()}

                    </Header>

                    <Content>
                        <ErrorBoundary>
                            <Breadcrumb pathSnippets={this.state.breadCrumb}/> {/*面包屑控件*/}
                            <Switch>
                                {/*用户的实验界面*/}
                                <Route path="/lab/robotPatrol" component={RobotPatrol}/>
                                <Route path="/lab/overallPatrol" component={OverallPatrol}/>
                                <Route path="/lab/routinePatrol" component={RoutinePatrol}/>
                                <Route path="/lab/specialPatrol" component={SpecialPatrol}/>
                                <Route path="/lab/customTask" component={CustomTask}/>
                                <Route path="/lab/taskDisplay" component={TaskDisplay}/>
                                <Route path="/lab/mapSetting" component={MapSetting}/>
                                <Route path="/lab/patrolResult" component={PatrolResult}/>
                                <Route path="/lab/robotSetting" component={RobotSetting}/>
                                <Route path="/lab/robotInfo" component={RobotInfo}/>
                                <Route path="/lab/alarmSetting" component={AlarmSetting}/>
                                {/*系统管理员的界面*/}
                                <Route path="/admin/usersConfig" component={UsersConfig}/>
                                <Route path="/userinfo/userDetail" component={UserDetail}/>
                            </Switch>
                        </ErrorBoundary>
                    </Content>

                    <Footer>
                        Robot ©2018 Created by WHU
                    </Footer>
                </Layout>

            </Layout>
        )
    }
}

export default App;
