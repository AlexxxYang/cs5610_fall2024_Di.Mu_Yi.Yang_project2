
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Rules.css';

export default function Rules() {
  const navigate = useNavigate();

  return (
    <div className="rules-container">
      <h1 className="rules-title">How to Play Minesweeper</h1>
      
      <div className="rules-content">
        <section className="rules-section">
          <h2>Game Objective</h2>
          <p>Clear the board without detonating any mines. The number of mines to avoid depends on the difficulty level:</p>
          <ul>
            <li>Easy: 8x8 board with 10 mines</li>
            <li>Medium: 16x16 board with 40 mines</li>
            <li>Hard: 30x16 board with 99 mines</li>
          </ul>
        </section>

        <section className="rules-section">
          <h2>Basic Rules</h2>
          <ul>
            <li>Left-click a square to reveal it</li>
            <li>Right-click or hold Shift and click to place/remove flags on suspected mine locations</li>
            <li>Numbers show how many mines are adjacent to that square</li>
            <li>Use the numbers as clues to determine where mines are</li>
            <li>Flag all mines and reveal all safe squares to win</li>
          </ul>
        </section>

        <section className="rules-section">
          <h2>Numbers Guide</h2>
          <p>When you reveal a square, you might see a number:</p>
          <ul>
            <li>1: One adjacent mine</li>
            <li>2: Two adjacent mines</li>
            <li>3: Three adjacent mines</li>
            <li>And so on up to 8</li>
            <li>Empty square: No adjacent mines</li>
          </ul>
        </section>

        <section className="rules-section">
          <h2>Tips</h2>
          <ul>
            <li>Start with corners or edges - they have fewer adjacent squares</li>
            <li>Use the mine counter to track remaining mines</li>
            <li>When in doubt, try to work from known safe areas</li>
            <li>Your first click will never be a mine</li>
          </ul>
        </section>
      </div>

      <div className="rules-buttons">
        <button onClick={() => navigate('/')} className="back-button">
            Exit
        </button>
      </div>
    </div>
  );
}