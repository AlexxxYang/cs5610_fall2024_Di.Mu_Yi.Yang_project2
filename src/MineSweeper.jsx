import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MineSweeper.css';
import Cell from './Cell';
import { GameContext } from './GameProvider';

const MineCounter = () => {
  const { minesCount, flaggedCells } = useContext(GameContext);
  const remainingMines = minesCount - flaggedCells.size;
  
  return (
    <div className="mine-counter">
      <span>{remainingMines}</span>
    </div>
  );
};

const MineSweeper = () => {
  const {
    gameBoardState,
    isGameOver,
    resetGame,
    playerWon,
    boardHeight,
    boardSize: boardWidth,
    windowWidth
  } = useContext(GameContext);
  
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty = location.pathname.split('/').pop();
  const difficultyClass = `difficulty-${difficulty}`;

  const gameOverMessage = isGameOver
    ? `Game ${playerWon ? "Won! 🎉" : "Over! 💣"}`
    : "";

  const calculateScale = () => {
    const padding = 40;
    const availableWidth = windowWidth - padding;
    const cellSize = 35;
    const totalWidth = boardWidth * cellSize;
    const heightSpace = window.innerHeight - 300;
    const totalHeight = boardHeight * cellSize;
    
    if (totalWidth > availableWidth || totalHeight > heightSpace) {
      const scaleByWidth = availableWidth / totalWidth;
      const scaleByHeight = heightSpace / totalHeight;
      const scale = Math.min(scaleByWidth, scaleByHeight);
      return Math.max(scale, 0.4);
    }
    
    return 1;
  };

  const renderBoard = () => {
    const rows = [];
    for (let i = 0; i < boardHeight; i++) {
      const row = [];
      for (let j = 0; j < boardWidth; j++) {
        row.push(
          <Cell
            key={`${i}-${j}`}
            row={i}
            column={j}
          />
        );
      }
      rows.push(
        <div key={i} className="row">
          {row}
        </div>
      );
    }
    return rows;
  };

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'r' || event.key === 'R') {
        resetGame();
      } else if (event.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [resetGame, navigate]);

  if (!gameBoardState || Object.keys(gameBoardState).length === 0) {
    return (
      <div className="minesweeper-container">
        <div className="loading">Loading game board...</div>
      </div>
    );
  }

  const scale = calculateScale();

  return (
    <div className="minesweeper-container">
      <div className="game-header">
        <div className="game-title">
          <h1>Minesweeper - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h1>
        </div>
      </div>

      <div className="game-controls">
        <div className="control-panel">
          <MineCounter />
          <div className="button-group">
            <button 
              onClick={() => navigate('/')} 
              className="back-button"
              title="Press ESC to exit"
            >
              Exit
            </button>
            <button 
              onClick={resetGame} 
              className="reset-button"
              title="Press R to reset"
            >
              {isGameOver ? "New Game" : "Reset"}
            </button>
          </div>
        </div>
      </div>

      {gameOverMessage && (
        <div className={`game-message ${playerWon ? "win-message" : "game-over-message"}`}>
          {gameOverMessage}
        </div>
      )}

      <div className="board-container">
        <div 
          className={`game-board ${difficultyClass}`}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center top'
          }}
        >
          {renderBoard()}
        </div>
      </div>

      <div className="game-instructions">
        <p>💡 Right-click or hold Shift and click to place/remove flags</p>
        <p>⌨️ Press R to reset game | ESC to exit</p>
      </div>
    </div>
  );
};

export default MineSweeper;