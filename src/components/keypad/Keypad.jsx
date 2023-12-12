import React from 'react';
import { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';

const Keypad = () => {
  const [price, setPrice] = useState(0);

  const handleNumberClick = (number) => {
    setPrice(prevPrice => prevPrice * 10 + Number(number));
  };

  const handleClearClick = () => {
    setPrice(prevPrice => Math.floor(prevPrice / 10));
  };

  const handleConfirmClick = () => {
    console.log('Entered price:', price);
  };

  const inputStyle = {
    fontSize: '3rem',
    textAlign: 'center',
    width: '100%',
    marginBottom: '40px'
  }

  const buttonStyle = {
    fontSize: '1.8rem',
    height: '9vh',
    marginTop: 10
  }

  const keypadStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    bottom: 0
  }

  const confirmButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#389e0d'
  }

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f5222d'
  }

  const logoStyle = {
    textAlign: 'center',
    width: '100%',
    marginBottom: '110px',
    color: 'black'
  }

  return (
    <div style={keypadStyle}>
      <h1 style={logoStyle}>Tutaj będzie logo</h1>
      <Input value={(price / 100).toFixed(2) + ' zł'} style={inputStyle} disabled />
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('1')}>1</Button>
        </Col>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('2')}>2</Button>
        </Col>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('3')}>3</Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('4')}>4</Button>
        </Col>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('5')}>5</Button>
        </Col>
        <Col span={8}> 
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('6')}>6</Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('7')}>7</Button>
        </Col>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('8')}>8</Button>
        </Col>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('9')}>9</Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Button block style={backButtonStyle} size={'large'} onClick={handleClearClick}>Clear</Button>
        </Col>
        <Col span={8}>
          <Button block style={buttonStyle} size={'large'} onClick={() => handleNumberClick('0')}>0</Button>
        </Col>
        <Col span={8}>
          <Button block style={confirmButtonStyle} size={'large'} onClick={handleConfirmClick}>Confirm</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Keypad;
