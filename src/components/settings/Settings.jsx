import React, { useState, useEffect } from 'react';
import { Button, Form, Input, List, Card } from 'antd';
import { LeftOutlined, EditOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/tauri';

const pages = [
  {
    title: 'Balance',
    path: '#/settings/balance',
    hook: 'balance',
  },
  {
    title: 'Language',
    path: '#/settings/language',
    hook: 'language',
  },
  {
    title: 'Currency',
    path: '#/settings/currency',
    hook: 'currency',
  },
  {
    title: 'Private Key',
    path: '#/settings/private-key',
    hook: 'publicKey',

  },
];

const Settings = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState({
    language: '',
    currency: '',
    publicKey: '',
  });

  useEffect(() => {
    // invoke('get_settings').then(savedSettings => {
    //   if (savedSettings) {
    //     setSettings(savedSettings);
    //   }
    // });

    invoke('get_language').then(savedLanguage => {
      if (savedLanguage) {
        setSettings(prevSettings => ({
          ...prevSettings,
          language: savedLanguage,
        }));
      }
    });

    invoke('get_public_key').then(savedPublicKey => {
      if (savedPublicKey) {
        setSettings(prevSettings => ({
          ...prevSettings,
          publicKey: savedPublicKey,
        }));
      }
    });
  }, []);

  useEffect(() => {
    invoke('save_settings', settings);
  }, [settings]);

  const onFinish = (values) => {
    setSettings(values);
  };

  const handleClick = (path) => {
    location.hash = path;
  }

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
        dataSource={pages}
        renderItem={item => (
          <List.Item>
            <Card 
              title={item.title} 
              onClick={() => handleClick(item.path)}
              extra={<Button icon={<EditOutlined />}/>}>
              {settings[item.hook]}
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Settings;
