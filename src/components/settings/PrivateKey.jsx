import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/tauri';

const { TextArea } = Input;

const PrivateKey = () => {
  const [passphrase, setPassphrase] = useState('');

  const goBack = () => {
    location.hash = '#/settings';
  }

  const handleFileUpload = (event) => {
    // const file = event.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const privateKey = e.target.result;
    //     // Save the private key using Tauri
    //     invoke('save_private_key', privateKey);
    //   };
    //   reader.readAsText(file);
    // }
  };

  const handlePassphraseSubmit = () => {
    // Save the passphrase using Tauri
    invoke('save_passphrase', {passphrase: passphrase});
  };

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0,
    color: 'gray'
  };

  const backButtonStyle = {
    position: 'absolute', 
    left: 0, 
    top: 0 
  };

  return (
    <div style={containerStyle}>
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={backButtonStyle} />
      <br />
      <br />
      <TextArea showCount rows={4} value={passphrase} style={{ resize: 'none' }} onChange={e => setPassphrase(e.target.value)} placeholder="Enter passphrase" />
      <br />
      <br />
      <Button type="primary" size={'large'} style={{ float: 'right' }} onClick={handlePassphraseSubmit}>Submit Passphrase</Button>
      <br />
      <br />
      <h2 style={{ textAlign: 'center' }}>or</h2>
      <h1 style={{ color: 'black' }}>Import using pendrive</h1>
      <p style={{ margin: 20 }}>
        1. Prepare your pendrive{<br />}
        2. Create a file named <b>private_key.txt</b> in the root directory of your pendrive{<br />}
        3. Copy your private key into the file{<br />}
        4. Plug in your pendrive{<br />}
        5. Click the button below
      </p>
      <Button size={'large'} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', alignItems: 'center', marginLeft: 'auto', marginRight: 'auto' }} icon={<UploadOutlined />}>Import from pendrive</Button>
    </div>
  );
};

export default PrivateKey;
