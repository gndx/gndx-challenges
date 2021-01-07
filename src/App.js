import Header from './components/Header.jsx';
import Map from './components/Map.jsx'
import AddressBar from './components/AddressBar.jsx'
import './App.css'

function App() {
  return (
    <div className="app">
          <Header/>
          <AddressBar/>
          <Map/>
    </div>
  );
}

export default App;
