import React from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const Currency = () => {
  const goBack = () => {
    location.hash = '#/settings';
  }

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0
  };

  return (
    <div style={containerStyle}>
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      dupa
    </div>
  );
};

export default Currency;
