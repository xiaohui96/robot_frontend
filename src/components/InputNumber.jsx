import React from 'react';
import { InputNumber } from 'antd';

import './InputNumber.less';

function InputNumberWrapper(props) {
  const { addonAfter, ...rest } = props;
  return (
    <div className="customized-input-number" width={100}>
      <InputNumber className={addonAfter ? "input-number-with-addon" : ""} {...rest} />
      {
        addonAfter &&
        <span className="ant-input-group-addon">
          {addonAfter}
        </span>
      }
    </div>
  )

}

export default InputNumberWrapper;
