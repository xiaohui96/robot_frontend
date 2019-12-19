import React from 'react';
import {Breadcrumb} from 'antd';
import {Link, withRouter} from 'react-router-dom';

import './Breadcrumb.less'
//语言
import intl from 'react-intl-universal';
const BreadcrumbWrapper = (props) => {
  const {pathSnippets} = props;
  let url = "";
  const genBreadcrumb = pathSnippets.map( (routes, index, arr) => {
    if(index == arr.length - 1) {
      return <Breadcrumb.Item key={index}>{routes.name}</Breadcrumb.Item>;
    }
    url += "/" + routes.path;
    return (
      <Breadcrumb.Item key={index}>
        <Link to={url}>{routes.name}</Link>
      </Breadcrumb.Item>
    )
  })

  return (
    <div id="breadcrumb">
      <Breadcrumb >
        <Breadcrumb.Item key="/">
          <a href="/">{intl.get('home')}</a>
        </Breadcrumb.Item>
        {genBreadcrumb}
      </Breadcrumb>
    </div>
  )
};

export default BreadcrumbWrapper;
