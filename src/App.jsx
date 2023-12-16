import "./App.css";
import Keypad from "./components/keypad/Keypad";
import PayScreen from "./components/payScreen/PayScreen";
import Settings from "./components/settings/Settings";
import Language from "./components/settings/Language";
import Currency from "./components/settings/Currency";
import PrivateKey from "./components/settings/PrivateKey";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';

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

  return (
    <div style={containerStyle}>
      <Router>
        <Routes>
          <Route path="/" element={<Keypad />} />
          <Route path="/payScreen" element={<PayScreen />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/language" element={<Language />} />
          <Route path="/settings/currency" element={<Currency />} />
          <Route path="/settings/private-key" element={<PrivateKey />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
