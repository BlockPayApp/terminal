import React, { useState, useEffect } from 'react';
import { Button, Form, Input } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/tauri';

const Language = () => {
  const [form] = Form.useForm();
  const [language, setLanguage] = useState('');

  useEffect(() => {
    console.log("getting a language");
    invoke('get_language').then(savedLanguage => {
      console.log("got a language");
      console.log(savedLanguage);
      if (savedLanguage) {
        console.log("setting a language");
        setLanguage(savedLanguage);
      }
    });
  }, []);

  const saveLanguage = () => {
    invoke('save_language', {language: language});
  };

  const goBack = () => {
    location.hash = '#/settings';
  };

  const onFinish = (values) => {
    setLanguage(values.language);
  };

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0
  };

  return (
    <div style={containerStyle}>
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      <br />
      <Input value={language} onChange={e => setLanguage(e.target.value)} />
      <Button type="primary" onClick={saveLanguage()}>Save</Button>
    </div>
  );
};

export default Language;
