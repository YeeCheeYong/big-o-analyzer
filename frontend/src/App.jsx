import React from 'react';
import './App.css';
import CodeAnalysis from './components/CodeAnalysis.jsx'; // Correctly reference the CodeAnalysis component

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Big-O Analyzer</h1> {/* Update heading to reflect the app's purpose */}
      </header>
      <main>
        <CodeAnalysis /> {/* Use the CodeAnalysis component */}
      </main>
    </div>
  );
};

export default App;
