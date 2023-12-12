import "./App.css";
import Keypad from "./components/keypad/Keypad";
import PayScreen from "./components/payScreen/PayScreen";
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
