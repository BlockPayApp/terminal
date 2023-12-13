import React, { useState, useEffect } from 'react';
import { Button, Form, Input, List, Card } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/tauri';

const data = [
  {
    title: 'Language',
    path: '/#/settings/language',
  },
  {
    title: 'Currency',
    path: '/#/settings/currency',
  },
  {
    title: 'Private Key',
    path: '/#/settings/private-key',
  },
];

const Settings = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState({
    language: '',
    currency: '',
    privateKey: '',
  });

  useEffect(() => {
    invoke('get_settings').then(savedSettings => {
      if (savedSettings) {
        setSettings(savedSettings);
      }
    });
  }, []);

  useEffect(() => {
    invoke('save_settings', settings);
  }, [settings]);

  const onFinish = (values) => {
    setSettings(values);
  };

  const goBack = () => {
    location.hash = '#/';
  };

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0
  }

  return (
    <div style={containerStyle}>
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      <h1 style={{ color: 'black' }}>Settings</h1>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Card title={item.title} onClick={() => handleClick(item.path)}>
              {item.title}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Settings;
