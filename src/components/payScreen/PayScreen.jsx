import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import QRCodeStyling from "qr-code-styling";
import logo from './../../assets/banapay-circle.png';
import { encodeURL, createQR } from '@solana/pay';

const qrCode = new QRCodeStyling({
  width: 400,
  height: 400,
  type: "svg",
  image: logo,
  dotsOptions: {
    color: "#00BBF9",
    type: "rounded"
  },
  backgroundOptions: {
    color: "#efefef",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 10,
    imageSize: 0.4,
    // hideBackgroundDots: false
  }
});

const PayScreen = () => {
  const [payData, setPayData] = useState();
  // const [qrCode, setQrCode] = useState();
  const [rerender, setRerender] = useState();
  const [afterRender, setAfterRender] = useState();
  const ref = useRef(null);

  const { amount } = useParams();

  useEffect(() => {
    if (!afterRender) return;
    console.log('Entered amount:', amount);
    invoke('new_invoice', { amount: Number(amount) }).then(invoice => {
      console.log('Got invoice:', invoice);
      setPayData(invoice);
      qrCode.append(ref.current);
      qrCode.update({
        data: `solana:${invoice["address"]}?amount=${invoice["price"]}&memo=${invoice["invoice_id"]}`
      });
  });

    setAfterRender(false);
  }, [afterRender]);
  
  useEffect(() => {
      setAfterRender(true);
  }, [rerender]);

  const goBack = () => {
    location.hash = '#/'; 
  };

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0
  }

  return !payData ? (
    <div style={containerStyle}>
      {setRerender}
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      <h1 style={{color: 'black'}}>Loading...</h1>
    </div>
   ) : (
    <div style={containerStyle}>
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      <h1 style={{color: 'black'}}>Payment {amount}</h1>
      <div ref={ref} />
    </div>
  );
};

export default PayScreen;
