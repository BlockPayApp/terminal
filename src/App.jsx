import "./App.css";
import Keypad from "./components/keypad/Keypad";

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
    <div style={containerStyle} className="container">
      <Keypad />
    </div>
  );
}

export default App;
