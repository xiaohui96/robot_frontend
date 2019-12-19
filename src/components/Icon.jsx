import React from 'react';
import './Icon.less';

function Icon( {iconid,...props}) {
  return (
    <div className="icon">
      <svg aria-hidden="true" {...props}>
        <use xlinkHref={`#icon-${iconid}`}></use>
      </svg>
    </div>
  );
}

export default Icon;
