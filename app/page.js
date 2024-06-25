'use client'

import dynamic from 'next/dynamic'
import { useState } from "react";
import "./App.css";

const AppRouter = dynamic(() => import('./routers/AppRouter'), { ssr: false })


function App() {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div className="App" suppressHydrationWarning>
      <AppRouter navigationOpen={navigationOpen} setNavigationOpen={setNavigationOpen}/>
    </div>
  );
}

export default App;
