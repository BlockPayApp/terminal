import React, { useState, useEffect } from 'react';
import { Button, Form, Input, List, Card } from 'antd';
import { LeftOutlined, EditOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/tauri';

const Balance = () => {
  const [balance, setBalance] = useState('');

  useEffect(() => {
    invoke('get_balance').then(savedBalance => {
      if (savedBalance) {
        setBalance(savedBalance);
      }
    });
  }, []);

  const goBack = () => {
    location.hash = '#/settings';
  }

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0,
    color: 'black'
  };

  const backButtonStyle = {
    position: 'absolute', 
    left: 0, 
    top: 0 
  };

  return (
    <div style={containerStyle}>
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={backButtonStyle} />
      <h1 style={{ textAlign: 'center' }}>Balance</h1>
      <p>{balance}</p>
      <Button type="primary" onClick={() => invoke('receive')}>Receive</Button>
      <Button type="primary" onClick={() => invoke('send')}>Send</Button>
      <h2>Transactions</h2>
      {/* <List
        bordered
        dataSource={transactions}
        renderItem={item => (
          <List.Item>
            <Typography.Text mark>[{item.date}]</Typography.Text> {item.amount}
          </List.Item>
        )}
      /> */}
    </div>
  );
};

export default Balance;
