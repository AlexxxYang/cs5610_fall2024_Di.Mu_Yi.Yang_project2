import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameProvider from './GameProvider';
import TitleHomePage from './TitleHomePage';
import Minesweeper from './MineSweeper';
import Rules from './Rules';
import './index.css';


const App = () => {
  return (
    <Router>
      <GameProvider>
        <Routes>
          <Route path="/" element={<TitleHomePage />} />
          <Route path="/game/:difficulty" element={<Minesweeper />} />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </GameProvider>
    </Router>
  );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

