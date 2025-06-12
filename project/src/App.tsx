import React from 'react';
import { BooksProvider } from './context/BooksContext';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <BooksProvider>
      <div className="App">
        <Dashboard />
      </div>
    </BooksProvider>
  );
}

export default App;