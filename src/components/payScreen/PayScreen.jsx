import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import QRCodeStyling from "qr-code-styling";
import logo from './../../assets/banapay-circle.png';
import solana from './../../assets/solana.jpg';

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
  }
});

const PayScreen = () => {
  const [payData, setPayData] = useState();
  const [rerender, setRerender] = useState();
  const [afterRender, setAfterRender] = useState();
  const [formattedAddress, setFormattedAddress] = useState();
  const ref = useRef(null);

  const { amount } = useParams();

  useEffect(() => {
    if (!afterRender) return;
    console.log('Entered amount:', amount);
    invoke('new_invoice', { amount: Number(amount) }).then(invoice => {
      console.log('Got invoice:', invoice);
      setPayData(invoice);

      setAfterRender(false);
    });
  }, [afterRender]);

  useEffect(() => {
    if (!payData) return;
    setFormattedAddress(`${payData["address"].substring(0, 4)}...${payData["address"].substring(payData["address"].length - 4)}`);
    qrCode.update({
      data: `solana:${payData["address"]}?amount=${payData["price"]}&memo=${payData["invoice_id"]}`
    });
    qrCode.append(ref.current);

    invoke('listen', { memo: payData["invoice_id"] })
  }, [payData]);

  listen('listen_got', (event) => {
    console.log('Received event:', event);
    if (event.payload == "Completed") {
      location.hash = '#/payScreen/success/' + payData["invoice_id"];
    } else {
      location.hash = '#/payScreen/failure' + payData["invoice_id"];
    }
  });

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

  const qrCodeStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const solanaLogoStyle = {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10
  }
  
  const detailsStyle = {
    width: 400,
    height: 70,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex'
  }

  const detailsBlockStyle = {
    display: 'flex',
    flexDirection: 'column',
  }

  const priceDetailsStyle = {
    ...detailsBlockStyle,
    float: 'right',
    marginLeft: 'auto',
    //center vertically
    marginTop: 'auto',
    marginBottom: 'auto'
  }

  return !payData ? (
    <div style={containerStyle}>
      {setRerender}
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      <h1 style={{ color: 'black' }}>Loading...</h1>
    </div>
  ) : (
    <div style={containerStyle}>
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      <h1 style={{ color: 'black' }}>Payment</h1>
      <div ref={ref} style={qrCodeStyle} />
      <div style={detailsStyle}>
        <img src={solana} alt="Solana" style={solanaLogoStyle} />
        <div style={detailsBlockStyle}>
          <div style={{ color: 'black', fontWeight: 600 }}>Addr: {formattedAddress}</div>
          <div style={{ color: 'black' }}>Memo: {payData["invoice_id"]}</div>
          <div style={{ color: 'black' }}>1 SOL = {payData["solpln"].toFixed(2)} PLN</div>
        </div>
        <div style={priceDetailsStyle}>
          <div style={{ color: 'black', fontWeight: 600 }}>{payData["price"].toFixed(6)} SOL</div>
          <div style={{ color: 'black' }}>{amount/100} PLN</div>
        </div>
      </div>
    </div>
  );
};

export default PayScreen;
