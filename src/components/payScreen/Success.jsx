import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import checkmark from './../../assets/checkmark.gif';
import { LazyLoadImage } from "react-lazy-load-image-component";
import solana from './../../assets/solana.jpg';
import { invoke } from '@tauri-apps/api';
import LoadingScreen from './../loadingScreen/LoadingScreen';

const Success = () => {
  const { memo } = useParams();

  const [invoice, setInvoice] = useState();
  const [formattedAddress, setFormattedAddress] = useState();
  const [rerender, setRerender] = useState();
  const [afterRender, setAfterRender] = useState();

  useEffect(() => {
    if (!afterRender) return;
    invoke('get_invoice', { invoiceId: Number(memo) }).then(invoice => {
      console.log('Got invoice aaa:', invoice);
      setFormattedAddress(`${invoice["address"].substring(0, 4)}...${invoice["address"].substring(invoice["address"].length - 4)}`);
      setInvoice(invoice);

      setAfterRender(false);
    });
  }, [afterRender]);

  useEffect(() => {
    setAfterRender(true);
  }, [rerender]);

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0,
    // height: `calc(100vh - ${2 * 10}px)`,
    height: '100%',
  }

  const goBack = () => {
    location.hash = '#/';
  };

  const next = () => {
    location.hash = `#/`;
  }

  const print = () => {
    window.print();
  }

  const nextButtonStyle = {
    // width: 100,
    height: 45,
    marginTop: 10,
    backgroundColor: '#00BBF9'
  }

  const printButtonStyle = {
    // width: 100,
    height: 45,
    marginTop: 10,
    backgroundColor: '#EFEFEF'
  }

  const checkmarkStyle = {
    width: 300,
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  const buttonsStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: `calc(100vw - ${2 * 10}px)`,
    margin: 10,
    marginBottom: 20
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 10,
    color: '#00BBF9',
    fontSize: 36
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
    marginTop: 50,
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

  const bodyStyle = {
    height: `calc(100vh - ${2 * 10}px)`,
    // display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
  }

  return !invoice ? (
    <div style={containerStyle}>
      {setRerender}
      <Button icon={<LeftOutlined />} size={'large'} onClick={goBack} style={{ position: 'absolute', left: 0, top: 0 }} />
      <h1 style={{ color: 'black' }}>Loading...</h1>
      <LoadingScreen />
    </div>
  ) : (
    <div style={containerStyle}>
      <div style={bodyStyle}>
        <h1 style={headerStyle}>Payment successful!</h1>

        <LazyLoadImage src={checkmark} alt="checkmark" style={checkmarkStyle} loading="lazy" /> 

        <div style={detailsStyle}>
          <img src={solana} alt="Solana" style={solanaLogoStyle} />
          <div style={detailsBlockStyle}>
            <div style={{ color: 'black', fontWeight: 600 }}>Addr: {formattedAddress}</div>
            <div style={{ color: 'black' }}>Memo: {memo}</div>
            <div style={{ color: 'black' }}>1 SOL = {invoice["solpln"].toFixed(2)} PLN</div>
          </div>
          <div style={priceDetailsStyle}>
            <div style={{ color: 'black', fontWeight: 600 }}>{invoice["price"].toFixed(6)} SOL</div>
            <div style={{ color: 'black' }}>{(invoice["price"]*invoice["solpln"]).toFixed(2)} PLN</div>
          </div>
        </div>
      </div>

      <div style={buttonsStyle}>
        <Button block size={'large'} onClick={next} style={nextButtonStyle}>Next</Button>
        <Button block size={'large'} onClick={print} style={printButtonStyle}>Print</Button>
      </div>
    </div>
  );
};

export default Success;
