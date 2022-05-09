import logo from './logo.svg';
import './App.css';
import { Outlet, NavLink } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <nav>
        <NavLink to="/">Koti</NavLink>|  
        <NavLink to="/Tavarat">Tavarat</NavLink>|  
        <NavLink to="/Hyllyt">Hyllyt</NavLink> 
      </nav>
      <Outlet/>
    </div>
  );
}

export default App;
