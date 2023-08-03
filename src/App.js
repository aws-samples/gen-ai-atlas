import './App.css';
import AppRouter from "./routers/AppRouter";
import { useState } from "react";

function App() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  return (
    <div className="App">
      <AppRouter navigationOpen={navigationOpen} setNavigationOpen={setNavigationOpen}/>
    </div>
  );
}

export default App;
