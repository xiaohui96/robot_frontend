import React from 'react';
import PropTypes from 'prop-types';
import TweenOne from 'rc-tween-one';
import { Menu, Icon } from 'antd';

import Scroll from 'rc-scroll-anim';

//资源类
import logo from '../images/logo.png';

import intl from 'react-intl-universal';

const SubMenu = Menu.SubMenu;

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneOpen: false
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
      content_1_0: intl.get('home'),
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
          src="https://cn.bing.com/th?id=OIP.LTyzkbnUGUWY1k91-NpAEQAAAA&pid=Api&rs=1"
          width="30"
          height="30"
        />
      </span>
      <span>{intl.get('username')}</span>
    </div>);
    navChildren.push(
      <SubMenu className="user" title={userTitle} key="user">
        <Menu.Item key="a">{intl.get('user center')}</Menu.Item>
        <Menu.Item key="b">{intl.get('change password')}</Menu.Item>
        <Menu.Item key="c">{intl.get('logout')}</Menu.Item>
      </SubMenu>
    );

    //语言选项
    //const language = (
       // console.log("navLanguage"),

    //    this.props.renderLocaleSelector()
    //);
    //从index.jsx中的函数renderLocaleSelector传入select/option，在nav上渲染
    navChildren.push(
       // console.log("language"),
        <Menu.Item key="la" >{this.props.renderLocaleSelector()}</Menu.Item>
    );

    return (
        //this.state.initDone&&(
        <TweenOne
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
          <span>Robot</span>
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
    </TweenOne>//)
    );
  }

}

Header.defaultProps = {
  className: 'header1',
};

export default Header;
