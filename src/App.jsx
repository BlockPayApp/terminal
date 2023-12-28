import "./App.css";
import React, { useEffect } from "react";
import Keypad from "./components/keypad/Keypad";
import PayScreen from "./components/payScreen/PayScreen";
import Settings from "./components/settings/Settings";
import Language from "./components/settings/Language";
import Currency from "./components/settings/Currency";
import Balance from "./components/settings/Balance";
import Success from "./components/payScreen/Success";
import Failure from "./components/payScreen/Failure";
import PrivateKey from "./components/settings/PrivateKey";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { invoke } from "@tauri-apps/api";

function App() {
  const containerStyle = {
    width: '100%',
    height: '100vh',
    backgroundColor: '#efefef',
    padding: 'auto',
    position: 'fixed',
    top: 0,
    left: 0,
  }

  useEffect(() => {
    invoke('power_on');
  }, []);

  return (
    <div style={containerStyle}>
      <Router>
        <Routes>
          <Route path="/" element={<Keypad />} />
          <Route path="/payScreen/:amount" element={<PayScreen />} />
          <Route path="/payScreen/success/:memo" element={<Success />} />
          <Route path="/payScreen/failure/:memo" element={<Failure />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/balance" element={<Balance />} />
          <Route path="/settings/language" element={<Language />} />
          <Route path="/settings/currency" element={<Currency />} />
          <Route path="/settings/private-key" element={<PrivateKey />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
