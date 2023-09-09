import { Outlet, useOutletContext } from "react-router-dom";

import "./App.css";
import Navigation from "./components/Navigation";

const App = () => {
  return (
    <div className="App">
      <Navigation />
      <Outlet />
    </div>
  );
};

export default App;

export function useContext() {
  return useOutletContext();
}
