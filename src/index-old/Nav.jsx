import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import { Menu, Icon } from 'antd';

import Scroll from 'rc-scroll-anim';

//资源类
import logo from '../images/logo.png';

const SubMenu = Menu.SubMenu;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneOpen: false,
    };
  }

  phoneClick = () => {
    this.setState({
      phoneOpen: !this.state.phoneOpen,
    });
  }

  render() {
    const props = { ...this.props };
    const isMode = props.isMode;
    delete props.isMode;
    const navData = {
      content_1_0: '首页',
      content_2_0: '研究进展',
      content_3_0: '教学应用',
      content_4_0: '实验设备',
      // menu5: '实验教程',
      // menu6: '团队介绍',
      // menu7: '关于我们',
    };
    const navChildren = Object.keys(navData).map((key, i) => (
      <Menu.Item key={i}>
        <Scroll.Link
          className="nav-link"
          active="active"
          to={key}
          toHash={false}
        >
          {navData[key]}
        </Scroll.Link>
      </Menu.Item>)
    );
    const userTitle = (<div>
      <span className="img">
        <img
          src="https://zos.alipayobjects.com/rmsportal/iXsgowFDTJtGpZM.png"
          width="30"
          height="30"
        />
      </span>
      <span>用户名</span>
    </div>);
    navChildren.push(
      <SubMenu className="user" title={userTitle} key="user">
        <Menu.Item key="a">用户中心</Menu.Item>
        <Menu.Item key="b">修改密码</Menu.Item>
        <Menu.Item key="c">登出</Menu.Item>
      </SubMenu>
    );
    return (<TweenOne
      component="header"
      animation={{ opacity: 0, type: 'from' }}
      {...props}
    >
      <TweenOne
        className={`${this.props.className}-logo`}
        animation={{ x: -30, delay: 100, type: 'from', ease: 'easeOutQuad' }}
        id={`${this.props.id}-logo`}
      >
        <a href="/">
          <img width="45px" src={logo} />
          <span>NCSLab</span>
        </a>
      </TweenOne>
      {isMode ? (<div
          className={`${this.props.className}-phone-nav${this.state.phoneOpen ? ' open' : ''}`}
          id={`${this.props.id}-menu`}
        >
          <div
            className={`${this.props.className}-phone-nav-bar`}
            onClick={() => {
              this.phoneClick();
            }}
          >
            <em />
            <em />
            <em />
          </div>
          <div
            className={`${this.props.className}-phone-nav-text`}
          >
            <Menu
              defaultSelectedKeys={['0']}
              mode="inline"
              theme="dark"
            >
              {navChildren}
            </Menu>
          </div>
        </div>) :
        <TweenOne
          animation={{ x: 30, delay: 100, opacity: 0, type: 'from', ease: 'easeOutQuad' }}
          className={`${this.props.className}-nav`}
        >
          <Menu
            mode="horizontal" defaultSelectedKeys={['0']}
            id={`${this.props.id}-menu`}
            selectedKeys={[]}
          >
            {navChildren}
          </Menu>
        </TweenOne>
      }
    </TweenOne>);
  }
}

Header.defaultProps = {
  className: 'header1',
};

export default Header;
