import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import checkmark from './../../assets/checkmark.gif';
import { LazyLoadImage } from "react-lazy-load-image-component";
import solana from './../../assets/solana.jpg';

const Success = () => {
  const { memo } = useParams();

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

  return (
    <div style={containerStyle}>
      <div style={bodyStyle}>
        <h1 style={headerStyle}>Payment successful!</h1>

        <LazyLoadImage src={checkmark} alt="checkmark" style={checkmarkStyle} loading="lazy" /> 

        <div style={detailsStyle}>
          <img src={solana} alt="Solana" style={solanaLogoStyle} />
          <div style={detailsBlockStyle}>
            <div style={{ color: 'black', fontWeight: 600 }}>Addr: eh28...2h92</div>
            <div style={{ color: 'black' }}>Memo: 7832782</div>
            <div style={{ color: 'black' }}>1 SOL = 400.52 PLN</div>
          </div>
          <div style={priceDetailsStyle}>
            <div style={{ color: 'black', fontWeight: 600 }}>0.123 SOL</div>
            <div style={{ color: 'black' }}>10.35 PLN</div>
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
