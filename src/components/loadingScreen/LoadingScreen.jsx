import React from 'react';
import loading from './../../assets/loading.gif';
import { LazyLoadImage } from "react-lazy-load-image-component";

const LoadingScreen = () => {

  const containerStyle = {
    margin: 10,
    width: `calc(100vw - ${2 * 10}px)`,
    position: 'fixed',
    top: 0,
    height: '100%',
  }

  const loadingStyle = {
    width: 300,
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  return (
    <div style={containerStyle}>
      <img src={loading} style={loadingStyle} alt="loading" />
    </div>
  );
};

export default LoadingScreen;
