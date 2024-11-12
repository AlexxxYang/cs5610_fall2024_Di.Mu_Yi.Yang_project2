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
    ? `Game over! You ${playerWon ? "Won" : "Lost"}!`
    : "";

  
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
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="minesweeper-container">
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
              Reset
            </button>
          </div>
        </div>
      </div>

      {gameOverMessage && (
        <div className={`game-message ${playerWon ? "win-message" : "game-over-message"}`}>
          {gameOverMessage}
        </div>
      )}

      <div 
        className={`game-board ${difficultyClass}`}
        style={{
          maxWidth: windowWidth < 768 ? '95vw' : 'none',
          overflow: 'auto'
        }}
      >
        {renderBoard()}
      </div>

      <div className="game-instructions">
        <p>Right-click or hold Shift and click to place/remove flags on suspected mine locations</p>
      </div>
    </div>
  );
};

export default MineSweeper;